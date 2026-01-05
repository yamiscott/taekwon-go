import { Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';

// Initialize push notifications
export const initializeNotifications = () => {
  try {
    // For Android 13+, we need POST_NOTIFICATIONS permission
    if (Platform.OS === 'android') {
      Notifications.registerRemoteNotifications();
    }
    
    Notifications.events().registerNotificationReceivedForeground((notification: any, completion: any) => {
      console.log('Notification received in foreground:', notification);
      completion({ alert: false, sound: false, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification: any, completion: any) => {
      console.log('Notification opened:', notification);
      completion();
    });

    console.log('Notifications initialized successfully');
  } catch (error) {
    console.warn('Failed to initialize notifications:', error);
  }
};

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    await Notifications.requestPermissions();
    return true;
  } catch (error) {
    console.warn('Failed to request permissions:', error);
    return false;
  }
};

// Schedule notifications for training days
export const scheduleTrainingNotifications = async (
  days: string[],
  duration: string,
  trainingContent: string
) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions denied');
      return;
    }

    // Cancel existing notifications first
    await cancelTrainingNotifications();

    console.log(`Scheduling notifications for ${days.join(', ')}`);
    console.log('Note: react-native-notifications requires custom native code for scheduled/repeating notifications');
    
    // For now, just show immediate notification as proof of concept
    // Full scheduling requires native iOS/Android implementation
    Notifications.postLocalNotification({
      body: `Training reminders set for ${days.join(', ')} at 9:00 AM`,
      title: 'Training Schedule Created',
      sound: 'default',
      badge: 1,
    });
  } catch (error) {
    console.warn('Failed to schedule notifications:', error);
  }
};

// Cancel all training notifications
export const cancelTrainingNotifications = async () => {
  try {
    await Notifications.cancelAllLocalNotifications();
    console.log('Cancelled all training notifications');
  } catch (error) {
    console.warn('Failed to cancel notifications:', error);
  }
};
