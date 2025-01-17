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


def get_chats(session_id: str):
    user_data = messages_collection.find_one({"session_id": session_id})
    if user_data:
        all_chats = [{"title": chat["title"], "content": chat["content"][::-1]}
                     for chat in user_data["messages"]]
        return all_chats
    return []


def add_message(session_id: str, new_message: dict):
    user_data = messages_collection.find_one({"session_id": session_id})
    if user_data:
        # Check if the title exists
        chat_found = False
        for chat in user_data["messages"]:
            if chat["title"] == new_message.title:
                chat_found = True
                messages_collection.update_one(
                    {"session_id": session_id,
                        "messages.title": new_message.title},
                    {"$push": {"messages.$.content": new_message.content}}
                )
                break

        # If the title does not exist, add a new chat with this title
        if not chat_found:
            messages_collection.update_one(
                {"session_id": session_id},
                {"$push": {"messages": {
                    "title": new_message.title, "content": [new_message.content]}}}
            )
    else:
        # Create a new session with the first message
        messages_collection.insert_one(
            {"session_id": session_id, "messages": [
                {"title": new_message.title, "content": [new_message.content]}]}
        )
