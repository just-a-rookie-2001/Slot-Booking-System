import uuid
from django.db import models
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser)


class UserManager(BaseUserManager):
    def create_user(self, email, name="", user_type="N", workplace="Not Known", password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(email=self.normalize_email(email))
        user.name = name
        user.user_type = user_type
        user.workplace = workplace
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email,
            password=password,
        )
        user.user_type = "N"
        user.admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    types_of_user = [
        ("F", "Faculty"),
        ("C", "Club"),
        ("N", "Not Assigned"),
    ]

    objects = UserManager()
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(verbose_name='email address', max_length=255, unique=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    user_type = models.CharField(max_length=1, choices=types_of_user, default="N")
    workplace = models.CharField(default="Not Known", max_length=255)
    password_reset_token = models.BigIntegerField(null=True, blank=True)
    admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_admin(self):
        return self.admin

    @property
    def is_staff(self):
        return self.admin
