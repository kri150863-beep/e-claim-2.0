FROM php:8.2-apache

# system deps for common PHP extensions used by Symfony / Doctrine
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev zlib1g-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql intl zip opcache

# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy project and install dependencies (will be overwritten by volume in dev, but useful for image build)
COPY . /var/www/html

# install PHP deps
RUN composer install --no-interaction --no-progress --prefer-dist || true

# Apache config to use public/ as document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && a2enmod rewrite

# permissions for Symfony var and vendor
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var vendor || true

EXPOSE 80
CMD ["apache2-foreground"]