import json
from flask import (
    abort,
    jsonify,
    request,
    _request_ctx_stack
)
from functools import wraps
from jose import jwt
from urllib.request import urlopen

AUTH0_DOMAIN = 'fsnd-app-nickanthony.us.auth0.com'
ALGORITHMS = ['RS256']
API_AUDIENCE = 'casting-agency'


class AuthError(Exception):
    """AuthError Exception

    A standardized way to communicate auth failure modes.
    """
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header

    Attempts to get the header from the request.
    Rasies an AuthError if no header is present.
    Attempts to split bearer and the token.
    Raises an AuthError if the header is malformed.

    Returns:
        token: The token part of the header
    """
    auth = request.headers.get('Authorization', None)
    if not auth:
        raise AuthError({
            'code': 'authorization_header_missing',
            'description': 'Authorization header is expected.'
        }, 401)

    parts = auth.split()
    if parts[0].lower() != 'bearer':
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must start with "Bearer".'
        }, 401)

    elif len(parts) == 1:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Token not found.'
        }, 401)

    elif len(parts) > 2:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must be bearer token.'
        }, 401)

    token = parts[1]
    return token


def check_permissions(permission, payload):
    """Checks permission in a given payload.

    Raises an AuthError if permissions are not included in the payload.
    (NOTE check your RBAC settings in Auth0)

    Raises an AuthError if the requested permission string is not in the
    payload permissions array.

    Args:
        permission: string permission (i.e. 'post:drink')
        payload: decoded jwt payload


    Returns:
        true on success
    """
    if 'permissions' not in payload:
        raise AuthError({
            'code': 'invalid_claims',
            'description': 'Permissions not included in JWT.'
        }, 400)

    if permission not in payload['permissions']:
        raise AuthError({
            'code': 'unauthorized',
            'description': 'Permission not found.'
        }, 403)
    return True


def verify_decode_jwt(token):
    """Verifies the token is valid.

    Token is an Auth0 token with key id (kid).
    Verifies the token using Auth0 /.well-known/jwks.json
    Decodes the payload from the token.
    Validates the claims.

    NOTE: urlopen has a common certificate error described here:
    https://stackoverflow.com/questions/50236117/scraping-ssl-certificate-verify-failed-error-for-http-en-wikipedia-org

    Args:
        token: a json web token (string)

    Returns:
        The decoded payload
    """
    jsonurl = urlopen(f'https://{AUTH0_DOMAIN}/.well-known/jwks.json')
    try:
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
    except Exception as e:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization malformed.'
        }, 401)
    rsa_key = {}
    if 'kid' not in unverified_header:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization malformed.'
        }, 401)
    for key in jwks['keys']:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer='https://' + AUTH0_DOMAIN + '/'
            )

            return payload

        except jwt.ExpiredSignatureError:
            raise AuthError({
                'code': 'token_expired',
                'description': 'Token expired.'
            }, 401)

        except jwt.JWTClaimsError:
            raise AuthError({
                'code': 'invalid_claims',
                'description': ('Incorrect claims. Please, check the audience'
                                'and issuer.')
            }, 401)
        except Exception:
            raise AuthError({
                'code': 'invalid_header',
                'description': 'Unable to parse authentication token.'
            }, 400)

    raise AuthError({
                'code': 'invalid_header',
                'description': 'Unable to find the appropriate key.'
            }, 400)


def requires_auth(permission=''):
    """Decorator method for endpoints that require authentication.

    Uses the get_token_auth_header method to get the token
    Uses the verify_decode_jwt method to decode the jwt
    Uses the check_permissions method validate claims and check the requested
    permission.

    Args:
        permission: string permission (i.e. 'post:actors')

    Returns:
        The decorator which passes the decoded payload to the decorated method.
    """
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = get_token_auth_header()
            try:
                payload = verify_decode_jwt(token)
            except AuthError as e:
                return jsonify({
                    "success": False,
                    "error": e.error['code'],
                    "code": e.status_code,
                    "message": e.error['description'],
                }), 401
            except Exception as e:
                abort(401)
            try:
                check_permissions(permission, payload)
            except AuthError as e:
                return jsonify({
                    "success": False,
                    "error": e.error['code'],
                    "code": e.status_code,
                    "message": e.error['description'],
                }), 401
            except Exception as e:
                abort(401)
            return f(payload, *args, **kwargs)

        return wrapper
    return requires_auth_decorator
