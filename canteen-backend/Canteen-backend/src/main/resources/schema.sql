-- Schema for in-memory H2 database
-- Runs before data.sql so that the INSERTs succeed

CREATE TABLE staff (
    username     VARCHAR(50) PRIMARY KEY,
    password     VARCHAR(100) NOT NULL,
    name         VARCHAR(100) NOT NULL,
    role         VARCHAR(20)  NOT NULL,
    department   VARCHAR(100),
    staff_id     VARCHAR(20)  UNIQUE
);
