FROM richarvey/nginx-php-fpm:3.1.6

# Update and install required packages
RUN apt-get update -y \
    && apt-get install -y unzip libpq-dev libcurl4-gnutls-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath sockets

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
