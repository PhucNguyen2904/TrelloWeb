import sys
sys.path.insert(0, '.')
import bcrypt

# Seed hash for password: password123
h = "$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMUG"
pw = "password123"

print(f"bcrypt version: {bcrypt.__version__}")
print(f"Hash bytes: {h.encode('utf-8')}")
print(f"PW bytes:   {pw[:72].encode('utf-8')}")

try:
    result = bcrypt.checkpw(pw[:72].encode("utf-8"), h.encode("utf-8"))
    print(f"checkpw result: {result}")
except Exception as e:
    print(f"checkpw EXCEPTION: {type(e).__name__}: {e}")

# Also try without truncation
try:
    result2 = bcrypt.checkpw(pw.encode("utf-8"), h.encode("utf-8"))
    print(f"checkpw (no truncate) result: {result2}")
except Exception as e:
    print(f"checkpw (no truncate) EXCEPTION: {type(e).__name__}: {e}")

# Try rehashing to verify the hash itself is valid
try:
    salt = bcrypt.gensalt(12)
    new_hash = bcrypt.hashpw(pw.encode("utf-8"), salt)
    print(f"New hash for same pw: {new_hash}")
    print(f"Verify new hash: {bcrypt.checkpw(pw.encode('utf-8'), new_hash)}")
except Exception as e:
    print(f"hashpw EXCEPTION: {type(e).__name__}: {e}")
