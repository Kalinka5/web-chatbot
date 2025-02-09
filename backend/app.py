from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from openai import OpenAI

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import timezone, datetime

import os
import uuid
from dotenv import load_dotenv

from utils.open_ai import openai_answer
from utils.scraplib import Scraplib
from config import get_chats, add_message, delete_all_chats, delete_chat
from schemas import Message

load_dotenv()
uri = os.getenv('MONGODB_URI')

# Initialize MongoDB client
db_client = MongoClient(uri, server_api=ServerApi('1'))
db = db_client["chatbot_db"]
chatbots_collection = db["chatbots"]

# deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')

# client = OpenAI(api_key=deepseek_api_key, base_url="https://api.deepseek.com")
client = OpenAI()  # For gpt-4o-mini
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust origins as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create chatbot
@app.post("/chatbots")
async def create_chatbot(request: Request):
    body = await request.json()
    domain = body.get("domain")

    if not domain:
        raise HTTPException(status_code=400, detail="Domain is required")

    chatbot_id = str(uuid.uuid4().int)[:10]

    # Scrape website data
    scraper = Scraplib(domain)
    urls = scraper.urls_sitemap()
    scraper.save_urls_to_file(urls, f"{chatbot_id}_urls.txt")
    data = scraper.scrap_all_pages(f"{chatbot_id}_urls.txt")
    scraper.save_data_to_file(data, f"{chatbot_id}_data.txt")

    chatbot_data = {
        "chatbot_id": chatbot_id,
        "domain": domain,
        "scraped_data_file": f"static/{chatbot_id}_data.txt",
        "created_at": datetime.now(timezone.utc)
    }

    chatbots_collection.insert_one(chatbot_data)

    embed_code = f"""
    <script>
        window.chtlConfig = {{ chatbotId: '{chatbot_id}' }};
    </script>
    <script async data-id='{chatbot_id}' id='chatling-embed-script' type='text/javascript' src='https://kalinka5.github.io/web-chatbot/embed-chatbot.js'></script>
    """

    return {"chatbot_id": chatbot_id, "embed_code": embed_code}


# Get chatbot info
@app.get("/chatbots/{chatbot_id}")
async def get_chatbot(chatbot_id: str):
    chatbot = chatbots_collection.find_one({"chatbot_id": chatbot_id})
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    return chatbot


# Delete chatbot
@app.delete("/chatbots/{chatbot_id}")
async def delete_chatbot(chatbot_id: str):
    result = chatbots_collection.delete_one({"chatbot_id": chatbot_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Chatbot not found")
    return {"detail": "Chatbot deleted successfully"}


# Predict response based on chatbot data
@app.post("/predict/{chatbot_id}")
async def predict(chatbot_id: str, request: Request):
    body = await request.json()
    user_question = body.get('message', '')
    user_datetime = body.get('datetime', '')

    chatbot = chatbots_collection.find_one({"chatbot_id": chatbot_id})
    if not chatbot:
        raise HTTPException(status_code=404, detail="Chatbot not found")

    data_file = chatbot["scraped_data_file"]

    response_message = openai_answer(
        client, data_file, user_question, user_datetime
    )

    if response_message:
        return {"response": response_message}
    else:
        raise HTTPException(
            status_code=500, detail="Something went wrong. Please write another question.")

# @app.post("/predict/{assistant_id}")
# async def predict(assistant_id: str, request: Request):
#     """
#     Handle user prediction requests.
#     """
#     try:
#         body = await request.json()
#         user_question = body.get('message', '')
#         if not user_question:
#             raise HTTPException(status_code=400, detail="No question provided")

#         # Create a new thread for each request
#         vector_store_id = "vs_L0FIlhJEp1KCBVFHPcMyycPd"
#         thread = create_thread(client, vector_store_id, user_question)

#         response_message = None  # To store the assistant's final response

#         # Send the user's question to the assistant
#         with client.beta.threads.runs.stream(
#             thread_id=thread.id,
#             assistant_id=assistant_id,
#         ) as stream:
#             for event in stream:
#                 if event.event == "thread.message.completed":
#                     # Extract the content from the completed message
#                     response_message = event.data.content[0].text.value

#         # Check if a response was generated
#         if response_message:
#             return {"response": response_message}
#         else:
#             raise HTTPException(
#                 status_code=500, detail="Something went wrong. Please write another question.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.post("/predict")
# async def predict(request: Request):
#     """
#     Handle user prediction requests.
#     """
#     try:
#         body = await request.json()
#         user_question = body.get('message', '')
#         user_datetime = body.get('datetime', '')
#         if not user_question:
#             raise HTTPException(status_code=400, detail="No question provided")

#         response_message = openai_answer(
#             client,
#             'static/data_new_domain.txt',
#             user_question,
#             user_datetime
#         )

#         # Check if a response was generated
#         if response_message:
#             return {"response": response_message}
#         else:
#             raise HTTPException(
#                 status_code=500, detail="Something went wrong. Please write another question.")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@app.get("/chats/{session_id}/{chatbot_id}")
async def read_user_chats(session_id: str, chatbot_id: str):
    """
    Fetch the list of chats for a given user session and chatbot.
    """
    chats = get_chats(session_id, chatbot_id)
    return {"chats": chats}


@app.post("/chats/{session_id}/{chatbot_id}")
async def write_user_message(session_id: str, chatbot_id: str, message: Message):
    """
    Add a new message to the user's current chat for a specific chatbot.
    """
    add_message(session_id, chatbot_id, message)
    return {"detail": "Message added successfully."}


@app.delete("/chats/{session_id}/{chatbot_id}")
async def delete_user_all_chats(session_id: str, chatbot_id: str):
    """
    Delete all chats from the user's session for a specific chatbot.
    """
    user_data = delete_all_chats(session_id, chatbot_id)
    if user_data:
        return {"detail": "All chats deleted successfully.", "ok": True}
    else:
        raise HTTPException(status_code=404, detail="Session not found.")


@app.delete("/chats/{session_id}/{chatbot_id}/{chat_title}")
async def delete_user_chat(session_id: str, chatbot_id: str, chat_title: str):
    """
    Delete a chat from the user's session for a specific chatbot.
    """
    chat_deleted = delete_chat(session_id, chatbot_id, chat_title)
    if chat_deleted:
        return {"detail": "Chat deleted successfully.", "ok": True}
    else:
        raise HTTPException(status_code=404, detail="Chat not found.")
