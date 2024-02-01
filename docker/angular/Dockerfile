FROM nginx:1.25.3

COPY ./dist/project-tanuki /usr/share/nginx/html

COPY ./docker/angular/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
