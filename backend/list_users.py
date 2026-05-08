from sqlalchemy import text
from app.db.session import engine

with engine.connect() as connection:
    result = connection.execute(text("SELECT email, full_name, is_active FROM public.user"))
    users = result.fetchall()
    print("Users in database:")
    for user in users:
        print(f"- {user.email} ({user.full_name}), active: {user.is_active}")
