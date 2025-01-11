def openai_answer(client, question):
    prompt = f"Question: {question}"

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system",
             "content": (
                 "You are a helpful assistant. Answer questions based on data from https://kaiduweb.com/. "
                 "Be concise (under 100 symbols per response), friendly, and clear. "
                 "Avoid unnecessary details. Use bullet points for lists. "
                 "Do not use * symbols or explanations. "
             )},
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    answer = completion.choices[0].message.content

    return answer
