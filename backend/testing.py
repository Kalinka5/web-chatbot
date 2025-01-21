from utils.open_ai import openai_answer

from openai import OpenAI


client = OpenAI()

answer = openai_answer(
    client=client,
    file_name='static/not_repeated_data.txt',
    question='Do you have brackets?'
)

print(answer)
