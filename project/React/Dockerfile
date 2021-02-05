FROM nginx
ADD dist /usr/share/nginx/html
ADD nginx.conf /etc/nginx
ADD nginx_config /etc/nginx/nginx_config
RUN mkdir /etc/nginx/logs
RUN useradd -g staff matias
CMD [ "nginx", "-c", "/etc/nginx/nginx.conf" ]