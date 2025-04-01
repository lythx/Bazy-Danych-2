create or replace procedure p_add_reservation_5
    (trip_id_ int, person_id_ int, no_tickets_ int)
as
    reservation_id_ int;
begin
    if not f_trip_is_future(trip_id_) then
        raise_application_error(-20005, 'trip already started/ended');
    end if;

    insert into reservation(trip_id, person_id, status, no_tickets)
    values(trip_id_, person_id_, 'N', no_tickets_)
    return reservation_id into reservation_id_;
end;
