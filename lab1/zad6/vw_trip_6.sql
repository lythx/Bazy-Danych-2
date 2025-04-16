create or replace view vw_trip_6
as
select t.trip_id, t.country, t.trip_date, t.trip_name, t.max_no_places,
       t.no_available_places
from trip t;