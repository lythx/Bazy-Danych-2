set transaction read write;

-- trip
insert into trip(trip_name, country, trip_date, max_no_places)
values ('Wycieczka do Paryza', 'Francja', to_date('2023-09-12', 'YYYY-MM-DD'), 7);

insert into trip(trip_name, country, trip_date,  max_no_places)
values ('Piekny Krakow', 'Polska', to_date('2025-05-03','YYYY-MM-DD'), 3);

insert into trip(trip_name, country, trip_date,  max_no_places)
values ('Znow do Francji', 'Francja', to_date('2025-05-01','YYYY-MM-DD'), 5);

insert into trip(trip_name, country, trip_date,  max_no_places)
values ('Hel', 'Polska', to_date('2025-05-01','YYYY-MM-DD'),  4);

-- person
insert into person(firstname, lastname)
values ('Jan', 'Nowak');

insert into person(firstname, lastname)
values ('Jan', 'Kowalski');

insert into person(firstname, lastname)
values ('Jan', 'Nowakowski');

insert into person(firstname, lastname)
values ('Novak', 'Nowak');

insert into person(firstname, lastname)
values ('Maciej', 'Kowalczyk');

insert into person(firstname, lastname)
values ('Mateusz', 'Koniczyna');

insert into person(firstname, lastname)
values ('Piotr', 'Baza');

insert into person(firstname, lastname)
values ('Marek', 'Borkowski');

insert into person(firstname, lastname)
values ('Agnieszka', 'Dudek');

insert into person(firstname, lastname)
values ('Amelia', 'Jaworska');

-- reservation
-- trip1
insert into reservation(trip_id, person_id, status)
values (1, 1, 'P');

insert into reservation(trip_id, person_id, status)
values (1, 2, 'N');

insert into reservation(trip_id, person_id, status)
values (1, 6, 'C');

insert into reservation(trip_id, person_id, status)
values (1, 8, 'P');

insert into reservation(trip_id, person_id, status)
values (1, 4, 'P');

-- trip 2
insert into reservation(trip_id, person_id, status)
values (2, 1, 'P');

insert into reservation(trip_id, person_id, status)
values (2, 4, 'C');

insert into reservation(trip_id, person_id, status)
values (2, 9, 'P');

-- trip 3
insert into reservation(trip_id, person_id, status)
values (2, 4, 'P');

insert into reservation(trip_id, person_id, status)
values (3, 4, 'P');

commit