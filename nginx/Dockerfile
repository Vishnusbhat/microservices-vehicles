# Use the Alpine version of Nginx
FROM nginx:alpine

RUN mkdir -p /etc/nginx/logs && touch /etc/nginx/logs/access.log /etc/nginx/logs/error.log

# Copy custom Nginx configuration file to the container
COPY ./nginx.conf /etc/nginx/nginx.conf
