select * from f_trip_participants(2);

select * from f_person_reservations(1);

select * from f_available_trips_to('Francja', to_date('2024-10-10', 'YYYY-MM-DD'), to_date('2026-10-10', 'YYYY-MM-DD'));