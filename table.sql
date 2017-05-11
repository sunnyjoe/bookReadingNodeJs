
CREATE TABLE borrowhistory
(
bookId varchar(255),
thetime int,
PRIMARY KEY (bookId)
);

CREATE TABLE bookinfo
(
bookId varchar(255),
name varchar(255),
author varchar(255),
description text,
count int,
PRIMARY KEY (bookId)
);

CREATE TABLE borrowinfo
(
bookId varchar(255),
reader varchar(255),
thetime varchar(255)
);
