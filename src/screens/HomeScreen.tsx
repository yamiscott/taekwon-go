import * as React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useAppSelector } from '../store/hooks';

// Static imports
import StudentBase from '../assets/home/StudentBase.png';
import StudentBlackNoBelt from '../assets/home/StudentBlack-noBelt.png';
import WhiteBelt from '../assets/home/White-Belt.png';
import OrangeStripe from '../assets/home/Orange-Stripe.png';
import PurpleStripe from '../assets/home/Purple-Stripe.png';
import YellowStripe from '../assets/home/Yellow-Stripe.png';
import YellowBelt from '../assets/home/Yellow-Belt.png';
import GreenStripe from '../assets/home/Green-Stripe.png';
import GreenBelt from '../assets/home/Green-Belt.png';
import BlueStripe from '../assets/home/Blue-Stripe.png';
import BlueBelt from '../assets/home/Blue-Belt.png';
import RedStripe from '../assets/home/Red-Stripe.png';
import RedBelt from '../assets/home/Red-Belt.png';
import BlackStripe from '../assets/home/Black-Stripe.png';
import BlackBelt from '../assets/home/Black-Belt.png';

const BELT_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  white: WhiteBelt,
  orange_stripe: OrangeStripe,
  purple_stripe: PurpleStripe,
  yellow_stripe: YellowStripe,
  yellow: YellowBelt,
  green_stripe: GreenStripe,
  green: GreenBelt,
  blue_stripe: BlueStripe,
  blue: BlueBelt,
  red_stripe: RedStripe,
  red: RedBelt,
  black_stripe: BlackStripe,
};

export default function HomeScreen() {
  const account = useAppSelector((s) => s.account);

  // Use server data as source of truth, fallback to local data
  const displayName = account.fullName || account.localName || '';
  const displayBelt = account.belt || account.localBelt || '';

  const welcomeText = displayName ? `Welcome, ${displayName}!` : 'Welcome!';

  const getBeltImages = (belt?: string | null): ImageSourcePropType[] => {
    const images: ImageSourcePropType[] = [StudentBase];

    if (!belt) {
      // No belt selected: show white belt
      images.push(WhiteBelt);
    } else if (belt.startsWith('black_') && belt !== 'black_stripe') {
      // Black belt: add StudentBlack-noBelt then Black-Belt
      images.push(StudentBlackNoBelt);
      images.push(BlackBelt);
    } else {
      // Any other belt: add the corresponding belt image
      const beltImage = BELT_IMAGE_MAP[belt];
      if (beltImage) {
        images.push(beltImage);
      }
    }

    return images;
  };

  const beltImages = getBeltImages(displayBelt);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>{welcomeText}</Text>

      <View style={styles.studentContainer}>
        {beltImages.map((imageSource, idx) => (
          <Image
            key={idx}
            source={imageSource}
            style={styles.studentImage}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  studentContainer: {
    flexGrow: 1,
    width: '100%',
  },
  studentImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  schoolLogo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 10,
  },
  noLogoText: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 10,
    color: '#999',
  },
});