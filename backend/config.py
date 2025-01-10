from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGODB_URI')

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client["chatbot_db"]
messages_collection = db["messages"]


def get_messages(session_id: str):
    user_data = messages_collection.find_one({"session_id": session_id})
    if user_data:
        return user_data["messages"]
    return []


def add_message(session_id: str, message: dict):
    user_data = messages_collection.find_one({"session_id": session_id})
    if user_data:
        messages_collection.update_one(
            {"session_id": session_id},
            {"$push": {"messages": message}}
        )
    else:
        messages_collection.insert_one(
            {"session_id": session_id, "messages": [message]})
