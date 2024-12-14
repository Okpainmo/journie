from django.db import models
import bcrypt

class User(models.Model):
    full_name = models.CharField(
        max_length=255,
        blank=False,
        error_messages={"required": "Please provide your full name"},
    )
    email = models.EmailField(
        unique=True,
        blank=False,
        error_messages={
            "required": "Please provide your email address",
            "invalid": "Enter a valid email address",
        },
    )
    password = models.CharField(
        max_length=128,
        blank=False,
        error_messages={"required": "Please provide your password"},
    )
    confirm_password = models.CharField(
        max_length=128,
        blank=False,
        error_messages={"required": "Please confirm your password"},
    )
    profile_image_url = models.URLField(
        max_length=2048,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Hash password before saving if it is raw
        if hasattr(self, "raw_password") and self.raw_password:
            if self.raw_password != self.raw_confirm_password:
                raise ValueError("Passwords do not match")
            self.password = bcrypt.hashpw(self.raw_password.encode(), bcrypt.gensalt()).decode()
            del self.raw_password  # Remove raw_password to prevent accidental storage
            del self.raw_confirm_password
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        """
        Check if the provided password matches the hashed password stored in the database.
        """
        return bcrypt.checkpw(raw_password.encode(), self.password.encode())

    def __str__(self):
        return self.email
