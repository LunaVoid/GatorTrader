import os
import time
import jwt
import ntplib
import requests
from datetime import datetime, timezone, timedelta

def check_system_time():
    print("===== SYSTEM TIME DIAGNOSTIC TOOL =====\n")
    
    # 1. Print current system time
    local_time = datetime.now()
    utc_time = datetime.utcnow()
    
    print(f"Local system time: {local_time}")
    print(f"UTC system time: {utc_time}")
    print(f"UTC timestamp: {utc_time.timestamp()}")
    
    # 2. Check against external time sources
    print("\n===== EXTERNAL TIME COMPARISONS =====")
    
    # Try NTP server
    try:
        ntp_client = ntplib.NTPClient()
        response = ntp_client.request('pool.ntp.org', version=3)
        ntp_time = datetime.fromtimestamp(response.tx_time, timezone.utc)
        ntp_offset = response.offset  # Time difference in seconds
        
        print(f"NTP time: {ntp_time}")
        print(f"NTP offset: {ntp_offset:.2f} seconds")
        
        if abs(ntp_offset) > 10:
            print("⚠️ WARNING: Your system clock differs from NTP by more than 10 seconds!")
    except Exception as e:
        print(f"Failed to get NTP time: {e}")
    
    # Try HTTP time API
    try:
        response = requests.get("https://worldtimeapi.org/api/ip", timeout=5)
        api_data = response.json()
        api_time = datetime.fromisoformat(api_data['datetime'].replace('Z', '+00:00'))
        
        time_diff = utc_time.replace(tzinfo=timezone.utc) - api_time
        diff_seconds = time_diff.total_seconds()
        
        print(f"WorldTimeAPI time: {api_time}")
        print(f"Difference from system UTC: {diff_seconds:.2f} seconds")
        
        if abs(diff_seconds) > 10:
            print("⚠️ WARNING: Your system clock differs from WorldTimeAPI by more than 10 seconds!")
    except Exception as e:
        print(f"Failed to get WorldTimeAPI time: {e}")
    
    # 3. Test JWT token with current time
    print("\n===== JWT TOKEN TIME TEST =====")
    
    # Generate a token with current time
    current_time = int(datetime.utcnow().timestamp())
    payload = {
        'userid': 999,
        'username': 'diagnostic_test',
        'exp': current_time + 3600,  # 1 hour in future
        'iat': current_time
    }
    
    secret = os.environ.get('TOPSECRET', 'diagnostic_secret')
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    print(f"Test token payload:")
    print(f" - iat: {current_time} ({datetime.utcfromtimestamp(current_time)})")
    print(f" - exp: {payload['exp']} ({datetime.utcfromtimestamp(payload['exp'])})")
    
    # Try decoding with various settings
    print("\nDecoding test results:")
    decode_tests = [
        {"name": "Default verification", "options": {"verify_signature": True, "verify_exp": True, "verify_iat": True}},
        {"name": "Without iat verification", "options": {"verify_signature": True, "verify_exp": True, "verify_iat": False}},
        {"name": "With 30s leeway", "options": {"verify_signature": True, "verify_exp": True, "verify_iat": True}, "leeway": 30},
        {"name": "With 2min leeway", "options": {"verify_signature": True, "verify_exp": True, "verify_iat": True}, "leeway": 120},
    ]
    
    for test in decode_tests:
        try:
            if "leeway" in test:
                decoded = jwt.decode(token, secret, algorithms=["HS256"], options=test["options"], leeway=test["leeway"])
                print(f"✓ {test['name']} - SUCCESS (with {test['leeway']}s leeway)")
            else:
                decoded = jwt.decode(token, secret, algorithms=["HS256"], options=test["options"])
                print(f"✓ {test['name']} - SUCCESS")
        except Exception as e:
            print(f"✗ {test['name']} - FAILED: {type(e).__name__}: {e}")
    
    print("\n===== RECOMMENDATIONS =====")
    print("1. Ensure your system clock is synchronized with NTP")
    print("2. If the time offset is significant, run: sudo ntpdate -u pool.ntp.org")
    print("3. For macOS: System Preferences > Date & Time > Set date and time automatically")
    print("4. For Windows: Settings > Time & Language > Date & time > Set time automatically")
    print("5. For Linux: sudo timedatectl set-ntp true")

if __name__ == "__main__":
    check_system_time()