DROP DATABASE IF EXISTS biblereading;
CREATE DATABASE biblereading;

\c biblereading;

CREATE TABLE readinglog
(
name varchar(255),
log text,
date BIGINT
);

CREATE TABLE userinfo
(
name varchar(255),
password varchar(255)
);

CREATE TABLE bookinfo
(
bookId varchar(255),
name varchar(255),
description text
);

CREATE TABLE borrowLog
(
userName varchar(255),
bookId varchar(255)
);