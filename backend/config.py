from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://kalina003d:<db_password>@chatbot.d32rc.mongodb.net/?retryWrites=true&w=majority&appName=ChatBot"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

db = client["chatbot_db"]
messages_collection = db["messages"]


def get_messages(user_id: str):
    user_data = messages_collection.find_one({"user_id": user_id})
    if user_data:
        return user_data["messages"]
    return []


def add_message(user_id: str, message: dict):
    user_data = messages_collection.find_one({"user_id": user_id})
    if user_data:
        messages_collection.update_one(
            {"user_id": user_id},
            {"$push": {"messages": message}}
        )
    else:
        messages_collection.insert_one(
            {"user_id": user_id, "messages": [message]})
