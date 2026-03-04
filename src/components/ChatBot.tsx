import { useAppDispatch } from "../hooks/useAppDispatch";
import { sendMessage, addUserMessage } from "../features/chat/chatSlice";
import ChatBot from "react-chatbotify";
import { useAppSelector } from "../hooks/useAppSelector";

const Chatbot = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.chat.loading);

  const settings = {
    general: { embedded: false },
    chatHistory: { storageKey: "nextgen-ai-chat" },
    botBubble: { simulateStream: true },
    tooltip: { mode: "NEVER" },
    header: { title: "NextGen AI" },
  };

  const flow = {
    start: {
      message: "Hi 👋 I'm NextGen AI Assistant! What can I help you with?",
      options: ["🔍 Find a Product", "↩️ Return Policy", "💡 Recommendations"],
      path: (params: any) => {
        const map: Record<string, string> = {
          "🔍 Find a Product": "process_input",
          "↩️ Return Policy": "process_input",
          "💡 Recommendations": "process_input",
        };
        return map[params.userInput] || "process_input";
      },
    },

    process_input: {
      message: async (params: any) => {
        const userMessage = params.userInput;

        dispatch(addUserMessage(userMessage));
        try {
          const result = await dispatch(sendMessage(userMessage)).unwrap();
          return result;
        } catch {
          return "Sorry, something went wrong. Please try again! 🙏";
        }
      },
      transitions: { duration : 300},
      chatDisabled: isLoading,
      path: () => "process_input",
    },
  };

  return <ChatBot settings={settings} flow={flow} />;
};

export default Chatbot;

