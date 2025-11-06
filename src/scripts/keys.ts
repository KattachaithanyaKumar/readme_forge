// src/lib/keys.ts
import { store } from "../store/store";

export function getKeysFromStore() {
  const state = store.getState();
  const { apiKey, githubToken } = state.settings;

  // Fallback to .env for API key only if Redux doesn't have one
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  return {
    apiKey: apiKey ?? envApiKey ?? "",
    githubToken: githubToken ?? "",
  };
}
