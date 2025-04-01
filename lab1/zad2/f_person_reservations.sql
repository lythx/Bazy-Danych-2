create or replace function f_person_exists(person_id_ int)
    return boolean
as
    person_exists int;
begin
    select count(*) into person_exists
    from person
    where person_id = person_id_;

    return person_exists = 1;
end;



create or replace function f_person_reservations(person_id_ int)
    return t_trip_participant_table
as
    result t_trip_participant_table;
begin
    if not f_person_exists(person_id_) then
        raise_application_error(-20002, 'person not found');
    end if;

    select t_trip_participant(reservation_id, country, trip_date, trip_name,
       firstname, lastname, status, trip_id,
       person_id, no_tickets, max_no_places)
    bulk collect
    into result
    from vw_reservation
    where person_id = person_id_ and
          status != 'C';
    return result;
end;
