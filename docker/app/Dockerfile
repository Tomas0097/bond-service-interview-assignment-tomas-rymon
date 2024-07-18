FROM python:3.12-rc-bullseye
RUN mkdir /opt/bond-service-interview-assignment
WORKDIR /opt/bond-service-interview-assignment

# Copies and installs requirements.txt
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copies files and sets permissions to be executable.
COPY docker/app/*.sh /
RUN chmod +x /*.sh

# Run a file script.
CMD /docker-start.sh