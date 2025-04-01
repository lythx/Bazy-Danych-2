create or replace trigger tr_log_reservation
    after insert or update
    on reservation
    for each row
begin
    insert into log(reservation_id, log_date, status, no_tickets)
    values (:NEW.reservation_id, sysdate, :NEW.status, :NEW.no_tickets);
end;