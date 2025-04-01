create or replace view vw_reservation
as
select reservation_id, country, trip_date, trip_name,
       firstname, lastname, status, r.trip_id,
       r.person_id, no_tickets, max_no_places
from reservation r
join trip t on t.trip_id = r.trip_id
join person p on p.person_id = r.person_id;