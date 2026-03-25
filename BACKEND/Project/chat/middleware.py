import jwt
from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.conf import settings
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from django.contrib.auth.models import AnonymousUser

@database_sync_to_async
def get_user(validated_token):
    try:
        user_id = validated_token["user_id"]
        return get_user_model().objects.get(id=user_id)
    except get_user_model().DoesNotExist:
        return AnonymousUser()

class JwtAuthMiddleware(BaseMiddleware):
    """
    Custom middleware that takes a JWT token from the query string and authenticates the user.
    """

    async def __call__(self, scope, receive, send):
        # Get token from query parameter 'token'
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token_list = query_params.get("token")
        if token_list:
            token = token_list[0]
            try:
                # Validate the token. This will raise an error if invalid.
                validated_token = UntypedToken(token)
                # Attach the user to the scope
                scope["user"] = await get_user(validated_token)
            except (InvalidToken, TokenError, Exception):
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()
        return await super().__call__(scope, receive, send)