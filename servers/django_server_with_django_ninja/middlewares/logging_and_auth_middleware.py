from ninja.errors import HttpError
from utils import decode_token
import logging

logger = logging.getLogger(__name__)  # Initialize a logger for this module

def get_client_ip(request):
    """
    Extract the client's IP address from the request.

    Args:
        request (HttpRequest): The incoming HTTP request.

    Returns:
        str: The client's IP address.
    """
    x_forwarded_for = request.headers.get('X-Forwarded-For')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()  # Use the first IP in the list
    return request.META.get('REMOTE_ADDR', 'Unknown')

def logging_and_auth_middleware(next_handler):
    """
    Middleware to handle request logging and token-based authentication.

    Args:
        next_handler (callable): The next handler in the middleware chain.

    Returns:
        callable: A middleware function.

    Raises:
        HttpError: If the authentication token is invalid or missing.
    """
    def middleware(request, *args, **kwargs):
        try:
            # Log the incoming request details
            logger.info(f"Request received: Path={request.path}, Headers={dict(request.headers)}")

            if not request.COOKIES.get('my_cookie'):
                logger.warning("Required cookie 'my_cookie' not found.")
                raise HttpError(400, "Required cookie is missing.")

            # Extract the authorization token from headers
            token = request.headers.get("Authorization")
            if not token or not token.startswith("Bearer "):
                logger.warning(f"Unauthorized access attempt. Path={request.path}, IP={get_client_ip(request)}")
                raise HttpError(401, "Unauthorized: Missing or invalid token format.")
            
            # Validate the token and extract user details
            token = token.split(" ")[1]  # Remove the "Bearer" prefix
            request.user = decode_token(token)  # Custom logic in decode_token
            logger.info(f"Authenticated request: User={request.user.get('email', 'Unknown')}")

            # Proceed to the next handler
            return next_handler(request, *args, **kwargs)

        except HttpError as e:
            logger.error(f"HttpError encountered: {str(e)}, Path={request.path}, IP={get_client_ip(request)}")
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in middleware: {str(e)}, Path={request.path}, IP={get_client_ip(request)}")
            raise HttpError(500, "Internal Server Error")
    
    return middleware
