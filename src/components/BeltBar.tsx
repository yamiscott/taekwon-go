import React from 'react';
import { View, StyleSheet } from 'react-native';

export const COLOR_MAP: Record<string, string> = {
  white: '#FFFFFF',
  orange: '#FFA500',
  purple: '#800080',
  yellow: '#FFD700',
  green: '#008000',
  blue: '#0000FF',
  red: '#FF0000',
  black: '#000000',
};

export const PREV_COLOR_MAP: Record<string, string> = {
  orange: 'white',
  purple: 'white',
  yellow: 'white',
  green: 'yellow',
  blue: 'green',
  red: 'blue',
  black: 'red',
};

export const getBeltColors = (beltVal?: string | null) => {
  if (!beltVal) return { outer: '#eee', inner: '#eee', isStripe: false };
  if (beltVal.endsWith('_stripe')) {
    const colorName = beltVal.split('_')[0];
    const inner = COLOR_MAP[colorName] ?? '#000';
    const prevName = PREV_COLOR_MAP[colorName] ?? 'white';
    const outer = COLOR_MAP[prevName] ?? '#ffffff';
    return { outer, inner, isStripe: true };
  }
  // handle black_x dan values
  const base = beltVal.startsWith('black_') ? 'black' : beltVal;
  const outer = COLOR_MAP[base] ?? '#000';
  return { outer, inner: outer, isStripe: false };
};

type Props = {
  belt?: string | null;
  style?: any;
  height?: number;
};

export default function BeltBar({ belt, style, height = 30 }: Props) {
  const { outer, inner, isStripe } = getBeltColors(belt);

  if (!belt) return null;

  return (
    <View style={[styles.wrapper, style]}>
      {isStripe ? (
        <View style={[styles.outer, { backgroundColor: outer, height: height }]}>
          <View style={[styles.inner, { backgroundColor: inner, height: Math.max(15, height - 15) }]} />
        </View>
      ) : (
        <View style={[styles.full, { backgroundColor: outer, height }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 8,
    outlineWidth: 1,
    outlineColor: '#ccc',
  },
  outer: {
    width: '100%',
    paddingTop: 6,
    paddingBottom: 6,
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
  },
  full: {
    width: '100%',
  },
});