create or replace function f_trip_free_places(trip_id_ int)
    return int
as
    free_places int;
begin
    if not f_trip_exists(trip_id_) then
        raise_application_error(-20001, 'trip not found');
    end if;

    select no_available_places into free_places
    from vw_trip
    where trip_id = trip_id_;

    return free_places;
end;

create or replace function f_trip_is_future(trip_id_ int)
    return boolean
as
    is_future int;
begin
    if not f_trip_exists(trip_id_) then
        raise_application_error(-20001, 'trip not found');
    end if;

    select count(*) into is_future
    from vw_trip
    where trip_id = trip_id_ and
          trip_date > sysdate;

    return is_future = 1;
end;

create or replace procedure p_add_reservation
    (trip_id_ int, person_id_ int, no_tickets_ int)
as
    reservation_id_ int;
begin
    if f_trip_free_places(trip_id_) < no_tickets_ then
        raise_application_error(-20004, 'trip does not have enough free places');
    end if;

    if not f_trip_is_future(trip_id_) then
        raise_application_error(-20005, 'trip already started/ended');
    end if;

    set transaction read write;
    insert into reservation(trip_id, person_id, status, no_tickets)
    values(trip_id_, person_id_, 'N', no_tickets_)
    return reservation_id into reservation_id_;

    insert into log(reservation_id, log_date, status, no_tickets)
    values (reservation_id_, sysdate, 'N', no_tickets_);

    commit;
end;
