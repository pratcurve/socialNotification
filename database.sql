
-- create database notify
create database notify;

-- //create User table in notify database
create table user (user_id int(10) NOT NULL AUTO_INCREMENT, email text, fcm text, PRIMARY KEY(user_id))


-- //create subscribe table in notify database
create table subscribe (subscribe_id int NOT NULL AUTO_INCREMENT, user_id int, subscribe_table text(255), subscribe_coloumn text(255),
		primary key (subscribe_id), foreign key(user_id) References user(user_id) ON DELETE CASCADE)

-- create database social of which tables can be subscribe_id
create database social;

-- create table city in social database
create table city(city_id int(11) NOT NULL AUTO_INCREMENT, city_name text, state text, pincode text, PRIMARY KEY (city_id));

-- create table person in social database
create table person(person_id int(11) NOT NULL AUTO_INCREMENT, name text, mobile text, PRIMARY KEY(person_id));