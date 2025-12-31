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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setName,
  setSchool,
  setBelt,
  setDan,
  setMaster,
  setGrandmaster,
} from '../store/slices/accountSlice';
import { BELTS } from '../constants/belts';

export default function AccountScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const account = useAppSelector((s) => s.account);

  const [edit, setEdit] = useState(false);
  const [localName, setLocalName] = useState(account.name ?? '');
  const [localSchool, setLocalSchool] = useState(account.school ?? '');
  const [localBelt, setLocalBelt] = useState(account.belt ?? '');
  const [localIsMaster, setLocalIsMaster] = useState(account.isMaster ?? false);
  const [localIsGrandmaster, setLocalIsGrandmaster] = useState(account.isGrandmaster ?? false);

  const save = () => {
    dispatch(setName(localName || null));
    dispatch(setSchool(localSchool || null));
    dispatch(setBelt(localBelt || null));
    if (localBelt && localBelt.startsWith('black_')) {
      const num = parseInt(localBelt.split('_')[1], 10);
      if (!Number.isNaN(num)) dispatch(setDan(num));
    } else dispatch(setDan(null));

    // set master/grandmaster from separate toggles
    dispatch(setMaster(localIsMaster));
    dispatch(setGrandmaster(localIsGrandmaster));

    setEdit(false);
  };

  const cancel = () => {
    setLocalName(account.name ?? '');
    setLocalSchool(account.school ?? '');
    setLocalBelt(account.belt ?? '');
    setLocalIsMaster(account.isMaster ?? false);
    setLocalIsGrandmaster(account.isGrandmaster ?? false);
    setEdit(false);
  };

  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Account</Text>
        <Button mode="outlined" onPress={() => navigation.goBack()} textColor={theme.colors.primary} style={{ borderColor: theme.colors.primary }}>Close</Button>
      </View>

      {!edit ? (
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Name</Text>
          <Text style={styles.fieldValue}>{account.name ?? 'N/A'}</Text>

          <Text style={styles.fieldLabel}>School</Text>
          <Text style={styles.fieldValue}>{account.school ?? 'N/A'}</Text>

          <Text style={styles.fieldLabel}>Belt</Text>
          <Text style={styles.fieldValue}>
            {BELTS.find((b) => b.value === account.belt)?.label ?? 'N/A'}
          </Text>

          <Text style={styles.fieldLabel}>Dan</Text>
          <Text style={styles.fieldValue}>{account.dan ?? 'N/A'}</Text>

          <Text style={styles.fieldLabel}>Master</Text>
          <Text style={styles.fieldValue}>{account.isMaster ? 'Yes' : 'No'}</Text>

          <Text style={styles.fieldLabel}>Grandmaster</Text>
          <Text style={styles.fieldValue}>{account.isGrandmaster ? 'Yes' : 'No'}</Text>

          <View style={{ height: 12 }} />
          <Button mode="contained" onPress={() => setEdit(true)} style={styles.button}>
            Edit
          </Button>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput value={localName} onChangeText={setLocalName} style={styles.input} />

          <Text style={styles.fieldLabel}>School</Text>
          <TextInput value={localSchool} onChangeText={setLocalSchool} style={styles.input} />

          <Text style={styles.fieldLabel}>Belt</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={localBelt}
              onValueChange={(value) => setLocalBelt(value as string)}
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
            <Switch value={localIsMaster} onValueChange={(v) => setLocalIsMaster(v)} />
            <Text style={{ marginLeft: 8 }}>{localIsMaster ? 'Yes' : 'No'}</Text>
          </View>

          <Text style={styles.fieldLabel}>Grandmaster</Text>
          <View style={styles.switchRow}>
            <Switch value={localIsGrandmaster} onValueChange={(v) => setLocalIsGrandmaster(v)} />
            <Text style={{ marginLeft: 8 }}>{localIsGrandmaster ? 'Yes' : 'No'}</Text>
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
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  fieldLabel: {
    fontWeight: '700',
    marginTop: 8,
  },
  fieldValue: {
    marginTop: 4,
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
  button: {
    alignSelf: 'flex-start',
    marginTop: 8,
  }
});