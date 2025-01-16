def split_file_content(file_content, max_length):
    tokens = file_content.split()
    for i in range(0, len(tokens), max_length):
        yield " ".join(tokens[i:i + max_length])


def openai_answer(client, file_name, question, datetime=""):
    # Read the text file
    with open(file_name, 'r') as file:
        file_content = file.read()

    max_length = 10000  # Approximate token limit for each chunk
    chunks = list(split_file_content(file_content, max_length))

    answer = "I don\'t have information on that. Please ask another question."

    for chunk in chunks:
        prompt = f"{chunk}\n\nDatetime: {datetime}\n\nQuestion: {question}"
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system",
                 "content": (
                     "You are a helpful assistant with name Daniil. Answer questions based on data from https://kaiduweb.com/. "
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
        if answer != "I don\'t have information on that. Please ask another question.":
            break

    return answer
