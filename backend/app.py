from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from openai import OpenAI

import os
from dotenv import load_dotenv

from utils.open_ai_assistant import create_thread
from utils.deepseek import deepseek_answer
from utils.open_ai import openai_answer
from config import get_chats, add_message
from schemas import Message

load_dotenv()

deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')

client = OpenAI(api_key=deepseek_api_key, base_url="https://api.deepseek.com")
# client = OpenAI()  # For gpt-4o
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust origins as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict/{assistant_id}")
async def predict(assistant_id: str, request: Request):
    """
    Handle user prediction requests.
    """
    try:
        body = await request.json()
        user_question = body.get('message', '')
        if not user_question:
            raise HTTPException(status_code=400, detail="No question provided")

        # Create a new thread for each request
        vector_store_id = "vs_L0FIlhJEp1KCBVFHPcMyycPd"
        thread = create_thread(client, vector_store_id, user_question)

        response_message = None  # To store the assistant's final response

        # Send the user's question to the assistant
        with client.beta.threads.runs.stream(
            thread_id=thread.id,
            assistant_id=assistant_id,
        ) as stream:
            for event in stream:
                if event.event == "thread.message.completed":
                    # Extract the content from the completed message
                    response_message = event.data.content[0].text.value

        # Check if a response was generated
        if response_message:
            return {"response": response_message}
        else:
            raise HTTPException(
                status_code=500, detail="Something went wrong. Please write another question.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict")
async def predict(request: Request):
    """
    Handle user prediction requests.
    """
    try:
        body = await request.json()
        user_question = body.get('message', '')
        user_datetime = body.get('datetime', '')
        if not user_question:
            raise HTTPException(status_code=400, detail="No question provided")

        response_message = deepseek_answer(
            client,
            'static/data_new_domain.txt',
            user_question,
            user_datetime
        )

        # Check if a response was generated
        if response_message:
            return {"response": response_message}
        else:
            raise HTTPException(
                status_code=500, detail="Something went wrong. Please write another question.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/chats/{session_id}")
async def read_user_chats(session_id: str):
    """
    Fetch the list of chats for a given user.
    """
    chats = get_chats(session_id)
    return {"chats": chats}


@app.post("/chats/{session_id}")
async def write_user_message(session_id: str, message: Message):
    """
    Add a new message to the user's cyrrent chat.
    """
    add_message(session_id, message)
    return {"detail": "Message added successfully."}
