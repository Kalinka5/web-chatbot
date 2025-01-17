from openai import OpenAI

from utils.open_ai import openai_answer


client = OpenAI()

answer = openai_answer(
    client, 'static/not_repeated_data.txt', 'write 3 brackets')
print(answer)
