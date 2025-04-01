create or replace view vw_available_trip
as
select * from vw_trip
where no_available_places > 0 and trip_date > sysdate;