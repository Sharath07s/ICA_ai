from fastapi import APIRouter
from app.api.v1 import auth, users, crimes, chat, investigations, ws, suspects

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(crimes.router, prefix="/crimes", tags=["crimes"])
api_router.include_router(suspects.router, prefix="/suspects", tags=["suspects"])
api_router.include_router(investigations.router, prefix="/investigations", tags=["investigations"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(ws.router, prefix="/ws", tags=["websocket"])
