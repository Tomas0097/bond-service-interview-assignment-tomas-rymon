DROP DATABASE IF EXISTS bond_service_interview_assignment;
CREATE DATABASE bond_service_interview_assignment;

CREATE USER IF NOT EXISTS 'bond_service_interview_assignment'@'%' IDENTIFIED BY '1122';
GRANT ALL PRIVILEGES ON *.* TO 'bond_service_interview_assignment'@'%';