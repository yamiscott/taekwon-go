import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// API URL Configuration:
// - Android Emulator: 'http://10.0.2.2:3000'
// - iOS Simulator: 'http://localhost:3000'
// - Physical Device: 'http://YOUR_IP:3000' or use ngrok
// - ngrok: 'https://YOUR_SUBDOMAIN.ngrok.io'
const API_URL = 'http://10.0.2.2:3000';

type User = { id: string; name?: string; email?: string };

interface AccountState {
  user: User | null;
  name: string | null;
  email: string | null;
  school: string | null;
  belt: string | null; // e.g. 'white', 'orange_stripe', 'black_1', etc.
  dan: number | null; // 1..9 if black belt
  isMaster: boolean;
  isGrandmaster: boolean;
  token: string | null;
  loading: boolean;
  error?: string | null;
}

const initialState: AccountState = {
  user: null,
  name: null,
  email: null,
  school: null,
  belt: null,
  dan: null,
  isMaster: false,
  isGrandmaster: false,
  token: null,
  loading: false,
  error: null,
};

// Login thunk - calls POST /auth/login with email and password
export const login = createAsyncThunk(
  'account/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Login failed');
      }

      const data = await response.json();
      return data; // { token: string }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Network error');
    }
  }
);

// Fetch current user thunk - calls GET /auth/me with JWT token
export const fetchCurrentUser = createAsyncThunk(
  'account/fetchCurrentUser',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch user');
      }

      const data = await response.json();
      return data; // { user: User }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Network error');
    }
  }
);

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
      state.email = null;
      state.school = null;
      state.belt = null;
      state.dan = null;
      state.isMaster = false;
      state.isGrandmaster = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Login thunk handlers
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Login failed';
    });

    // Fetch current user thunk handlers
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      const userData = action.payload.user;
      state.user = userData;
      // Ensure email and name are strings, not objects
      state.email = typeof userData.email === 'string' ? userData.email : null;
      state.name = typeof userData.name === 'string' ? userData.name : null;
      
      // Handle school - can be a string or an object with { _id, name }
      if (typeof userData.school === 'string') {
        state.school = userData.school;
      } else if (userData.school && typeof userData.school === 'object' && 'name' in userData.school) {
        state.school = userData.school.name;
      } else {
        state.school = null;
      }
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch user';
    });
  },
});

export const { setUser, setName, setSchool, setBelt, setDan, setMaster, setGrandmaster, setAccount, clearAccount } = accountSlice.actions;
export default accountSlice.reducer;
