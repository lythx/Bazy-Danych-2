set transaction read write;

update reservation
set no_tickets = 14
where reservation_id = 6;

rollback;