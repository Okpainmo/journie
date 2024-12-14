from datetime import datetime
from typing import Optional
from ninja import Router, Schema
from django.shortcuts import get_object_or_404
from .models import User
from django.contrib.auth.hashers import make_password, check_password
from ninja.errors import HttpError
from django.http import JsonResponse
from datetime import timedelta
from django.conf import settings

import jwt
from datetime import datetime, timedelta, timezone
user_router = Router()

# Input model for user registration
class InSpecs(Schema):
    full_name: str
    email: str
    password: str
    confirm_password: str
    profile_image_url: Optional[str] = ""  # Optional profile image URL


# Output schema for user data (only includes fields relevant to the response)
class UserOut(Schema):
    id: int
    full_name: str
    email: str
    profile_image_url: Optional[str] = ""  # Optional profile image URL
    created_at: datetime

# Output model for user data
class ResponseSpecs(Schema):
    # error: Optional[str] = None  # Optional error field
    responseMessage: str
    response: Optional[dict] = None  # Nested response field, which will contain preSignUpUser

    class Config:
        # Define how the nested response should be serialized
        schema_extra = {
            "example": {
                "responseMessage": "User created successfully",
                "response": {
                    "user": {
                        "id": 1,
                        "full_name": "John Doe",
                        "email": "johndoe@example.com",
                        "profile_image_url": "http://example.com/image.jpg",
                        "created_at": "2024-12-13T12:00:00Z"
                    },
                    "access_token": "access-token"
                }
            }
        }

@user_router.post("/register-user", response={201: ResponseSpecs})
def create_user(request, payload: InSpecs):
    # Check if passwords match
    if payload.password != payload.confirm_password:
        raise HttpError(400, "Passwords do not match")

    # Hash the password before saving using Django's `make_password`
    hashed_password = make_password(payload.password)

    # Create the new user with hashed password
    user = User.objects.create(
        full_name=payload.full_name,
        email=payload.email,
        password=hashed_password,
        profile_image_url=payload.profile_image_url,
    )

     # Create JWT token
    payload_data = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),  # Token expiration (1 hour)
        "iat": datetime.now(timezone.utc)  # Issued at time
    }

    access_token = jwt.encode(payload_data, settings.SECRET_KEY, algorithm="HS256")

    # Serialize the user data to match the output format
    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image_url": user.profile_image_url,
        "created_at": user.created_at.isoformat()  # Ensure the date is serializable
    }

    # Set the cookie options
    response = JsonResponse({
        "responseMessage": "User created successfully",
        "response": {
            "user": user_data,
            "access_token": access_token  # Add serialized user data here
        }
    })

   

    # Set a secure cookie with additional options
    response.set_cookie(
        'user_token', 'your_token_value',
        httponly=True,  # Makes the cookie inaccessible to JavaScript
        secure=True,    # Ensures the cookie is only sent over HTTPS
        samesite='Strict',  # Prevents CSRF attacks by restricting cross-site cookie sharing
        max_age=timedelta(days=7),  # Set the expiration time for the cookie
        expires=timedelta(days=7)  # Ensure the cookie is set to expire in 7 days
    )

    return response

@user_router.post("/log-in-user", response={200: ResponseSpecs})
def log_in_user(request, payload: InSpecs):
    """
    Logs in a user by validating their credentials.
    """
    # Retrieve the user based on the email
    user = get_object_or_404(User, email=payload.email)

    # Verify the password using Django's `check_password`
    if not check_password(payload.password, user.password):
        raise HttpError(401, "Invalid email or password")

    # Serialize the user data (excluding the password)
    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image_url": user.profile_image_url,
        "created_at": user.created_at.isoformat()  # Ensure the date is serializable
    }

     # Create JWT token
    payload_data = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),  # Token expiration (1 hour)
        "iat": datetime.now(timezone.utc)  # Issued at time
    }

    access_token = jwt.encode(payload_data, settings.SECRET_KEY, algorithm="HS256")

    # Serialize the user data to match the output format
    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image_url": user.profile_image_url,
        "created_at": user.created_at.isoformat()  # Ensure the date is serializable
    }

     # Set the cookie options
    response = JsonResponse({
        "responseMessage": "User created successfully",
        "response": {
            "user": user_data,
            "access_token": access_token  # Add serialized user data here
        }
    })

    # Set a secure cookie with additional options
    response.set_cookie(
        'user_token', 'your_token_value',
        httponly=True,  # Makes the cookie inaccessible to JavaScript
        secure=True,    # Ensures the cookie is only sent over HTTPS
        samesite='Strict',  # Prevents CSRF attacks by restricting cross-site cookie sharing
        max_age=timedelta(days=7),  # Set the expiration time for the cookie
        expires=timedelta(days=7)  # Ensure the cookie is set to expire in 7 days
    )

    return response
