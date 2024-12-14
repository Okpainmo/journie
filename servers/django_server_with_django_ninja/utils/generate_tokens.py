import jwt
from jwt.exceptions import PyJWTError
from datetime import datetime, timedelta, timezone
from django.conf import settings

def generate_tokens(user):
    """
    Generate a JWT access token for a given user.

    Args:
        user (User): The user object for whom the token is generated.

    Returns:
        str: Encoded JWT token.

    Raises:
        ValueError: If required user attributes are missing.
        RuntimeError: If token generation fails due to an unforeseen error.
    """
    try:
        # Validate required user attributes
        if not hasattr(user, 'id') or not hasattr(user, 'email'):
            raise ValueError("User object must have 'id' and 'email' attributes.")

        # Define token payload
        payload_data = {
            "user_id": user.id,
            "email": user.email,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),  # Token expiration (1 hour)
            "iat": datetime.now(timezone.utc),  # Issued at time
        }

        # Encode the token
        access_token = jwt.encode(payload_data, settings.SECRET_KEY, algorithm="HS256")

        return access_token

    except ValueError as e:
        # Handle cases where user attributes are missing
        raise ValueError(f"Invalid user object: {e}")

    except PyJWTError as e:
        # Handle JWT-specific errors
        raise RuntimeError(f"Failed to generate token due to JWT error: {e}")

    except Exception as e:
        # Catch any other unforeseen exceptions
        raise RuntimeError(f"An unexpected error occurred during token generation: {e}")
