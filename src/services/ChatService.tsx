interface ChatHistoryMessage {
  role: "user" | "bot";
  text: string;
}

export const askChatbot = async (message: string, history: ChatHistoryMessage[] = []) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/gemini/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message, history }),
    }
  );

    if (response.status === 429) {
      const data = await response.json();
      throw new Error(data.reply ?? "Too many requests. Please slow down. 🙏");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch chatbot response");
    }

    return response.json();

};
