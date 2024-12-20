from ninja.errors import HttpError
import logging
import jwt
from utils.decode_token import decode_token
from utils.generate_tokens import generate_tokens

logger = logging.getLogger(__name__)  # Initialize a logger for this module

def get_client_ip(request):
    """
    Extract the client's IP address from the request.
    """
    x_forwarded_for = request.headers.get('X-Forwarded-For')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()  # Use the first IP in the list
    return request.META.get('REMOTE_ADDR', 'Unknown')

def logging_and_auth_decorator(view_func):
    print("Decorator registered!")  # Add this line
    def _wrapped_view(request, *args, **kwargs):
        print("Decorator in progress!")  # Add this line
        try:
            print("1. Starting decorator")
            print(f"Request headers: {dict(request.headers)}")
            
            # Check cookie
            print(f"2. Cookies: {request.COOKIES}")
            if not request.COOKIES.get('JOURNIE__SessionRefreshToken'):
                print("3. No refresh token cookie found")
                raise HttpError(401, "Unauthorized access.")
            else: print("cookie found")

            # Check Authorization header
            token = request.headers.get("Authorization")
            print(f"4. Authorization header: {token}")
            if not token or not token.startswith("Bearer "):
                print("5. Invalid token format")
                raise HttpError(401, "Unauthorized access.")
            else: print("token is valid")


            # Extract and decode token
            token = token.split(" ")[1]
            print("6. Token extracted:", token[:20] + "...")  # Show first 20 chars

            
            user_data = decode_token(token)
            print("7. Decoded user data:", user_data)
            request.user = user_data  # Set user data on the request object
            print("8. Set request.user to:", request.user)
            
            # If token has expired, handle new token generation
            # In the case of Django, treat
            if request.user:  # Ensure user data is available
                new_token = generate_tokens(request.user)
                print("10. Generated new token")
                request.new_user_session_token = new_token  # Attach the new token to the request
            else:
                print("11. user data missing on request object")
                raise HttpError(401, "failed to pass some or all relevant user-data to request object - generating new session token unsuccessful")
                
            # Call the view function, passing the correct arguments
            # print("12. Calling view function")
            # Pass the request, and any other needed parameters, to the view function
            return view_func(request, *args, **kwargs)

        except Exception as e:
            print(f"ERROR: {str(e)}")
            # Log the error and raise an internal server error
            logger.error(f"Unexpected error: {str(e)}")
            raise HttpError(500, f"Internal Server Error: {str(e)}")

    return _wrapped_view
