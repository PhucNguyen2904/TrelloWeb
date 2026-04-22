from app.db.session import SessionLocal
from app.model.user import User
from app.model.role import Role
from app.core.security import hash_password

def create_admin():
    db = SessionLocal()
    try:
        # Check if user role exists
        user_role = db.query(Role).filter(Role.name == "user").first()
        if not user_role:
            user_role = Role(name="user", description="Default user role")
            db.add(user_role)
            db.commit()
            db.refresh(user_role)
            print("Created 'user' role.")
        
        # Check if superadmin role exists
        super_admin_role = db.query(Role).filter(Role.name == "superadmin").first()
        if not super_admin_role:
            super_admin_role = Role(name="superadmin", description="Super Administrator role with full system access")
            db.add(super_admin_role)
            db.commit()
            db.refresh(super_admin_role)
            print("Created 'superadmin' role.")

        # Check if admin role exists
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            admin_role = Role(name="admin", description="Administrator role with access to user management")
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)
            print("Created 'admin' role.")

        # Check if super admin user exists
        super_admin_email = "superadmin@example.com"
        super_admin_user = db.query(User).filter(User.email == super_admin_email).first()
        if not super_admin_user:
            super_admin_user = User(
                email=super_admin_email,
                hashed_password=hash_password("superadmin123"),
                role_id=super_admin_role.id
            )
            db.add(super_admin_user)
            db.commit()
            db.refresh(super_admin_user)
            print(f"Created super admin user: {super_admin_email} / superadmin123")
        else:
            # Update existing to ensure it is superadmin
            super_admin_user.role_id = super_admin_role.id
            db.commit()
            print(f"Super admin user already exists. Assured role is 'superadmin'. Email: {super_admin_email} / superadmin123")

        # Check if admin user exists
        admin_email = "admin@example.com"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            admin_user = User(
                email=admin_email,
                hashed_password=hash_password("admin123"),
                role_id=admin_role.id
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Created admin user: {admin_email} / admin123")
        else:
            # Update existing to ensure it is admin
            admin_user.role_id = admin_role.id
            db.commit()
            print(f"Admin user already exists. Assured role is 'admin'. Email: {admin_email} / admin123")

    finally:
        db.close()

if __name__ == "__main__":
    print("Running create_admin script...")
    create_admin()

