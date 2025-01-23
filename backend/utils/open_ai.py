def split_file_content(file_content, max_length):
    tokens = file_content.split()
    for i in range(0, len(tokens), max_length):
        yield " ".join(tokens[i:i + max_length])


def openai_answer(client, file_name, question, datetime=""):
    # Read the text file
    with open(file_name, 'r') as file:
        file_content = file.read()

    max_length = 7000  # Approximate token limit for each chunk
    chunks = list(split_file_content(file_content, max_length))

    answer = "I don\'t have information on that. Please ask another question."

    for chunk in chunks:
        prompt = f"{chunk}\n\nDatetime: {datetime}\n\nQuestion: {question}"
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system",
                 "content": (
                     "You are a helpful assistant with name Daniil. Answer questions based on data from https://kaiduweb.ctwiii.com/. "
                     "Be concise (under 100 symbols per response), friendly, and clear. "
                     "Avoid unnecessary details. Important don't use lists! "
                     "If user ask about products in store please list 3 item with description, price and web link for each product. "
                     "Example of showing item: - **MA-3770S**: Full motion wall mount for TVs 32\"-70\". $39.00. [View product](https://kaiduweb.com/product/ma-3770s/). "
                     "Always give links in format [Link name](url link). "
                     "If user ask about how many hours will the store still work? The answer would be closing time minus time now. "
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
