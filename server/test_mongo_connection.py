import os
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://lovishgoyaldev_db_user:OYdKD4lqHFUzRA2C@cluster0.m9ebw8w.mongodb.net/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'prepsprint')

async def test_connection():
    try:
        client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        db = client[DATABASE_NAME]
        # Try to list collections to test connection
        collections = await db.list_collection_names()
        print('Connection successful! Collections:', collections)
    except Exception as e:
        print('Connection failed:', e)
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())
