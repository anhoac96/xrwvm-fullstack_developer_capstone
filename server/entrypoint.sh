#!/bin/sh

# Make migrations and migrate the database.
echo "Making migrations and migrating the database. "
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python create_superuser.py
python manage.py collectstatic --noinput
exec "$@"
