from datetime import datetime
from typing import Optional
from ninja import Router, Schema
from django.shortcuts import get_object_or_404
from .models import Entry
from user.models import User
from middlewares.auth_middleware import AuthBearer
from django.http import JsonResponse
from datetime import datetime, timedelta, timezone


entry_router = Router(tags=["Entries"])

# Input schema for creating an entry
class EntryIn(Schema):
    entry_title: str
    entry_location: str
    entry_body: str

# Output schema for returning entry data
class ResponseSpecs(Schema):
    responseMessage: str
    response: Optional[dict] = None

    class Config:
        schema_extra = {
            "example": {
                "responseMessage": "Entry created successfully",
                "response": {
                    "entry": {
                        "id": 1,
                        "entry_title": "Sample Entry Title",
                        "entry_location": "Sample Location",
                        "entry_body": "This is a sample body content for the entry.",
                        "entry_index": 0,
                        "created_at": "2024-12-13T12:00:00Z",
                        "updated_at": "2024-12-13T12:00:00Z"
                    },
                    "created_by": {
                        "id": 1,
                        "full_name": "John Doe",
                        "email": "johndoe@example.com",
                        "profile_image_url": "http://example.com/image.jpg",
                        "created_at": "2024-12-13T12:00:00Z"
                    },
                    "access_token": "dummy_access_token"
                }
            }
        }

@entry_router.post(
    "/create-entry",
    response={200: ResponseSpecs},
    auth=AuthBearer(),
    summary="Create a new entry",
    description="Create a new entry with the provided details. Requires authentication.",
)
def create_entry(request, payload: EntryIn):
    """
    Endpoint to create a new entry.

    Args:
        request: The HTTP request object, containing user information.
        payload: Data provided to create the entry.

    Returns:
        ResponseSpecs: The created entry details.
    """
    user = get_object_or_404(User, id=request.user['id'])  # Fetch the authenticated user

    # Check for the last entry of the user
    last_entry = Entry.objects.filter(created_by=user).order_by('-entry_index').first()
    
    # If there is a last entry, set the new entry's index to the last entry's index + 1
    if last_entry:
        entry_index = last_entry.entry_index + 1
    else:
        # If there is no last entry, start with index 0
        entry_index = 0

    # Create the entry
    entry = Entry.objects.create(
        entry_title=payload.entry_title,
        entry_location=payload.entry_location,
        entry_body=payload.entry_body,
        entry_index=entry_index,
        created_by=user,  # Associate the entry with the authenticated user
    )

    # Prepare the response data
    response_data = {
        "entry": {
            "id": entry.id,
            "entry_title": entry.entry_title,
            "entry_location": entry.entry_location,
            "entry_body": entry.entry_body,
            "entry_index": entry.entry_index,
            "created_at": entry.created_at.isoformat(),
            "updated_at": entry.updated_at.isoformat(),
        },
        "created_by": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "profile_image_url": user.profile_image_url if hasattr(user, 'profile_image_url') else "",
            "created_at": user.created_at.isoformat()
        },
        "access_token": request.new_access_token
    }

    # Setting the refresh token cookie (already handled by the system)
    response = JsonResponse({
        "responseMessage": "Entry created successfully",
        "response": response_data,  # Include the entry and user details
    })

    response.set_cookie(
        'JOURNIE__SessionRefreshToken', request.refresh_token,
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=timedelta(days=7).total_seconds(),
    )

    return response

@entry_router.delete(
    "/delete-entry/{entry_id}",
    response={200: ResponseSpecs},
    auth=AuthBearer(),
    summary="Delete an entry",
    description="Delete an entry by its ID. Requires authentication and authorization.",
)
def delete_entry(request, entry_id: int):
    """
    Endpoint to delete an entry.

    Args:
        request: The HTTP request object, containing user information.
        entry_id: ID of the entry to delete.

    Returns:
        ResponseSpecs: Confirmation of successful deletion with the access token.
    """
    user = get_object_or_404(User, id=request.user['id'])  # Fetch the authenticated user
    entry = get_object_or_404(Entry, id=entry_id)

    # Check if the authenticated user is the creator of the entry
    if entry.created_by != user:
        return JsonResponse(
            {"detail": "Unauthorized: You do not have permission to delete this entry."},
            status=403  # Forbidden
        )
    
    # Delete the entry
    entry_data = {
        "id": entry.id,
        "entry_title": entry.entry_title,
        "entry_location": entry.entry_location,
        "entry_body": entry.entry_body,
        "entry_index": entry.entry_index,
        "created_at": entry.created_at.isoformat(),
        "updated_at": entry.updated_at.isoformat(),
    }

    # Prepare the response data
    response_data = {
        "deletedEntry": entry_data,
        "access_token": request.new_access_token
    }

    # Construct the response
    response = JsonResponse({
        "responseMessage": "Entry deletion successful",
        "response": response_data,  # Include the entry data and access_token
    })

    # Setting the refresh token cookie (handled by the system)
    response.set_cookie(
        'JOURNIE__SessionRefreshToken', request.refresh_token,
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=timedelta(days=7).total_seconds(),
    )

    return response

