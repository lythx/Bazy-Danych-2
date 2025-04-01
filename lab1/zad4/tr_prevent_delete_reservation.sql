create or replace trigger tr_prevent_delete_reservation
    before delete
    on reservation
    for each row
begin
    raise_application_error(-20010, 'deleting reservations is forbidden');
end;