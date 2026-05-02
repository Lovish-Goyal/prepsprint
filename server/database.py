import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv(
    'MONGODB_URI',
    'mongodb+srv://lovishgoyaldev_db_user:OYdKD4lqHFUzRA2C@cluster0.m9ebw8w.mongodb.net/prepsprint?retryWrites=true&w=majority'
)

DATABASE_NAME = os.getenv('DATABASE_NAME', 'prepsprint')

client = AsyncIOMotorClient(
    MONGODB_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=10000
)

db = client[DATABASE_NAME]

async def get_db():
    return db

Base = None
engine = None
SessionLocal = None