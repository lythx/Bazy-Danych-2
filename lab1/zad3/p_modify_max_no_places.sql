create or replace function f_trip_taken_places(trip_id_ int)
    return int
as
    taken_places int;
begin
    if not f_trip_exists(trip_id_) then
        raise_application_error(-20001, 'trip not found');
    end if;

    select max_no_places - no_available_places into taken_places
    from vw_trip
    where trip_id = trip_id_;

    return taken_places;
end;

create or replace procedure p_modify_max_no_places
    (trip_id_ int, max_no_places_ int)
as begin
    if f_trip_taken_places(trip_id_) > max_no_places_ then
        raise_application_error(-20009, 'trip has too many taken places');
    end if;

    update trip
    set max_no_places = max_no_places_
    where trip_id = trip_id_;
end;
