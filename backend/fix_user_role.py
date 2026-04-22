from app.db.session import SessionLocal
from app.model.user import User

db = SessionLocal()
user = db.query(User).filter(User.email == 'a123@gmail.com').first()
if user:
    user.role_id = 4  # role "user"
    db.commit()
    print(f"Updated user a123@gmail.com role_id to 4 (user)")
else:
    print("User not found")
db.close()
