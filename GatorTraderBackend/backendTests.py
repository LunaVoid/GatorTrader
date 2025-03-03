import pytest
from userQueries import validateEmail, isDuplicate, validateUsername, validatePassword


def test_find_duplicates():
    testEmail = "test@test.com"
    assert isDuplicate(testEmail) is False


def test_username():
    testUsername = "skibidi"
    assert validateUsername(testUsername) is True


def test_password():
    testPass = "skibidi"
    assert validatePassword(testPass) is True


def test_email():
    testPass = "yay@yay.com"
    assert validateEmail(testPass) is True


def test_invalid_email():
    with pytest.raises(ValueError):
        validateEmail(None)


test_username()

