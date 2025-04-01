create or replace function f_trip_exists(trip_id_ int)
    return boolean
as
    trip_exists int;
begin
    select count(*) into trip_exists
    from trip
    where trip_id = trip_id_;

    return trip_exists = 1;
end;

create or replace type t_trip_participant as object
(
    reservation_id int,
    country varchar(50),
    trip_date date,
    trip_name varchar(100),
    firstname varchar(50),
    lastname varchar(50),
    status char(1),
    trip_id int,
    person_id int,
    no_tickets int,
    max_no_places int
);

create or replace type t_trip_participant_table is table of t_trip_participant;

create or replace function f_trip_participants(trip_id_ int)
    return t_trip_participant_table
as
    result t_trip_participant_table;
begin
    if not f_trip_exists(trip_id_) then
        raise_application_error(-20001, 'trip not found');
    end if;

    select t_trip_participant(reservation_id, country, trip_date, trip_name,
       firstname, lastname, status, trip_id,
       person_id, no_tickets, max_no_places)
    bulk collect
    into result
    from vw_reservation
    where trip_id = trip_id_ and
          status != 'C';
    return result;
end;
