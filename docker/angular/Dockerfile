FROM nginx:1.25.3

COPY ./dist/project-tanuki /usr/share/nginx/html

#default onepage nginx configuration on localhost without variabals
#COPY ./docker/angular/nginx.conf /etc/nginx/nginx.conf

COPY ./docker/angular/variable-nginx.conf /etc/nginx/templates/nginx.conf.template

EXPOSE 80 443
