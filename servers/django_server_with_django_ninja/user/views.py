from datetime import datetime, timedelta, timezone
from typing import Optional, List
from ninja import Router, Schema
from django.shortcuts import get_object_or_404
from .models import User
from django.contrib.auth.hashers import make_password, check_password
from ninja.errors import HttpError
from django.http import JsonResponse
from django.conf import settings
import jwt
from middlewares.auth_middleware import AuthBearer

user_router = Router()

# Input model for user registration
class LoginInSpecs(Schema):
    email: str
    password: str

class RegisterInSpecs(Schema):
    full_name: str
    email: str
    password: str
    confirm_password: str
    profile_image_url: Optional[str] = None  # Add this field to your schema


# Output schema for user data
class UserOut(Schema):
    id: int
    full_name: str
    email: str
    profile_image_url: Optional[str] = ""
    created_at: datetime

class ResponseSpecs(Schema):
    responseMessage: str
    response: Optional[dict] = None

    class Config:
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

# Output schema for getting all users
class GetAllUsersResponseSpecs(Schema):
    responseMessage: str
    response: List[UserOut]

    class Config:
        schema_extra = {
            "example": {
                "responseMessage": "Users fetched successfully",
                "response": [
                    {
                        "id": 1,
                        "full_name": "John Doe",
                        "email": "johndoe@example.com",
                        "profile_image_url": "http://example.com/image.jpg",
                        "created_at": "2024-12-13T12:00:00Z"
                    },
                    {
                        "id": 2,
                        "full_name": "Jane Doe",
                        "email": "janedoe@example.com",
                        "profile_image_url": "http://example.com/jane_image.jpg",
                        "created_at": "2024-12-14T12:00:00Z"
                    }
                ],
                "access_token": 'dummy_access_token'
            }
        }

@user_router.post("/register-user", response={201: ResponseSpecs})
def create_user(request, payload: RegisterInSpecs):
    client = request.headers.get('client')

    if not client or client.strip() == "":
        raise HttpError(400, "client data must be provided on request header")
    
    if payload.password != payload.confirm_password:
        raise HttpError(400, "Passwords do not match")

    if User.objects.filter(email=payload.email).exists():
        raise HttpError(400, "A user with this email already exists")

    hashed_password = make_password(payload.password)

    user = User.objects.create(
        full_name=payload.full_name,
        email=payload.email,
        password=hashed_password,
        profile_image_url=payload.profile_image_url,
    )

    payload_data = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc)
    }

    access_token = jwt.encode(payload_data, settings.SECRET_KEY, algorithm="HS256")

    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image_url": user.profile_image_url,
        "created_at": user.created_at.isoformat()
    }

    response = JsonResponse({
        "responseMessage": "User created successfully",
        "response": {
            "user": user_data,
            "access_token": access_token
        }
    })

    hashed_email = make_password(user.email)
    hashed_jwt_secret = make_password(settings.SECRET_KEY)

    response.set_cookie(
        'JOURNIE__SessionRefreshToken', f'SessionRefreshToken___{hashed_jwt_secret}___{hashed_email}',
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=timedelta(days=7).total_seconds(),
    )

    return response

@user_router.post("/log-in-user", response={200: ResponseSpecs})
def log_in_user(request, payload: LoginInSpecs):
    client = request.headers.get('client')

    if not client or client.strip() == "":
        raise HttpError(400, "client data must be provided on request header")
    
    user = get_object_or_404(User, email=payload.email)

    if not user.check_password(payload.password):
        raise HttpError(401, "Invalid email or password")

    payload_data = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc)
    }

    access_token = jwt.encode(payload_data, settings.SECRET_KEY, algorithm="HS256")

    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image_url": user.profile_image_url,
        "created_at": user.created_at.isoformat()
    }

    response = JsonResponse({
        "responseMessage": "User logged in successfully",
        "response": {
            "user": user_data,
            "access_token": access_token
        }
    })

    hashed_email = make_password(user.email)
    hashed_jwt_secret = make_password(settings.SECRET_KEY)

    # sessionToken = f'SessionRefreshToken___{hashed_jwt_secret}___{hashed_email}'
    # print(sessionToken)

    response.set_cookie(
        'JOURNIE__SessionRefreshToken', f'SessionRefreshToken___{hashed_jwt_secret}___{hashed_email}',
        httponly=True,
        secure=True,
        samesite='Strict',
        expires=datetime.now(timezone.utc) + timedelta(days=7)
    )

    return response

# New endpoint to get a single user by ID
@user_router.get("/get-user/{user_id}", response={200: UserOut}, auth=AuthBearer(),
)
def get_user(request, user_id: int):
    """
    Endpoint to get details of a specific user by their ID.

    Args:
        request: The HTTP request object, containing user information.
        user_id: ID of the user to fetch.

    Returns:
        UserOut: User details.
    """
    
    user = get_object_or_404(User, id=user_id)

    # Serialize the user using the UserOut schema
    user_data = UserOut.from_orm(user)

    response = JsonResponse({
        "responseMessage": "User fetched successfully",
        "response": {'user':user_data.dict(), "access_token": request.new_access_token}
    })

    response.set_cookie(
       'JOURNIE__SessionRefreshToken', request.refresh_token,
       httponly=True,
       secure=True,
       samesite='Strict',
       max_age=timedelta(days=7).total_seconds(),
   )
    
    return response


# New endpoint to get all users
@user_router.get("/get-all-users", response={200: GetAllUsersResponseSpecs}, auth=AuthBearer())
def get_all_users(request):
    """
    Endpoint to fetch all users.

    Args:
        request: The HTTP request object, containing user information.

    Returns:
        GetAllUsersResponseSpecs: List of all users.
    """
    users = User.objects.all()
    user_list = [UserOut.from_orm(user).dict() for user in users]

    response = JsonResponse({
       "responseMessage": "Your message here",  # Update with appropriate message
       "response": {'user_list': user_list, "access_token": request.new_access_token}  # Update with appropriate response data
   })
    
    response.set_cookie(
       'JOURNIE__SessionRefreshToken', request.refresh_token,
       httponly=True,
       secure=True,
       samesite='Strict',
       max_age=timedelta(days=7).total_seconds(),
   )
    
    return response
