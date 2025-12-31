import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

type User = { id: string; name?: string; email?: string };

interface AccountState {
  user: User | null;
  name: string | null;
  school: string | null;
  belt: string | null; // e.g. 'white', 'orange_stripe', 'black_1', etc.
  dan: number | null; // 1..9 if black belt
  isMaster: boolean;
  isGrandmaster: boolean;
  loading: boolean;
  error?: string | null;
}

const initialState: AccountState = {
  user: null,
  name: null,
  school: null,
  belt: null,
  dan: null,
  isMaster: false,
  isGrandmaster: false,
  loading: false,
  error: null,
};

// Example placeholder async thunk; replace with real API call later
export const fetchAccount = createAsyncThunk('account/fetchAccount', async () => {
  // placeholder: return null to indicate no logged-in user
  return null as AccountState | null;
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      if (action.payload?.name) state.name = action.payload.name;
    },
    setName(state, action: PayloadAction<string | null>) {
      state.name = action.payload;
    },
    setSchool(state, action: PayloadAction<string | null>) {
      state.school = action.payload;
    },
    setBelt(state, action: PayloadAction<string | null>) {
      state.belt = action.payload;
    },
    setDan(state, action: PayloadAction<number | null>) {
      state.dan = action.payload;
    },
    setMaster(state, action: PayloadAction<boolean>) {
      state.isMaster = action.payload;
    },
    setGrandmaster(state, action: PayloadAction<boolean>) {
      state.isGrandmaster = action.payload;
    },
    setAccount(state, action: PayloadAction<Partial<AccountState>>) {
      const payload = action.payload;
      if (payload.user !== undefined) state.user = payload.user ?? null;
      if (payload.name !== undefined) state.name = payload.name ?? null;
      if (payload.school !== undefined) state.school = payload.school ?? null;
      if (payload.belt !== undefined) state.belt = payload.belt ?? null;
      if (payload.dan !== undefined) state.dan = payload.dan ?? null;
      if (payload.isMaster !== undefined) state.isMaster = !!payload.isMaster;
      if (payload.isGrandmaster !== undefined) state.isGrandmaster = !!payload.isGrandmaster;
    },
    clearAccount(state) {
      state.user = null;
      state.name = null;
      state.school = null;
      state.belt = null;
      state.dan = null;
      state.isMaster = false;
      state.isGrandmaster = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccount.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      state.loading = false;
        if (action.payload) {
        // merge payload fields if any
        const payload = action.payload as AccountState;
        state.user = payload.user ?? state.user;
        state.name = payload.name ?? state.name;
        state.school = payload.school ?? state.school;
        state.belt = payload.belt ?? state.belt;
        state.dan = payload.dan ?? state.dan;
        state.isMaster = payload.isMaster ?? state.isMaster;
        state.isGrandmaster = payload.isGrandmaster ?? state.isGrandmaster;
      }
    });
    builder.addCase(fetchAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'failed';
    });
  },
});

export const { setUser, setName, setSchool, setBelt, setDan, setMaster, setGrandmaster, setAccount, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;
