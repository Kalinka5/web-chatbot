from pydantic import BaseModel
from typing import List, Dict


class Message(BaseModel):
    name: str
    message: str


class UserMessages(BaseModel):
    user_id: str
    messages: List[Message]
