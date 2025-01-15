from pydantic import BaseModel
from typing import List


class Message(BaseModel):
    title: str
    content: dict


class UserMessages(BaseModel):
    user_id: str
    messages: List[Message]
