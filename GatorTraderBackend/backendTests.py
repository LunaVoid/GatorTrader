import pytest
from userQueries import validateEmail, isDuplicate, validateUsername, validatePassword, signUp


def test_find_duplicates():
    testEmail = "test@test.com"
    assert isDuplicate(testEmail) is False


def test_real_duplicate():
    testEmail = "hiralshukla@ufl.edu"
    assert isDuplicate(testEmail) is True


def test_username():
    testUsername = "skibidi"
    assert validateUsername(testUsername) is True


def test_password():
    testPass = "skibidi"
    assert validatePassword(testPass) is True


def test_email():
    testPass = "yay@yay.com"
    assert validateEmail(testPass) is True


def invalid_test_email():
    testPass = "SELECT * FROM USERS \\ @gmail.com"
    assert validateEmail(testPass) is False


def test_invalid_email():
    validateEmail(None) is False


test_username()
