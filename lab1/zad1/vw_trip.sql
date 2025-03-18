create or replace view vw_trip
as
select trip_id, country, trip_date, trip_name, max_no_places,
       max_no_places - count(*) as no_available_places
from vw_reservation
group by trip_id, country, trip_date, trip_name, max_no_places