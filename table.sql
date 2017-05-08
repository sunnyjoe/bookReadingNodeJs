DROP DATABASE IF EXISTS biblereading;
CREATE DATABASE biblereading;

\c biblereading;

CREATE TABLE borrowhistory
(
bookId varchar(255),
thetime varchar(255)
);

CREATE TABLE bookinfo
(
bookId varchar(255),
name varchar(255),
author varchar(255),
description text,
count int
);

CREATE TABLE borrowinfo
(
bookId varchar(255),
reader varchar(255),
thetime varchar(255)
);
