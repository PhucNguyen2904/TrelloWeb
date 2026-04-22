from jose import jwt, JWTError
key = 'your-secret-key-change-in-production'
alg = 'HS256'
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImV4cCI6MTc3NjY4MTg2N30.me0wp4VDwkxGxeRmdszX__rqAufqJKCEkqKuXgHd2Tg'
try:
    print('Decoding...')
    payload = jwt.decode(token, key, algorithms=[alg])
    print('Success:', payload)
except JWTError as e:
    print('Error:', e)
