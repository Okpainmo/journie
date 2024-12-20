from django.db import models
from user.models import User

class Entry(models.Model):
    entry_title = models.CharField(
        max_length=255,
        blank=False,
        error_messages={"required": "Please provide an entry title"},
    )
    entry_location = models.CharField(
        max_length=255,
        blank=False,
        error_messages={"required": "Please provide an entry location"},
    )
    entry_body = models.TextField(
        blank=False,
        error_messages={"required": "Please provide the entry body"},
    )
    entry_index = models.IntegerField(
        blank=True,
        null=True,  # Optional; supports null values
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="entries",
        null=True,  # Optional field
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]  # Default ordering by creation date (most recent first)
        verbose_name = "Entry"
        verbose_name_plural = "Entries"

    def __str__(self):
        return self.entry_title

    def is_created_by(self, user: User) -> bool:
        """
        Check if the entry was created by a specific user.
        """
        return self.created_by == user
