CREATE TYPE "user_role_enum" AS ENUM ('admin', 'agent', 'viewer');

CREATE TYPE "gender_enum" AS ENUM ('male', 'female');

CREATE TYPE "department_enum" AS ENUM (
  'primary',
  'middle',
  'high',
  'rover_candidates',
  'scout',
  'vip',
  'normal'
);

CREATE TABLE
  "users" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL,
    "phone" varchar UNIQUE NOT NULL,
    "password" varchar NOT NULL,
    "role" user_role_enum NOT NULL DEFAULT 'agent'
  );

CREATE TABLE
  "reserved_tickets" (
    "id" serial PRIMARY KEY,
    "ticket_id" varchar(4) NOT NULL UNIQUE,
    "name" varchar NOT NULL,
    "phone" varchar NOT NULL,
    "gender" gender_enum NOT NULL,
    "with_bus" bool NOT NULL DEFAULT false,
    "department" department_enum NOT NULL,
    "is_sms_sent" bool NOT NULL DEFAULT false,
    "agent" int NOT NULL
  );

ALTER TABLE "reserved_tickets" ADD FOREIGN KEY ("agent") REFERENCES "users" ("id");