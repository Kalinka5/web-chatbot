def create_assistant(client, vectore_name):
    """
    Create OpenAI assistant with file knowledge base.
    """
    assistant = client.beta.assistants.create(
        name="Chatbot Kaidu Web V2",
        instructions="I attached file where full information about website. Be friendly, concise, and engaging. Write short answers with clear paragraphs. Avoid unnecessary explanations. For lists, format as dot points, not in sentence form. Do not mention file sources in responses. If unsure about an answer, say: \"I don't have information on that. Please ask another question.\" Important don't use * symbol. Keep the tone fun and approachable.",
        tools=[{"type": "file_search"}],
        model="gpt-4o-mini",
    )

    # Create a vector store
    vector_store = client.beta.vector_stores.create(name=vectore_name)

    # Ready the files for upload to OpenAI
    file_paths = ["static/data.txt"]
    file_streams = [open(path, "rb") for path in file_paths]

    # Use the upload and poll SDK helper to upload the files, add them to the vector store,
    # and poll the status of the file batch for completion.
    file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
        vector_store_id=vector_store.id, files=file_streams
    )

    if file_batch.status != "completed":
        raise RuntimeError(
            "File upload failed. Status: " + file_batch.status)

    print("Files uploaded successfully:", file_batch.file_counts)

    assistant = client.beta.assistants.update(
        assistant_id=assistant.id,
        tool_resources={"file_search": {
            "vector_store_ids": [vector_store.id]}},
    )

    return assistant, vector_store.id


def create_thread(client, vector_store_id, message):
    """
    Create a thread with an assistant.
    """

    # Create a thread
    thread = client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": message,
            }
        ]
    )

    # Now associate the file search tool to the thread
    thread = client.beta.threads.update(
        thread_id=thread.id,
        tool_resources={"file_search": {
            "vector_store_ids": [vector_store_id]}}
    )

    # The thread now has a vector store with that file in its tool resources.
    print(thread.tool_resources)

    return thread
