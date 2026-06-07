from sqlalchemy import Column, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy import Uuid as UUID
from app.models.base import BaseModel, Base

role_permissions = Table(
    'role_permissions', Base.metadata,
    Column('role_id', UUID(as_uuid=True), ForeignKey('roles.id'), primary_key=True),
    Column('permission_id', UUID(as_uuid=True), ForeignKey('permissions.id'), primary_key=True)
)

class Permission(BaseModel):
    __tablename__ = "permissions"
    code = Column(String(100), unique=True, index=True)
    name = Column(String(255))
    description = Column(String)

class Role(BaseModel):
    __tablename__ = "roles"
    name = Column(String(100), unique=True, index=True)
    description = Column(String)
    
    permissions = relationship("Permission", secondary=role_permissions, backref="roles")
    users = relationship("User", back_populates="role")

class User(BaseModel):
    __tablename__ = "users"
    badge_number = Column(String(50), unique=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20))
    password_hash = Column(String)
    
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"))
    station_id = Column(UUID(as_uuid=True), ForeignKey("police_stations.id"), nullable=True)
    
    is_active = Column(Boolean, default=True)
    
    role = relationship("Role", back_populates="users")
    # station relation will be added in location model
