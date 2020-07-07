CREATE OR REPLACE package pg_package as

  G_FALSE constant number default 0;
  G_TRUE  constant number default 1;
 
  procedure add_payment(
     pCustomer in number,
     pExternal in varchar2,
     pDate in date,
     pValue in number,
     oBalance out number,
     oStatus out number,
     pForced in number default G_FALSE
  );
  
end pg_package;
/

CREATE OR REPLACE package body pg_package as

G_SUCCESS_STATUS constant number default 1;
G_FAILED_STATUS  constant number default 2;

procedure add_payment(
   pCustomer in number,
   pExternal in varchar2,
   pDate in date,
   pValue in number,
   oBalance out number,
   oStatus out number,
   pForced in number default G_FALSE
) as
  lBalance number;
  lStatus number default G_SUCCESS_STATUS;
  cursor cBalance is
  select BALANCE_VALUE into lBalance from BALANCE where ID = pCustomer;
begin
  open cBalance;
  fetch cBalance into lBalance;
  if cBalance%notfound then
     lBalance := 0;
  end if;  
  close cBalance;
  if lBalance >= pValue or pForced = G_TRUE then       
     update BALANCE 
     set BALANCE_VALUE = BALANCE_VALUE - pValue
     , BALANCE_DATE = pDate
     where  ID = pCustomer;
     if sql%rowcount = 0 then
        insert into BALANCE(ID, BALANCE_VALUE, BALANCE_DATE)
        values (pCustomer, -pValue, pDate);
     end if;
     lBalance := lBalance - pValue;  
  else
     lStatus := 2;
  end if;
  insert into PAYMENT(ID, CUSTOMER_ID, PAYMENT_DATE, PAYMENT_VALUE, EXTERNAL_ID, PAYMENT_STATUS)
  values (PAYMENT_SEQ.nextval, pCustomer, pDate, pValue, pExternal, lStatus);
  oBalance := lBalance;
  oStatus := lStatus;  
  commit;
end;

end pg_package;
/
