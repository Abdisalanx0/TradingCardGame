-- This file is for (re)creating the database schema

DROP TABLE IF EXISTS tcg_user;

CREATE TABLE tcg_user (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255)
);