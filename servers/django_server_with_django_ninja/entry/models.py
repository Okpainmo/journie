from django.db import models
from user.models import User

class Entry(models.Model):
    entry_title = models.CharField(
        max_length=255,  # Adjust the max_length to your requirements
        blank=False,
        error_messages={"required": "Please provide an entry title"},
    )
    entry_location = models.CharField(
        max_length=255,  # Adjust the max_length to your requirements
        blank=False,
        error_messages={"required": "Please provide an entry location"},
    )
    entry_body = models.TextField(
        blank=False,
        error_messages={"required": "Please provide the entry body"},
    )
    entry_index = models.IntegerField(
        blank=True,  # This field is optional
        # null=True,  # Allows null values
    )
    # created_by = models.ForeignKey(
    #     User,  # Replace with your custom user model if applicable
    #     on_delete=models.CASCADE,
    #     related_name="entries",
    #     # null=True,  # Make this optional as per the Node.js model
    #     # blank=True,  # Allows this field to be left blank in the admin panel
    # )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.entry_title
