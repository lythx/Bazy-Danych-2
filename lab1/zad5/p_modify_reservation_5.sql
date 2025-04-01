create or replace procedure p_modify_reservation_5
    (reservation_id_ int, no_tickets_ int)
as
    trip_id_ int;
    status_ char;
    cur_no_tickets int;
begin
    if not f_reservation_exists(reservation_id_) then
        raise_application_error(-20006, 'reservation not found');
    end if;

    set transaction read write;

    select trip_id, status, no_tickets into trip_id_, status_, cur_no_tickets
    from reservation
    where reservation_id = reservation_id_;

    if no_tickets_ = cur_no_tickets then
        return;
    end if;

    if status_ = 'C' then
        raise_application_error(-20008, 'can not modify no_tickets for cancelled reservation');
    end if;

    update reservation
    set no_tickets = no_tickets_
    where reservation_id = reservation_id_;

    commit;
end;