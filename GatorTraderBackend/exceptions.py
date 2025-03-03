class AppError(Exception):
    """Base exception for custom errors"""
    pass

class DatabaseConnectionError(AppError):
    """Raised when the app can't connect to the database"""
    pass

class DuplicateError(AppError):
    """Raised when a duplicate record is found"""
    pass

class ValidationError(AppError):
    """Raised for invalid inputs"""
    pass
