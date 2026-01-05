#!/bin/sh

envsubst '$DOMAIN' \
  < /etc/nginx/nginx.conf.template \
  > /etc/nginx/nginx.conf

nginx -g 'daemon off;'
