set transaction read write;

update reservation
set no_tickets = 100
where reservation_id = 6;

update reservation
set no_tickets = -1
where reservation_id = 5;

commit;