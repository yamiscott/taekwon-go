import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TheoryScore = { id: string; score: number; date: string };

interface TheoryState {
  readState: Record<string, boolean>;
  scores: TheoryScore[]; // historical scores; consider storing in DB for large datasets
  currentTest?: { id: string; answers?: any } | null;
}

const initialState: TheoryState = {
  readState: {},
  scores: [],
  currentTest: null,
};

const theorySlice = createSlice({
  name: 'theory',
  initialState,
  reducers: {
    markTheoryRead(state, action: PayloadAction<{ id: string; read: boolean }>) {
      state.readState[action.payload.id] = action.payload.read;
    },
    addScore(state, action: PayloadAction<TheoryScore>) {
      state.scores.unshift(action.payload);
    },
    setCurrentTest(state, action: PayloadAction<{ id: string; answers?: any } | null>) {
      state.currentTest = action.payload;
    },
    clearScores(state) {
      state.scores = [];
    },
  },
});

export const { markTheoryRead, addScore, setCurrentTest, clearScores } = theorySlice.actions;
export default theorySlice.reducer;
