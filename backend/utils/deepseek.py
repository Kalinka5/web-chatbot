def split_file_content(file_content, max_length):
    tokens = file_content.split()
    for i in range(0, len(tokens), max_length):
        yield " ".join(tokens[i:i + max_length])


def deepseek_answer(client, file_name, question):
    # Read the text file
    with open(file_name, 'r') as file:
        file_content = file.read()

    max_length = 10000  # Approximate token limit for each chunk
    chunks = list(split_file_content(file_content, max_length))

    final_response = "I don\'t have information on that. Please ask another question."
    for chunk in chunks:
        prompt = f"{chunk}\n\nQuestion: {question}"
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a helpful assistant. If unsure about an answer, say: \"I don't have information on that. Please ask another question.\" "},
                {"role": "user", "content": prompt},
            ],
            stream=False
        )
        answer = response.choices[0].message.content
        if answer != "I don\'t have information on that. Please ask another question.":
            final_response = answer
            break

    return final_response
