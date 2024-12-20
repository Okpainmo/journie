from django.db import models
from django.contrib.auth.hashers import make_password, check_password, is_password_usable  # Added import

class User(models.Model):
    full_name = models.CharField(
        max_length=255,
        blank=False
    )
    email = models.EmailField(
        unique=True,
        blank=False
    )
    password = models.CharField(
        max_length=128,
        blank=False
    )
    profile_image_url = models.URLField(
        max_length=2048,
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
    # Hash the password only if it isn't already hashed
        if not is_password_usable(self.password):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def serialized_user(self):
        """Returns a serialized version of the user object."""
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "profile_image_url": self.profile_image_url,
            "is_active": self.is_active,
            "is_staff": self.is_staff,
            "is_superuser": self.is_superuser,
            "created_at": self.created_at,
            # "updated_at": self.updated_at,
        }


    def __str__(self):
        return f"Email: {self.email}, Password: {self.password}"

