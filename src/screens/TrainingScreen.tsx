import * as React from 'react';
import { View, StyleSheet, ScrollView, Modal, Platform, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { Card, Button, Text, Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setSchedule, toggleReminder, clearSchedule } from '../store/slices/trainingSlice';

export default function TrainingScreen() {
  const dispatch = useDispatch();
  const schedule = useSelector((state: RootState) => state.training.schedule);
  
  const [trainingContent, setTrainingContent] = React.useState('Current');
  const [duration, setDuration] = React.useState('10 minutes');
  
  // Modal state
  const [modalVisible, setModalVisible] = React.useState(false);
  const [scheduleTrainingContent, setScheduleTrainingContent] = React.useState(schedule?.trainingContent || 'Current');
  const [scheduleDuration, setScheduleDuration] = React.useState(schedule?.duration || '10 minutes');
  const [selectedDays, setSelectedDays] = React.useState<string[]>(schedule?.days || []);
  const [reminderEnabled, setReminderEnabled] = React.useState(schedule?.reminderEnabled || false);
  const [infoDialogVisible, setInfoDialogVisible] = React.useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const resetForm = () => {
    if (schedule) {
      setScheduleTrainingContent(schedule.trainingContent);
      setScheduleDuration(schedule.duration);
      setSelectedDays(schedule.days);
      setReminderEnabled(schedule.reminderEnabled);
    } else {
      setScheduleTrainingContent('Current');
      setScheduleDuration('10 minutes');
      setSelectedDays([]);
      setReminderEnabled(false);
    }
  };

  const handleOpenModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleCreateSchedule = async () => {
    if (reminderEnabled) {
      // TODO: Implement notifications later
      console.log('Reminder enabled - notifications to be implemented');
    }
    
    dispatch(setSchedule({
      trainingContent: scheduleTrainingContent,
      duration: scheduleDuration,
      days: selectedDays,
      reminderEnabled: reminderEnabled,
    }));
    
    handleCloseModal();
  };

  const handleDeleteSchedule = () => {
    dispatch(clearSchedule());
    // TODO: Cancel notifications later
    console.log('Schedule deleted - notifications to be cancelled');
    handleCloseModal();
  };

  const getNextTrainingDate = () => {
    if (!schedule || schedule.days.length === 0) return null;
    
    const dayMap: Record<string, number> = {
      'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
    };
    
    const today = new Date();
    const currentDay = today.getDay();
    
    // Convert schedule days to numbers
    const scheduleDays = schedule.days.map(day => dayMap[day]).sort((a, b) => a - b);
    
    // Find next training day
    let nextDay = scheduleDays.find(day => day > currentDay);
    if (nextDay === undefined) {
      nextDay = scheduleDays[0]; // Next week's first training day
    }
    
    const daysUntil = nextDay >= currentDay ? nextDay - currentDay : 7 - currentDay + nextDay;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (daysUntil === 0) {
      return 'Today';
    } else if (daysUntil === 1) {
      return 'Tomorrow';
    } else {
      return `${dayNames[nextDate.getDay()]}, ${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  };

  const handleToggleReminder = async () => {
    dispatch(toggleReminder());
    // TODO: Toggle notifications later
    console.log('Reminder toggled - notifications to be updated');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Training Schedule Card */}
        <Card style={styles.card}>
          <Card.Cover 
            source={{ uri: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=200&fit=crop' }} 
            style={styles.cardImage}
          />
          <Card.Title 
            title="Training schedule" 
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            {schedule ? (
              <View>
                <View style={styles.scheduleInfo}>
                  <Text variant="labelLarge" style={styles.scheduleLabel}>Next training:</Text>
                  <Text variant="bodyLarge" style={styles.scheduleValue}>{getNextTrainingDate()}</Text>
                </View>
                
                <View style={styles.scheduleInfo}>
                  <Text variant="labelLarge" style={styles.scheduleLabel}>Training content:</Text>
                  <Text variant="bodyMedium" style={styles.scheduleValue}>{schedule.trainingContent}</Text>
                </View>
                
                <View style={styles.scheduleInfo}>
                  <Text variant="labelLarge" style={styles.scheduleLabel}>Duration:</Text>
                  <Text variant="bodyMedium" style={styles.scheduleValue}>{schedule.duration}</Text>
                </View>
                
                <View style={styles.scheduleInfo}>
                  <Text variant="labelLarge" style={styles.scheduleLabel}>Days:</Text>
                  <Text variant="bodyMedium" style={styles.scheduleValue}>{schedule.days.join(', ')}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.reminderToggle}
                  onPress={handleToggleReminder}
                >
                  <Text style={styles.reminderIcon}>{schedule.reminderEnabled ? '🔔' : '🔕'}</Text>
                  <Text variant="bodyMedium" style={styles.reminderText}>
                    Reminders {schedule.reminderEnabled ? 'on' : 'off'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text variant="bodyMedium">No schedule set.</Text>
            )}
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" onPress={handleOpenModal}>
              {schedule ? 'Edit schedule' : 'Create schedule'}
            </Button>
          </Card.Actions>
        </Card>

        {/* Train Now Card */}
        <Card style={styles.card}>
          <Card.Cover 
            source={{ uri: 'https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=800&h=200&fit=crop' }} 
            style={styles.cardImage}
          />
          <Card.Title 
            title="Train now" 
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Start a custom training session
            </Text>

            {/* Training Content Dropdown */}
            <View style={styles.pickerContainer}>
              <Text variant="labelLarge" style={styles.label}>
                Training content
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={trainingContent}
                  onValueChange={(itemValue) => setTrainingContent(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Current" value="Current" />
                  <Picker.Item label="Recent" value="Recent" />
                  <Picker.Item label="All" value="All" />
                </Picker>
              </View>
            </View>

            {/* Duration Dropdown */}
            <View style={styles.pickerContainer}>
              <Text variant="labelLarge" style={styles.label}>
                Duration
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={duration}
                  onValueChange={(itemValue) => setDuration(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="10 minutes" value="10 minutes" />
                  <Picker.Item label="15 minutes" value="15 minutes" />
                  <Picker.Item label="20 minutes" value="20 minutes" />
                  <Picker.Item label="30 minutes" value="30 minutes" />
                </Picker>
              </View>
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" onPress={() => {}}>
              Start
            </Button>
          </Card.Actions>
        </Card>
      </View>

      {/* Create Schedule Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Create training schedule
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text variant="bodyMedium" style={styles.modalSubtitle}>
              Practice key skills ready for your next grading
            </Text>

            {/* Training Content */}
            <View style={styles.formSection}>
              <View style={styles.labelWithInfo}>
                <Text variant="labelLarge" style={styles.label}>
                  Training content
                </Text>
                <TouchableOpacity
                  onPress={() => setInfoDialogVisible(true)}
                  style={styles.infoButton}
                >
                  <Text style={styles.infoIcon}>ⓘ</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={scheduleTrainingContent}
                  onValueChange={(itemValue) => setScheduleTrainingContent(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Current" value="Current" />
                  <Picker.Item label="Recent" value="Recent" />
                  <Picker.Item label="All" value="All" />
                </Picker>
              </View>
            </View>

            {/* Schedule - Days of Week */}
            <View style={styles.formSection}>
              <Text variant="labelLarge" style={styles.label}>
                Schedule
              </Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && styles.dayButtonSelected
                    ]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        selectedDays.includes(day) && styles.dayButtonTextSelected
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration */}
            <View style={styles.formSection}>
              <Text variant="labelLarge" style={styles.label}>
                Duration
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={scheduleDuration}
                  onValueChange={(itemValue) => setScheduleDuration(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="10 minutes" value="10 minutes" />
                  <Picker.Item label="15 minutes" value="15 minutes" />
                  <Picker.Item label="20 minutes" value="20 minutes" />
                  <Picker.Item label="30 minutes" value="30 minutes" />
                </Picker>
              </View>
            </View>

            {/* Set a Reminder */}
            <View style={styles.formSection}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setReminderEnabled(!reminderEnabled)}
                activeOpacity={0.7}
              >
                <Checkbox.Android
                  status={reminderEnabled ? 'checked' : 'unchecked'}
                />
                <Text variant="bodyLarge" style={styles.checkboxLabel}>
                  Set a reminder
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={handleCreateSchedule}
                style={styles.createButton}
              >
                {schedule ? 'Save changes' : 'Create schedule'}
              </Button>
              
              {schedule && (
                <Button 
                  mode="outlined" 
                  onPress={handleDeleteSchedule}
                  style={styles.deleteButton}
                  textColor="#d32f2f"
                >
                  Delete schedule
                </Button>
              )}
            </View>
          </ScrollView>

          {/* Info Dialog - Inside Modal */}
          {infoDialogVisible && (
            <View style={styles.dialogOverlay}>
              <View style={styles.dialogContainer}>
                <Text variant="titleLarge" style={styles.dialogTitle}>
                  Training Content
                </Text>
                <View style={styles.dialogContent}>
                  <Text variant="bodyMedium" style={styles.infoText}>
                    <Text style={styles.infoBold}>Current:</Text> Training content for your current belt level.
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoText}>
                    <Text style={styles.infoBold}>Recent:</Text> Training content for your current and previous belt levels.
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoText}>
                    <Text style={styles.infoBold}>All:</Text> All training content across all your previous belts and current belt.
                  </Text>
                </View>
                <View style={styles.dialogActions}>
                  <Button mode="contained" onPress={() => setInfoDialogVisible(false)}>
                    Got it
                  </Button>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  subtitle: {
    marginBottom: 16,
    color: '#666',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  cardImage: {
    height: 200,
    borderRadius: 0,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardActions: {
    justifyContent: 'center',
    paddingVertical: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSubtitle: {
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  labelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#333',
  },
  infoButton: {
    marginLeft: 4,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    color: '#666',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  dayButtonSelected: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dayButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  createButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#d32f2f',
  },
  scheduleInfo: {
    marginBottom: 12,
  },
  scheduleLabel: {
    fontWeight: '600',
    marginBottom: 2,
  },
  scheduleValue: {
    color: '#666',
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  reminderIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  reminderText: {
    color: '#666',
  },
  infoText: {
    marginBottom: 12,
  },
  infoBold: {
    fontWeight: 'bold',
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  dialogTitle: {
    padding: 24,
    paddingBottom: 16,
    fontWeight: 'bold',
  },
  dialogContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  dialogActions: {
    padding: 16,
    alignItems: 'flex-end',
  },
});
