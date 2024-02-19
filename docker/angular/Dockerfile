FROM nginx:1.25.3

# copy compiled code
COPY ./dist/project-tanuki /usr/share/nginx/html

# copy variabled nginx config file to listen to env variables
COPY ./docker/angular/variable-nginx.conf /etc/nginx/templates/nginx.conf.template

EXPOSE 80 443
