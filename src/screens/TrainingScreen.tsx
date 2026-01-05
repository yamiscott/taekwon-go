import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

export default function TrainingScreen() {
  const [trainingContent, setTrainingContent] = React.useState('Current');
  const [duration, setDuration] = React.useState('10 minutes');

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
            <Text variant="bodyMedium">No schedule set.</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button mode="contained" onPress={() => {}}>
              Create schedule
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
  }
});
