#!/bin/bash

function wait_for_db() {
    until mysqladmin ping -h "localhost" --silent; do
        echo "Waiting for DB to be ready..."
        sleep 2
    done
    echo "DB is up and running!"
}

wait_for_db

mysql < /db-init.sql
