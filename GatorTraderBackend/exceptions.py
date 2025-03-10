class AppError(Exception):
    """Base exception for custom errors"""
    pass


class InvalidEmailError(AppError):
    """Raised because Bad Email"""
    pass


class InvalidPassword(AppError):
    """Raised because Bad Password"""
    pass


class DatabaseConnectionError(AppError):
    """Raised when the app can't connect to the database"""
    pass


class DuplicateError(AppError):
    """Raised when a duplicate record is found"""
    pass


class DuplicateUsernameError(AppError):
    """Raised because Bad Email"""
    pass


class ValidationError(AppError):
    """Raised because Bad Email"""
    pass
