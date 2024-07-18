#!/bin/bash

cd /opt/bond-service-interview-assignment

# install/upgrade Python packages based on requirements.txt
pip3 install --no-cache-dir -r requirements.txt

# Django server
python3 -u src/manage.py runserver 0.0.0.0:8088
