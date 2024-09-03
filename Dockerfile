FROM richarvey/nginx-php-fpm:3.1.6

# Update and install required packages
RUN apk update && \
    apk add --no-cache \
        libpq-dev \
        curl \
        unzip \
        php8-pdo \
        php8-pdo_mysql \
        php8-bcmath \
        php8-sockets

COPY . .

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["/start.sh"]
