import jwt
from jwt.exceptions import PyJWTError
from django.conf import settings

def decode_token(token):
    """
    Decode and validate a JWT token.

    Args:
        token (str): The JWT token to decode.

    Returns:
        dict: The decoded payload from the token.

    Raises:
        RuntimeError: If the token has expired or is invalid.
    """
    try:
        # Decode the token and validate its signature
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        print(decoded)
        
        return decoded
    except jwt.ExpiredSignatureError:
        raise RuntimeError("Token has expired.")
    except jwt.DecodeError:
        raise RuntimeError("Token is invalid.")
    except jwt.InvalidAlgorithmError:
        raise RuntimeError("Invalid algorithm used for token.")
