create or replace trigger tr_update_no_available_places_6b
    before insert or update
    on reservation
    for each row
declare
    taken_places_change int;
begin
    taken_places_change := 0;

    if :NEW.status != 'C' then
        taken_places_change := taken_places_change + :NEW.no_tickets;
    end if;

    if updating and :OLD.status != 'C' then
        taken_places_change := taken_places_change - :OLD.no_tickets;
    end if;

    update trip
    set no_available_places = no_available_places - taken_places_change
    where trip_id = :NEW.trip_id;

end;