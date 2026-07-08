import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is not set")

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