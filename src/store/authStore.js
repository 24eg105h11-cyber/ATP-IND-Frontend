import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";

const getApiErrorMessage = (err, fallbackMessage) =>
  err.response?.data?.error || err.response?.data?.message || err.message || fallbackMessage;

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  markProblemCompleted: (problemId) => {
    set((state) => {
      if (!state.currentUser) return state;

      const completedProblems = state.currentUser.completedProblems || [];
      const alreadyCompleted = completedProblems.some((problem) => {
        const solvedId = problem?._id?.toString?.() || problem?.toString?.();
        return solvedId === problemId;
      });

      if (alreadyCompleted) return state;

      return {
        currentUser: {
          ...state.currentUser,
          completedProblems: [...completedProblems, problemId],
        },
      };
    });
  },

  login: async (userCred) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_BASE_URL}/users/login`, userCred, { withCredentials: true });
      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
        });
      }
      return res.data;
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Login failed");
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  signup: async (userData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_BASE_URL}/users/signup`, userData, { withCredentials: true });
      set({ loading: false });
      return res.data;
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Signup failed");
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/logout`, {}, { withCredentials: true });
      set({
        currentUser: null,
        isAuthenticated: false,
        error: null,
        loading: false,
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true });
      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          isAuthenticated: !!res.data?.payload,
          loading: false,
        });
      }
    } catch (err) {
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API_BASE_URL}/users/profile`, userData, { withCredentials: true });
      if (res.status === 200) {
        set({ currentUser: res.data?.payload, loading: false });
      }
      return res.data;
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, "Update failed");
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchLeaderboard: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/leaderboard`, { withCredentials: true });
      return res.data?.payload || [];
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      return [];
    }
  },

  fetchProblems: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.difficulty) params.set("difficulty", filters.difficulty);
      if (filters.tag) params.set("tag", filters.tag);

      const queryString = params.toString();
      const res = await axios.get(
        `${API_BASE_URL}/problems${queryString ? `?${queryString}` : ""}`,
        { withCredentials: true }
      );
      return res.data?.payload || [];
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      return [];
    }
  },
}));



