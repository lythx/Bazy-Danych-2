create or replace view vw_trip
as
select t.trip_id, t.country, t.trip_date, t.trip_name, t.max_no_places,
       t.max_no_places - nvl(sum(no_tickets), 0) as no_available_places
from trip t
left join vw_reservation vr on vr.trip_id = t.trip_id
where status != 'C' or vr.trip_id is null
group by t.trip_id, t.country, t.trip_date, t.trip_name, t.max_no_places;