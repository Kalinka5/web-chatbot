from openai import OpenAI

from utils.open_ai import openai_answer

client = OpenAI()  # For gpt-4o


answer = openai_answer(
    client,
    'static/data_new_domain.txt',
    "When do you open?"
)
print(answer)
