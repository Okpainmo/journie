from ninja.security import HttpBearer
import jwt
from django.conf import settings
import json
from datetime import datetime, timedelta
from utils.generate_tokens import generate_tokens
from user.models import User
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from ninja.errors import HttpError


class AuthBearer(HttpBearer):
    
    def authenticate(self, request, token):
        try:
            email = request.headers.get("email")
            authorization = request.headers.get("authorization")
            client = request.headers.get('client')
            # print(email, authorization, client)

            if not email or email.strip() == "" or not authorization or authorization.strip() == "" or not client or client.strip() == "":
                print("request header data missing")
                # return JsonResponse(
                #     {"detail": "email, authorization and client data must be provided on request header"},
                #     status=400  # Bad request
                # )
                raise HttpError(400, "email, authorization and client data must be provided on request header")

            user = get_object_or_404(User, email=email).serialized_user()
            # print(user)

            # Check for the specific cookie "JOURNIE__SessionRefreshToken"
            refresh_token = request.COOKIES.get("JOURNIE__SessionRefreshToken")
            if not refresh_token:
                # print("JOURNIE__SessionRefreshToken cookie not found")
                raise HttpError(400, "Session refresh token is missing from cookies")
                # return JsonResponse(
                #     {"detail": "Session refresh token is missing from cookies"},
                #     status=400  # Bad request
                # )            
            # Print request details (optional)
            # print("Request Payload (Serialized):", parsed_payload)
            # print("Request Headers:", dict(request.headers))
            # print("Request Cookies:", request.COOKIES)

            hashed_refresh_token_secret = refresh_token.split("___")[1]
            hashed_email = refresh_token.split("___")[2]

            if not check_password(settings.SECRET_KEY, hashed_refresh_token_secret) or not check_password(user.get("email"), hashed_email):
                raise HttpError(401, "request rejected - invalid refresh token detected")

                #  return JsonResponse(
                #     {"detail": "request rejected - invalid refresh token detected"},
                #     status=401  # Bad request
                # )         
            
            # print(user.serialized_user())

            """ this new access token will be passed along with every new request to prevent 
             a token expiration error so that the user can have seamless sessions as long as they 
             remain active on the platform within the duration permitted before the current token expires
            """           
            new_access_token = generate_tokens({"user_id": user.get('id'), "email": user.get('email')})
            # print(new_access_token)

            request.new_access_token = new_access_token
            request.refresh_token = refresh_token
            request.user = user

            # Generate a new token (for example, when session refresh is required)
            # new_token = self.generate_token(payload["user_id"])
            # print("Generated New Token:", new_token)

            # Decode and parse the request body
            # request_payload = request.body
            # if request_payload:
            #     try:
            #         parsed_payload = json.loads(request_payload.decode('utf-8'))
            #     except json.JSONDecodeError:
            #         parsed_payload = None
            # else:
            #     parsed_payload = None

            # Print request details (optional)
            # print("Request Payload (Serialized):", parsed_payload)
            # print("Request Headers:", dict(request.headers))
            # print("Request Cookies:", request.COOKIES)
            # Decode the JWT token - the process will be rejected/ended if token is expired
            jwt_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            # print(jwt_payload)

            return jwt_payload
        except jwt.ExpiredSignatureError:
            print("Token has expired.")
            raise HttpError(401, "access denied - access token is expired")

            # return JsonResponse(
            #     {"detail": "access denied - access token is expired"},
            #     status=401  # Bad request
            # )  
            # return None
        except jwt.InvalidTokenError:
            print("Invalid token.")
            raise HttpError(401, "access denied - invalid token")

            # return JsonResponse(
            #     {"detail": "access denied - invalid token"},
            #     status=401  # Bad request
            # )
            # return None
