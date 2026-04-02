import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

users_to_create = [
    {
        "username": "root",
        "email": "root@example.com",
        "password": "Root123!",
        "is_superuser": True,
    },
    {
        "username": "capstoneadmin",
        "email": "capstoneadmin@example.com",
        "password": "Capstone123!",
        "is_superuser": True,
    },
]

for user_config in users_to_create:
    username = user_config["username"]
    if User.objects.filter(username=username).exists():
        print(f"{username} already exists.")
        continue

    User.objects.create_superuser(
        username,
        user_config["email"],
        user_config["password"],
    )
    print(f"{username} created successfully.")
