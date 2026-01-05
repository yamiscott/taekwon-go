import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrainingSchedule {
  trainingContent: string;
  duration: string;
  days: string[];
  reminderEnabled: boolean;
}

interface TrainingState {
  readState: Record<string, boolean>; // keyed by content id
  progress: Record<string, number>; // percent complete per module
  schedule: TrainingSchedule | null;
}

const initialState: TrainingState = {
  readState: {},
  progress: {},
  schedule: null,
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
    setSchedule(state, action: PayloadAction<TrainingSchedule>) {
      state.schedule = action.payload;
    },
    clearSchedule(state) {
      state.schedule = null;
    },
    toggleReminder(state) {
      if (state.schedule) {
        state.schedule.reminderEnabled = !state.schedule.reminderEnabled;
      }
    },
  },
});

export const { markRead, setProgress, resetTraining, setSchedule, clearSchedule, toggleReminder } = trainingSlice.actions;
export default trainingSlice.reducer;
