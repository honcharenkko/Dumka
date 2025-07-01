from fastapi import HTTPException, Request, Response, APIRouter
from pydantic import BaseModel

from authx import AuthX, AuthXConfig

# Create a FastAPI app
router = APIRouter()

# Configure AuthX
auth_config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY="your-secret-key",  # In production, use a secure key and store it in environment variables
    # Configure token locations
    JWT_TOKEN_LOCATION=["headers", "cookies", "json", "query"],
    # Header settings
    JWT_HEADER_TYPE="Bearer",
    # Cookie settings
    JWT_ACCESS_COOKIE_NAME="access_token_cookie",
    JWT_REFRESH_COOKIE_NAME="refresh_token_cookie",
    JWT_COOKIE_SECURE=False,  # Set to True in production with HTTPS
    JWT_COOKIE_CSRF_PROTECT=False,  # Disable CSRF protection for testing
    JWT_ACCESS_CSRF_COOKIE_NAME="csrf_access_token",
    JWT_REFRESH_CSRF_COOKIE_NAME="csrf_refresh_token",
    JWT_ACCESS_CSRF_HEADER_NAME="X-CSRF-TOKEN-Access",
    JWT_REFRESH_CSRF_HEADER_NAME="X-CSRF-TOKEN-Refresh",
    # JSON body settings
    JWT_JSON_KEY="access_token",
    JWT_REFRESH_JSON_KEY="refresh_token",
    # Query string settings
    JWT_QUERY_STRING_NAME="token",
)

# Initialize AuthX
auth = AuthX(config=auth_config)




# Define models
class User(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenBody(BaseModel):
    access_token: str


# Sample user database (in a real app, you would use a database)
USERS = {
    "user1": {"password": "password1", "email": "user1@example.com"},
    "user3": {"password": "string", "email": "string"},
    "user2": {"password": "password2", "email": "user2@example.com"},
}


@router.post("/login")
def login(user: User, response: Response):
    """Login endpoint that validates credentials and returns tokens."""
    # Check if user exists and password is correct
    if user.username in USERS and USERS[user.username]["password"] == user.password:
        try:
            # Create access and refresh tokens
            access_token = auth.create_access_token(user.username)
            refresh_token = auth.create_refresh_token(user.username)

            # Set tokens in cookies if cookies are enabled
            if "cookies" in auth_config.JWT_TOKEN_LOCATION:
                auth.set_access_cookies(response, access_token)
                auth.set_refresh_cookies(response, refresh_token)

            # Return tokens in response body
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "message": "Tokens are set in cookies and returned in the response body",
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e)) from e

    # Return error if credentials are invalid
    raise HTTPException(status_code=401, detail="Invalid username or password")


@router.post("/logout")
def logout(response: Response):
    """Logout endpoint that clears the cookies."""
    auth.unset_jwt_cookies(response)
    return {"message": "Successfully logged out"}
