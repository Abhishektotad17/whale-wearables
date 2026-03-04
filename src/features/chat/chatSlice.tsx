import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { askChatbot } from "../../services/ChatService";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message: string, { getState, rejectWithValue }) => {
    const state = getState() as { chat: ChatState };
    const recentHistory = state.chat.messages.slice(-10); 
    try {
      const data = await askChatbot(message, recentHistory);
      return data.reply;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: "user", text: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push({ role: "bot", text: action.payload });
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state , action) => {
        state.loading = false;
        state.error = "Something went wrong";
        state.messages.push({
          role: "bot",
          text: (action.payload as string) ?? "Sorry, I'm having trouble connecting. Please try again. 🙏",
        });
      });
  },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
