from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system",
         "content": (
                 "You are a helpful assistant. Scrap data from https://kaiduweb.com/ website and answer questions about wesbite. "
                 "Be concise (under 100 symbols per response), friendly, and clear. "
                 "Avoid unnecessary details. Use bullet points for lists. "
                 "Do not use * symbols or explanations. "
         )},
        {
            "role": "user",
            "content": "When do you open?"
        }
    ]
)

print(completion.choices[0].message.content)
