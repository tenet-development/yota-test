create table CUSTOMER_STATUS (
  ID             NUMBER                  NOT NULL,
  NAME           VARCHAR2(100)           NOT NULL
);

create unique index PK_CUSTOMER_STATUS on CUSTOMER_STATUS(ID);

alter table CUSTOMER_STATUS add
  constraint PK_CUSTOMER_STATUS primary key (ID);

create sequence CUSTOMER_SEQ;

create table CUSTOMER (
  ID             NUMBER                  NOT NULL,
  MSISDN         VARCHAR2(15)            NOT NULL,
  STATUS         NUMBER                  NOT NULL
);

create unique index PK_CUSTOMER on CUSTOMER(ID);

alter table CUSTOMER add
  constraint PK_CUSTOMER primary key (ID);

alter table CUSTOMER add
  constraint FK_CUSTOMER foreign key (STATUS)
     references CUSTOMER_STATUS(ID);

create sequence BALANCE_SEQ;

create table BALANCE (
  ID             NUMBER                  NOT NULL,
  BALANCE_VALUE  NUMBER DEFAULT 0        NOT NULL,
  BALANCE_DATE   DATE   DEFAULT sysdate  NOT NULL
);

create unique index PK_BALANCE on BALANCE(ID);

alter table BALANCE add
  constraint PK_BALANCE primary key (ID);

alter table BALANCE add
  constraint FK_BALANCE foreign key (ID)
     references CUSTOMER(ID);

create table PAYMENT_STATUS (
  ID             NUMBER                  NOT NULL,
  NAME           VARCHAR2(100)           NOT NULL
);

create unique index PK_PAYMENT_STATUS on PAYMENT_STATUS(ID);

alter table PAYMENT_STATUS add
  constraint PK_PAYMENT_STATUS primary key (ID);

create sequence PAYMENT_SEQ;

create table PAYMENT (
  ID             NUMBER                  NOT NULL,
  CUSTOMER_ID    NUMBER                  NOT NULL,
  PAYMENT_DATE   DATE   DEFAULT sysdate  NOT NULL,
  PAYMENT_VALUE  NUMBER                  NOT NULL,
  EXTERNAL_ID    VARCHAR2(100)           NOT NULL,
  PAYMENT_STATUS NUMBER                  NOT NULL
);

create unique index PK_PAYMENT on PAYMENT(ID);

create index FK_PAYMENT_CUSTOMER on PAYMENT(CUSTOMER_ID);

alter table PAYMENT add
  constraint PK_PAYMENT primary key (ID);

alter table PAYMENT add
  constraint FK_PAYMENT foreign key (PAYMENT_STATUS)
     references PAYMENT_STATUS(ID);

alter table PAYMENT add
  constraint FK_PAYMENT_CUSTOMER foreign key (CUSTOMER_ID)
     references CUSTOMER(ID);
