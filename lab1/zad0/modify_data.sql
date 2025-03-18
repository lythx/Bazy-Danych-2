set transaction read write;

update reservation
set no_tickets = 1
where reservation_id in (2, 4, 7);

update reservation
set no_tickets = 2
where reservation_id in (1, 3, 9);

update reservation
set no_tickets = 3
where reservation_id in (5, 8);

update reservation
set no_tickets = 4
where reservation_id in (6, 10);

commit;