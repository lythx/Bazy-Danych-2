alter table reservation
add no_tickets int;

alter table reservation
add constraint reservation_no_tickets_chk check
(no_tickets > 0);

alter table log
add no_tickets int;

alter table log
add constraint log_no_tickets_chk check
(no_tickets > 0);
