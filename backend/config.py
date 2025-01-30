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
                     for chat in user_data["messages"]][::-1]
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


def delete_chat(session_id: str, chat_title: str):
    """
    Deletes a specific chat from a user's session by chat title.

    :param session_id: The session ID of the user.
    :param chat_title: The title of the chat to be deleted.
    :return: True if the chat was deleted, False if not found.
    """
    user_data = messages_collection.find_one({"session_id": session_id})

    if user_data:
        # Check if the chat exists
        chat_exists = any(
            chat["title"] == chat_title for chat in user_data["messages"])
        if not chat_exists:
            return False  # Chat title not found, return False

        # Remove the chat with the matching title
        messages_collection.update_one(
            {"session_id": session_id},
            {"$pull": {"messages": {"title": chat_title}}}
        )
        return True  # Successfully deleted the chat

    return False  # User session not found


def delete_all_chats(session_id: str):
    """
    Deletes all chats from a user's session.

    :param session_id: The session ID of the user.
    """
    try:
        # Delete all documents matching the session_id
        result = messages_collection.delete_many({"session_id": session_id})

        if result.deleted_count > 0:
            print(f"Successfully deleted {
                  result.deleted_count} document(s) for session_id: {session_id}")
        else:
            print(f"No documents found with session_id: {session_id}")
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    return True
