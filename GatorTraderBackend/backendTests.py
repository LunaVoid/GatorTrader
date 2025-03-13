import pytest
from sanitize import validateEmail, isDuplicate, validateUsername, validatePassword 
from auth import  generateJWT, signUp, verifyJWT, isPasswordHashValid
from exceptions import jwtExpired, AppError
import jwt

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


def jwt_gen():
    test = generateJWT(123,"skibidi")
    return test

def jwt_decode(token):
    test = verifyJWT(token)
    return test
#test_username()
tokengen = jwt_gen()
tokendecode = jwt_decode(tokengen)
#print(tokendecode)

def test_encode_and_decode():
    tokengen = jwt_gen()
    tokendecode = jwt_decode(tokengen)
    print(tokendecode)
    assert tokendecode['username'] == 'skibidi'
    assert tokendecode['userid'] == 123


def test_encode_and_decode_expired():
    test = generateJWT(123,"skibidi",True)
    print(test)
    print("here")
    with pytest.raises(jwt.ExpiredSignatureError):
        final = verifyJWT(test)
        print(tokendecode)

def test_check_pass_hash(username = "hiral",password = "password1"):
    return isPasswordHashValid(username, password)[0]

#print(test_check_pass_hash())
test_encode_and_decode_expired()