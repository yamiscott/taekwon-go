import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrainingState {
  readState: Record<string, boolean>; // keyed by content id
  progress: Record<string, number>; // percent complete per module
}

const initialState: TrainingState = {
  readState: {},
  progress: {},
};

const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    markRead(state, action: PayloadAction<{ id: string; read: boolean }>) {
      state.readState[action.payload.id] = action.payload.read;
    },
    setProgress(state, action: PayloadAction<{ id: string; percent: number }>) {
      state.progress[action.payload.id] = action.payload.percent;
    },
    resetTraining(state) {
      state.readState = {};
      state.progress = {};
    },
  },
});

export const { markRead, setProgress, resetTraining } = trainingSlice.actions;
export default trainingSlice.reducer;
