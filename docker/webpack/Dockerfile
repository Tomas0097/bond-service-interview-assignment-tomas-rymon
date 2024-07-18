FROM node:22-bullseye

# Copies files and sets permissions to be executable.
COPY docker/webpack/*.sh /
RUN chmod +x /*.sh

# Run a file script.
CMD /docker-start.sh

# CMD ["tail", "-f", "/dev/null"]