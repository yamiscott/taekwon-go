# Local Notification Setup

The training schedule now supports local push notifications. Follow these steps to complete the setup:

## Installation

1. Install the required dependencies:
```bash
npm install
```

2. For iOS, install pods:
```bash
cd ios
pod install
cd ..
```

## Android Configuration

The notifications should work out of the box on Android after installation.

## iOS Configuration

1. Open `ios/TaekwonGo/AppDelegate.mm` (or `AppDelegate.m`)

2. Add these imports at the top:
```objc
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
```

3. Add these methods to handle notifications:
```objc
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}
```

4. Add notification capabilities in Xcode:
   - Open `ios/TaekwonGo.xcworkspace` in Xcode
   - Select your project target
   - Go to "Signing & Capabilities"
   - Click "+ Capability" and add "Push Notifications"
   - Add "Background Modes" and enable "Remote notifications"

## Rebuild the App

After configuration, rebuild the app:

```bash
# For Android
npm run android

# For iOS
npm run ios
```

## How It Works

- When a training schedule is created with reminders enabled, local notifications are scheduled for 9:00 AM on each selected training day
- Notifications repeat weekly
- The notification message will be: "Time to train! Your [duration] [content] training session is ready."
- Notifications are automatically cancelled when:
  - The schedule is deleted
  - Reminders are toggled off
  - A new schedule is saved (old ones are replaced)

## Permissions

The app will automatically request notification permissions when:
- Creating a schedule with reminders enabled
- Toggling reminders on for an existing schedule

Users must grant notification permissions for reminders to work.
