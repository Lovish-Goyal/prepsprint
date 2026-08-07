import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
if not MONGODB_URI:
    raise ValueError("MONGODB_URI environment variable is not set")

DATABASE_NAME = os.getenv('DATABASE_NAME', 'prepsprint')

# Enable TLS only if not connecting to local MongoDB (localhost / 127.0.0.1)
is_local = "localhost" in MONGODB_URI or "127.0.0.1" in MONGODB_URI
client_kwargs = {
    "serverSelectionTimeoutMS": 10000
}
if not is_local:
    client_kwargs["tls"] = True
    client_kwargs["tlsCAFile"] = certifi.where()
else:
    client_kwargs["tls"] = False

client = AsyncIOMotorClient(
    MONGODB_URI,
    **client_kwargs
)

db = client[DATABASE_NAME]

async def get_db():
    return db