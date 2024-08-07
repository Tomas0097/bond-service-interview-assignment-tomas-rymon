.DEFAULT_GOAL := default
SHELL := /bin/bash

manage_command = docker exec -it bond-service-interview-assignment-app /manage.sh


default:
	@echo "Please specify target. Check contents of Makefile to see list of available targets."

prepare_database:
	docker exec -it bond-service-interview-assignment-db /db-init.sh

makemigrations:
	$(manage_command) makemigrations -n '_' $(options) web

makemigrations_data:
	$(manage_command) makemigrations -n '_' --empty web

migrate:
	$(manage_command) migrate $(app) $(migration)

create_default_superuser:
	$(manage_command) createsuperuser --noinput

pip_install:
	docker exec -it bond-service-interview-assignment-app /pip.sh

app_bash:
	docker exec -it bond-service-interview-assignment-app bash

test:
	$(manage_command) test

manage:
	$(manage_command) $(command)

up:
	cd docker/ && docker-compose up

down:
	cd docker/ && docker-compose down
