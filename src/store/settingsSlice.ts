import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SettingsState = {
  apiKey: string | null;
  githubToken: string | null;
};

const initialState: SettingsState = {
  apiKey: null,
  githubToken: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      localStorage.setItem("apiKey", action.payload);
    },
    setGithubToken: (state, action: PayloadAction<string>) => {
      state.githubToken = action.payload;
      localStorage.setItem("githubToken", action.payload);
    },
    clearSettings: (state) => {
      state.apiKey = null;
      state.githubToken = null;
      localStorage.removeItem("apiKey");
      localStorage.removeItem("githubToken");
    },
  },
});

export const { setApiKey, setGithubToken, clearSettings } =
  settingsSlice.actions;
export default settingsSlice.reducer;