@entry_router.patch(
    "/update-entry/{entry_id}",
    response={200: ResponseSpecs},
    auth=AuthBearer(),
    summary="Update an entry",
    description="Update an existing entry. Requires authentication and authorization.",
)
def update_entry(request, entry_id: int, payload: EntryIn):
    """
    Endpoint to update an existing entry.

    Args:
        request: The HTTP request object, containing user information.
        entry_id: ID of the entry to update.
        payload: Data provided to update the entry.

    Returns:
        ResponseSpecs: The updated entry details with access token.
    """
    user = get_object_or_404(User, id=request.user['id'])  # Fetch the authenticated user
    entry = get_object_or_404(Entry, id=entry_id)

    # Check if the authenticated user is the creator of the entry
    if entry.created_by != user:
        return JsonResponse(
            {"detail": "Unauthorized: You do not have permission to update this entry."},
            status=403  # Forbidden
        )
    
    # Update the entry
    entry.entry_title = payload.entry_title
    entry.entry_location = payload.entry_location
    entry.entry_body = payload.entry_body
    entry.save()

    # Serialize the entry data
    entry_data = {
        "id": entry.id,
        "entry_title": entry.entry_title,
        "entry_location": entry.entry_location,
        "entry_body": entry.entry_body,
        "entry_index": entry.entry_index,
        "created_at": entry.created_at.isoformat(),
        "updated_at": datetime.now().isoformat(),  # Use the current time
    }
    # Serialize the user data
    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image_url": user.profile_image_url if hasattr(user, 'profile_image_url') else "",
        "created_at": user.created_at.isoformat()
    }

    # Prepare the response data
    response_data = {
        "entry": entry_data,
        "created_by": user_data,
        "access_token": request.new_access_token  # Use actual new access token
    }

    # Construct the response
    response = JsonResponse({
        "responseMessage": "Entry updated successfully",
        "response": response_data  # Include the updated entry and user details
    })

    # Setting the refresh token cookie (handled by the system)
    response.set_cookie(
        'JOURNIE__SessionRefreshToken', request.refresh_token,
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=timedelta(days=7).total_seconds(),
    )

    return response

@entry_router.get(
    "/get-entry/{entry_id}",
    response={200: ResponseSpecs},
    auth=AuthBearer(),
    summary="Get an entry",
    description="Get the details of a specific entry by its ID. Requires authentication.",
)
def get_entry(request, entry_id: int):
    """
    Endpoint to retrieve an entry by its ID.

    Args:
        request: The HTTP request object, containing user information.
        entry_id: ID of the entry to retrieve.

    Returns:
        ResponseSpecs: The entry details with access token.
    """
    user = get_object_or_404(User, id=request.user['id'])  # Fetch the authenticated user
    entry = get_object_or_404(Entry, id=entry_id)

    # Check if the authenticated user is the creator of the entry
    if entry.created_by != user:
        return JsonResponse(
            {"detail": "Unauthorized: You do not have permission to view this entry."},
            status=403  # Forbidden
        )

    # Serialize the entry data
    entry_data = {
        "id": entry.id,
        "entry_title": entry.entry_title,
        "entry_location": entry.entry_location,
        "entry_body": entry.entry_body,
        "entry_index": entry.entry_index,
        "created_at": entry.created_at.isoformat(),
        "updated_at": entry.updated_at.isoformat(),
    }

    # Serialize the user data
    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_image_url": user.profile_image_url if hasattr(user, 'profile_image_url') else "",
        "created_at": user.created_at.isoformat()
    }

    # Prepare the response data
    response_data = {
        "entry": entry_data,
        "created_by": user_data,
        "access_token": request.new_access_token  # Use the actual new access token
    }

    # Construct the response
    response = JsonResponse({
        "responseMessage": "Entry retrieved successfully",
        "response": response_data  # Include the entry and user details
    })

    # Setting the refresh token cookie (handled by the system)
    response.set_cookie(
        'JOURNIE__SessionRefreshToken', request.refresh_token,
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=timedelta(days=7).total_seconds(),
    )

    return response

@entry_router.get(
    "/get-all-platform-entries",
    response={200: ResponseSpecs},
    auth=AuthBearer(),
    summary="Get all platform entries",
    description="Retrieve all entries across the platform. Requires authentication.",
)
def get_all_platform_entries(request):
    """
    Endpoint to retrieve all entries across the platform.

    Args:
        request: The HTTP request object, containing user information.

    Returns:
        ResponseSpecs: A list of all entries with access token.
    """
    # Fetch the authenticated user
    user = get_object_or_404(User, id=request.user['id'])

    # Fetch all entries on the platform
    entries = Entry.objects.all().order_by('-created_at')

    # Serialize all entries data
    entries_data = []
    for entry in entries:
        creator = entry.created_by  # Fetch the creator of the entry
        entries_data.append({
            "id": entry.id,
            "entry_title": entry.entry_title,
            "entry_location": entry.entry_location,
            "entry_body": entry.entry_body,
            "entry_index": entry.entry_index,
            "created_at": entry.created_at.isoformat(),
            "updated_at": entry.updated_at.isoformat(),
            "created_by": {
                "id": creator.id if creator else None,
                "full_name": creator.full_name if creator else "Unknown",
                "email": creator.email if creator else "Unknown",
                "profile_image_url": getattr(creator, 'profile_image_url', "") if creator else "",
                "created_at": creator.created_at.isoformat() if creator else None
            } if creator else None  # Handle cases where created_by is None
        })

    # Prepare the response data
    response_data = {
        "entries": entries_data,
        "access_token": request.new_access_token  # Include the new access token
    }

    # Construct the response
    response = JsonResponse({
        "responseMessage": "Platform entries retrieved successfully",
        "response": response_data
    })

    # Set the refresh token cookie (securely)
    response.set_cookie(
        'JOURNIE__SessionRefreshToken', request.refresh_token,
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=timedelta(days=7).total_seconds(),
    )

    return response
