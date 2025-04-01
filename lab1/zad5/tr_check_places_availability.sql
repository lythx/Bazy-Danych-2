create or replace trigger tr_check_places_availability
    before insert or update
    on reservation
    for each row
declare
    taken_places_change int := 0;
    max_no_places_ int;
begin
    select max_no_places into max_no_places_
    from trip t
    where t.trip_id = :NEW.trip_id;

    if :NEW.status != 'C' then
        taken_places_change := taken_places_change + :NEW.no_tickets;
    end if;

    if updating and :OLD.status != 'C' then
        taken_places_change := taken_places_change - :OLD.no_tickets;
    end if;

    if taken_places_change + f_trip_taken_places(:NEW.trip_id) > max_no_places_ then
        raise_application_error(-20004, 'trip does not have enough free places');
    end if;
end;