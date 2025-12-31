import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TrainingRecord = {
  id: string;
  timestamp: string;
  data?: any; // store heavy payloads elsewhere (DB/Realm) and keep references here
};

interface TrainingRecordState {
  records: TrainingRecord[];
  lastSyncedAt?: string | null;
}

const initialState: TrainingRecordState = {
  records: [],
  lastSyncedAt: null,
};

const trainingRecordSlice = createSlice({
  name: 'trainingRecord',
  initialState,
  reducers: {
    addRecord(state, action: PayloadAction<TrainingRecord>) {
      state.records.unshift(action.payload);
    },
    setRecords(state, action: PayloadAction<TrainingRecord[]>) {
      state.records = action.payload;
    },
    clearRecords(state) {
      state.records = [];
    },
    setLastSyncedAt(state, action: PayloadAction<string | null>) {
      state.lastSyncedAt = action.payload;
    },
  },
});

export const { addRecord, setRecords, clearRecords, setLastSyncedAt } = trainingRecordSlice.actions;
export default trainingRecordSlice.reducer;
