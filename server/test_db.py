import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://lovishgoyaldev_db_user:OYdKD4lqHFUzRA2C@cluster0.m9ebw8w.mongodb.net/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'prepsprint')

async def test_connection():
    client = AsyncIOMotorClient(MONGODB_URI)
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("Connected successfully to MongoDB")
        db = client[DATABASE_NAME]
        collections = await db.list_collection_names()
        print(f"Collections in {DATABASE_NAME}: {collections}")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())
