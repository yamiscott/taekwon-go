import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import RNFS from 'react-native-fs';
import SHA256 from 'crypto-js/sha256';

// API URL Configuration:
// - Android Emulator: 'http://10.0.2.2:3000'
// - iOS Simulator: 'http://localhost:3000'
// - Physical Device: 'http://YOUR_IP:3000' or use ngrok
// - ngrok: 'https://YOUR_SUBDOMAIN.ngrok.io'
const API_URL = 'http://10.0.2.2:3000';

type User = { id: string; name?: string; email?: string };

interface AccountState {
  user: User | null;
  // Server-provided data (source of truth)
  fullName: string | null;
  address: string | null;
  email: string | null;
  school: string | null;
  schoolLogoUrl: string | null; // Temporary store for logo URL to download
  schoolLogoPath: string | null; // Local cached path to school logo
  belt: string | null; // e.g. 'white', 'orange_stripe', 'black_1', etc.
  dan: number | null; // 1..9 if black belt
  isMaster: boolean;
  isGrandmaster: boolean;
  // Local-only data (fallback if server doesn't have it)
  localName: string | null;
  localSchool: string | null;
  localBelt: string | null;
  localDan: number | null;
  localIsMaster: boolean;
  localIsGrandmaster: boolean;
  // Auth
  token: string | null;
  loading: boolean;
  error?: string | null;
}

const initialState: AccountState = {
  user: null,
  fullName: null,
  address: null,
  email: null,
  school: null,
  schoolLogoUrl: null,
  schoolLogoPath: null,
  belt: null,
  dan: null,
  isMaster: false,
  isGrandmaster: false,
  localName: null,
  localSchool: null,
  localBelt: null,
  localDan: null,
  localIsMaster: false,
  localIsGrandmaster: false,
  token: null,
  loading: false,
  error: null,
};

// Helper function to download and cache school logo
const downloadAndCacheSchoolLogo = async (logoUrl: string) => {
  try {
    if (!logoUrl || typeof logoUrl !== 'string') {
      return null;
    }

    const hash = SHA256(logoUrl).toString().substring(0, 16);
    const filename = `school-logo-${hash}.png`;
    const cacheDir = `${RNFS.DocumentDirectoryPath}/schoolLogos`;
    const filePath = `${cacheDir}/${filename}`;

    const fileExists = await RNFS.exists(filePath);
    if (fileExists) {
      return filePath;
    }

    try {
      await RNFS.mkdir(cacheDir, { NSURLIsExcludedFromBackupKey: true });
    } catch (err) {
      // Directory might already exist, continue
    }

    const downloadUrl = logoUrl.replace('localhost:3000', '10.0.2.2:3000');
    
    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        return filePath;
      }
    } catch (downloadErr) {
      console.log('Download error:', downloadErr);
      return null;
    }
  } catch (error) {
    console.log('Failed to download school logo:', error);
  }
  return null;
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

