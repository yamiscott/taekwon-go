import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, useTheme, Avatar } from 'react-native-paper';
import BeltBar from '../components/BeltBar';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setName,
  setSchool,
  setBelt,
  setDan,
  setMaster,
  setGrandmaster,
  clearAccount,
} from '../store/slices/accountSlice';
import { login, fetchCurrentUser, downloadSchoolLogo } from '../store/slices/accountSlice';
import { BELTS } from '../constants/belts';

export default function AccountScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const account = useAppSelector((s) => s.account);

  // Use server data as source of truth, fallback to local data
  const displayName = account.fullName || account.localName || '';
  const displaySchool = account.school || account.localSchool || '';
  const displayBelt = account.belt || account.localBelt || '';
  const displayDan = account.dan || account.localDan || null;
  const displayIsMaster = account.belt ? account.isMaster : account.localIsMaster;
  const displayIsGrandmaster = account.belt ? account.isGrandmaster : account.localIsGrandmaster;

  const [edit, setEdit] = useState(false);
  const [editName, setEditName] = useState(account.localName || '');
  const [editSchool, setEditSchool] = useState(account.localSchool || '');
  const [editBelt, setEditBelt] = useState(account.localBelt || '');
  const [editIsMaster, setEditIsMaster] = useState(account.localIsMaster ?? false);
  const [editIsGrandmaster, setEditIsGrandmaster] = useState(account.localIsGrandmaster ?? false);

  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const isLoggedIn = !!account.token;
  const hasServerData = !!account.belt; // If server has belt data, use it

  const handleLogin = async () => {
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password');
      return;
    }

    try {
      const result = await dispatch(login({ email: loginEmail, password: loginPassword })).unwrap();
      // Login successful, fetch user data
      console.log('Login successful, fetching user data...222');
      if (result.token) {
        const userData = await dispatch(fetchCurrentUser(result.token)).unwrap();
        // Download school logo if available
        const user = userData.user;
        if (user?.school && typeof user.school === 'object' && 'logoUrl' in user.school && user.school.logoUrl) {
          console.log('Downloading school logo for URL:', user.school.logoUrl);
          dispatch(downloadSchoolLogo(user.school.logoUrl));
        }
      }
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      console.log('Login failed with error:', error);
      setLoginError(typeof error === 'string' ? error : 'Login failed');
    }
  };

  const handleLogout = () => {
    dispatch(clearAccount());
  };

  const save = () => {
    dispatch(setName(editName || null));
    dispatch(setSchool(editSchool || null));
    dispatch(setBelt(editBelt || null));
    if (editBelt && editBelt.startsWith('black_')) {
      const num = parseInt(editBelt.split('_')[1], 10);
      if (!Number.isNaN(num)) dispatch(setDan(num));
    } else dispatch(setDan(null));

    // set master/grandmaster from separate toggles
    dispatch(setMaster(editIsMaster));
    dispatch(setGrandmaster(editIsGrandmaster));

    setEdit(false);
  };

  const cancel = () => {
    setEditName(account.localName || '');
    setEditSchool(account.localSchool || '');
    setEditBelt(account.localBelt || '');
    setEditIsMaster(account.localIsMaster ?? false);
    setEditIsGrandmaster(account.localIsGrandmaster ?? false);
    setEdit(false);
  };

  const theme = useTheme();

  const ordinal = (n: number | null | undefined) => {
    if (!n) return '';
    const num = Number(n);
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return `${num}st`;
    if (j === 2 && k !== 12) return `${num}nd`;
    if (j === 3 && k !== 13) return `${num}rd`;
    return `${num}th`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Account</Text>
      </View>

      {/* Login/Logout Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, isLoggedIn ? styles.statusDotGreen : styles.statusDotRed]} />
          <Text style={styles.statusText}>
            {isLoggedIn ? 'Logged In' : 'Logged Out'}
          </Text>
        </View>
        {isLoggedIn ? (
          <View style={styles.statusInfo}>
            <Text style={styles.statusEmail}>{typeof account.email === 'string' ? account.email : ''}</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Button 
            mode="contained" 
            onPress={() => setShowLoginModal(true)}
            style={styles.loginButton}
          >
            Log In
          </Button>
        )}
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log In</Text>
            
            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              value={loginEmail}
              onChangeText={setLoginEmail}
              style={styles.modalInput}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.modalLabel}>Password</Text>
            <TextInput
              value={loginPassword}
              onChangeText={setLoginPassword}
              style={styles.modalInput}
              placeholder="Your password"
              secureTextEntry
            />

            {loginError ? (
              <Text style={styles.errorText}>{loginError}</Text>
            ) : null}

            {account.loading ? (
              <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
            ) : (
              <>
                <Button 
                  mode="contained" 
                  onPress={handleLogin}
                  style={styles.modalButton}
                >
                  Log In
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => {
                    setShowLoginModal(false);
                    setLoginEmail('');
                    setLoginPassword('');
                    setLoginError('');
                  }}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.cardWrapper}>
        <Avatar.Icon size={200} icon="account" style={styles.avatar} />
        {!edit ? (
          <View style={styles.card}>
            {!hasServerData && (
              <Button mode="contained" onPress={() => setEdit(true)} style={styles.buttonRight}>
                Edit
              </Button>
            )}
            <Text style={styles.cardHeader}>{
              displayName ? `${displayName}'s details` : "Student's details"
            }</Text>

            {hasServerData && account.address ? (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.smallLabel}>Address</Text>
                <Text style={[styles.fieldValue, { fontSize: 16, color: theme.colors.primary }]}>
                  {account.address}
                </Text>
              </View>
            ) : null}

            <View style={styles.colBetween}>
              <View style={{ flexGrow: 1, width: '100%' }}>
                <Text style={styles.smallLabel}>School</Text>
                <Text style={[styles.fieldValue, { color: theme.colors.primary }]}>
                  {displaySchool || 'N/A'}
                </Text>
              </View>
              <View style={{ flexGrow: 1, width: '100%' }}>
                <Text style={styles.smallLabel}>Belt</Text>

                { (displayIsGrandmaster || displayIsMaster) ? (
                  <Text style={[styles.masterText, { color: theme.colors.primary }]}>
                    {displayIsGrandmaster ? 'Grand Master' : displayIsMaster ? 'Master' : ''}
                  </Text>
                ) : null }

                <Text style={[styles.fieldValue, { color: theme.colors.primary }]}>
                  {BELTS.find((b) => b.value === displayBelt)?.label ?? 'N/A'}
                </Text>

                {displayBelt ? (
                  <View style={styles.beltBarWrapper}>
                    <BeltBar belt={displayBelt} />
                  </View>
                ) : null}

                {displayDan ? (
                  <View style={styles.danContainer}>
                    <Text style={[styles.danText, { color: theme.colors.primary }]}>{ordinal(displayDan)} Degree</Text>
                  </View>
                ) : null} 
              </View>
            </View>

            {hasServerData && (
              <Text style={styles.serverDataNote}>
                ℹ️ This data is managed by your school admin
              </Text>
            )}

            <View style={{ height: 12 }} />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput value={editName} onChangeText={setEditName} style={styles.input} />

            <Text style={styles.fieldLabel}>School</Text>
            <TextInput value={editSchool} onChangeText={setEditSchool} style={styles.input} />

            <Text style={styles.fieldLabel}>Belt</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editBelt}
                onValueChange={(value) => setEditBelt(value as string)}
              >
                <Picker.Item label="Select belt..." value="" />
                {BELTS.map((b) => (
                  <Picker.Item key={b.value} label={b.label} value={b.value} />
                ))}
              </Picker>
            </View> 

            <View style={{ height: 12 }} />

            <Text style={styles.fieldLabel}>Master</Text>
            <View style={styles.switchRow}>
              <Switch value={editIsMaster} onValueChange={(v) => setEditIsMaster(v)} />
              <Text style={{ marginLeft: 8 }}>{editIsMaster ? 'Yes' : 'No'}</Text>
            </View>

            <Text style={styles.fieldLabel}>Grandmaster</Text>
            <View style={styles.switchRow}>
              <Switch value={editIsGrandmaster} onValueChange={(v) => setEditIsGrandmaster(v)} />
              <Text style={{ marginLeft: 8 }}>{editIsGrandmaster ? 'Yes' : 'No'}</Text>
            </View>

            <View style={{ height: 12 }} />
            <Button mode="contained" onPress={save} style={{ marginBottom: 8 }}>
              Save
            </Button>
            <Button mode="outlined" onPress={cancel} textColor={theme.colors.primary} style={{ borderColor: theme.colors.primary }}>
              Cancel
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    flexGrow: 1,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusDotGreen: {
    backgroundColor: '#4CAF50',
  },
  statusDotRed: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusInfo: {
    alignItems: 'center',
  },
  statusEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  logoutText: {
    color: '#0066cc',
    fontSize: 14,
  },
  loginButton: {
    minWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  modalButton: {
    marginTop: 12,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#ddd',
    marginTop: 8,
    marginBottom: -10,
    elevation: 2,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    width: '100%',
  },
  cardHeader: {
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 8,
    flexGrow: 1,
    marginRight: 80,
  },
  smallLabel: {
    fontSize: 12,
    color: '#000',
    marginTop: 8,
  },
  masterText: {
    marginTop: 6,
    fontWeight: '700',
  },
  danContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  danText: {
    fontWeight: '600',
    flexGrow: 1,
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  colBetween: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexGrow: 1,
  },
  fieldLabel: {
    fontWeight: '700',
    marginTop: 8,
  },
  fieldValue: {
    marginTop: 4,
    fontSize: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  beltsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  beltItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  beltSelected: {
    backgroundColor: '#0066cc',
  },
  beltLabel: {
    color: '#222',
  },
  beltLabelSelected: {
    color: '#fff',
  },
  beltBarWrapper: {
    marginTop: 8,
  },
  serverDataNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  buttonRight: {
    position: 'absolute',
    right: 12,
    marginTop: 8,
  }
});