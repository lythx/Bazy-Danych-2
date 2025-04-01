create or replace type t_trip as object
(
    trip_id int,
    trip_name varchar(100),
    country varchar(50),
    trip_date date,
    max_no_places int,
    no_available_places int
);

create or replace type t_trip_table as table of t_trip;

create or replace function f_available_trips_to(country_ varchar2, date_from date, date_to date)
    return t_trip_table
as
    result t_trip_table;
begin
    if date_from >= date_to then
        raise_application_error(-20003, 'date_from must be lesser than date_to');
    end if;

    select t_trip(trip_id, trip_name, country,
                  trip_date, max_no_places, no_available_places)
    bulk collect
    into result
    from vw_available_trip vat
    where country = country_ and
          trip_date >= date_from and
          trip_date <= date_to;
    return result;
end;