// Download and cache school logo thunk
export const downloadSchoolLogo = createAsyncThunk(
  'account/downloadSchoolLogo',
  async (logoUrl: string, { rejectWithValue }) => {
    try {
      if (!logoUrl || typeof logoUrl !== 'string') {
        return rejectWithValue('Invalid logo URL');
      }

      const hash = SHA256(logoUrl).toString().substring(0, 16);
      const filename = `school-logo-${hash}.png`;
      const cacheDir = `${RNFS.DocumentDirectoryPath}/schoolLogos`;
      const filePath = `${cacheDir}/${filename}`;

      // Check if already cached
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        return filePath;
      }

      // Create cache directory
      try {
        await RNFS.mkdir(cacheDir, { NSURLIsExcludedFromBackupKey: true });
      } catch (err) {
        // Directory might already exist, continue
      }

      // Download the file
      const downloadUrl = logoUrl.replace('localhost:3000', '10.0.2.2:3000');
      const downloadResult = await RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        return filePath;
      } else {
        return rejectWithValue(`Download failed with status ${downloadResult.statusCode}`);
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Download failed');
    }
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      if (action.payload?.name) state.localName = action.payload.name;
    },
    setName(state, action: PayloadAction<string | null>) {
      state.localName = action.payload;
    },
    setSchool(state, action: PayloadAction<string | null>) {
      state.localSchool = action.payload;
    },
    setBelt(state, action: PayloadAction<string | null>) {
      state.localBelt = action.payload;
    },
    setDan(state, action: PayloadAction<number | null>) {
      state.localDan = action.payload;
    },
    setMaster(state, action: PayloadAction<boolean>) {
      state.localIsMaster = action.payload;
    },
    setGrandmaster(state, action: PayloadAction<boolean>) {
      state.localIsGrandmaster = action.payload;
    },
    setSchoolLogoPath(state, action: PayloadAction<string | null>) {
      state.schoolLogoPath = action.payload;
    },
    setSchoolLogoUrl(state, action: PayloadAction<string | null>) {
      state.schoolLogoUrl = action.payload;
    },
    setAccount(state, action: PayloadAction<Partial<AccountState>>) {
      const payload = action.payload;
      if (payload.user !== undefined) state.user = payload.user ?? null;
      if (payload.localName !== undefined) state.localName = payload.localName ?? null;
      if (payload.localSchool !== undefined) state.localSchool = payload.localSchool ?? null;
      if (payload.localBelt !== undefined) state.localBelt = payload.localBelt ?? null;
      if (payload.localDan !== undefined) state.localDan = payload.localDan ?? null;
      if (payload.localIsMaster !== undefined) state.localIsMaster = !!payload.localIsMaster;
      if (payload.localIsGrandmaster !== undefined) state.localIsGrandmaster = !!payload.localIsGrandmaster;
    },
    clearAccount(state) {
      state.user = null;
      state.fullName = null;
      state.address = null;
      state.email = null;
      state.school = null;
      state.schoolLogoUrl = null;
      state.schoolLogoPath = null;
      state.belt = null;
      state.dan = null;
      state.isMaster = false;
      state.isGrandmaster = false;
      state.localName = null;
      state.localSchool = null;
      state.localBelt = null;
      state.localDan = null;
      state.localIsMaster = false;
      state.localIsGrandmaster = false;
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

    // Download school logo thunk handlers
    builder.addCase(downloadSchoolLogo.pending, (state) => {
      // Optional: add loading state for logo if needed
    });
    builder.addCase(downloadSchoolLogo.fulfilled, (state, action) => {
      state.schoolLogoPath = action.payload;
    });
    builder.addCase(downloadSchoolLogo.rejected, (state, action) => {
      console.log('Logo download failed:', action.payload);
      state.schoolLogoPath = null;
    });
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      const userData = action.payload.user;
      state.user = userData;
      
      // Server-provided data (source of truth)
      state.email = typeof userData.email === 'string' ? userData.email : null;
      state.fullName = typeof userData.fullName === 'string' ? userData.fullName : null;
      state.address = typeof userData.address === 'string' ? userData.address : null;
      
      // Handle school - can be a string or an object with { _id, name, logoUrl }
      let logoUrl: string | null = null;
      if (typeof userData.school === 'string') {
        state.school = userData.school;
      } else if (userData.school && typeof userData.school === 'object' && 'name' in userData.school) {
        state.school = userData.school.name;
        logoUrl = userData.school.logoUrl || null;
      } else {
        state.school = null;
      }
      
      // Store the logo URL (download will be handled by App.tsx watcher)
      if (logoUrl) {
        state.schoolLogoUrl = logoUrl;
      }
      
      // Belt and rank data from server
      state.belt = typeof userData.belt === 'string' ? userData.belt : null;
      state.isMaster = !!userData.isMaster;
      state.isGrandmaster = !!userData.isGrandmaster;
      
      // Calculate dan from belt if it's a black belt
      if (state.belt && state.belt.startsWith('black_')) {
        const num = parseInt(state.belt.split('_')[1], 10);
        state.dan = !Number.isNaN(num) ? num : null;
      } state.dan = null;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch user';
    });
  },
});

export const { setUser, setName, setSchool, setBelt, setDan, setMaster, setGrandmaster, setSchoolLogoPath, setSchoolLogoUrl, setAccount, clearAccount } = accountSlice.actions;
export { downloadAndCacheSchoolLogo };
export default accountSlice.reducer;
