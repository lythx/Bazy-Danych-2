create or replace function f_reservation_exists(reservation_id_ int)
    return boolean
as
    reservation_exists int;
begin
    select count(*) into reservation_exists
    from reservation
    where reservation_id = reservation_id_;

    return reservation_exists = 1;
end;

create or replace function f_is_valid_status(status_ char)
    return boolean
as begin
    return status_ in ('N', 'P', 'C');
end;

create or replace procedure p_modify_reservation_status
    (reservation_id_ int, status_ char)
as
    cur_status char;
    trip_id_ int;
    no_tickets_ int;
begin
    if not f_reservation_exists(reservation_id_) then
        raise_application_error(-20006, 'reservation not found');
    end if;

    if not f_is_valid_status(status_) then
        raise_application_error(-20007, 'invalid reservation status');
    end if;

    set transaction read write;

    select trip_id, status, no_tickets into trip_id_, cur_status, no_tickets_
    from reservation
    where reservation_id = reservation_id_;

    if cur_status = status_ then
        return;
    end if;

    if cur_status = 'C' and f_trip_free_places(trip_id_) = 0 then
        raise_application_error(-20004, 'trip does not have enough free places');
    end if;

    update reservation
    set status = status_
    where reservation_id = reservation_id_;

    insert into log(reservation_id, log_date, status, no_tickets)
    values (reservation_id_, sysdate, status_, no_tickets_);

    commit;
end;