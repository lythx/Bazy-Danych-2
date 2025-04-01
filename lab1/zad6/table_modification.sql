alter table trip add
no_available_places int null;

update trip t
set no_available_places = (select v.no_available_places from vw_trip v where v.trip_id = t.trip_id)
where 1 = 1;