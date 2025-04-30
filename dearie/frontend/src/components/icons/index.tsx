import React from 'react';
import Svg, { Path, Circle, Rect, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

export interface IconProps {
  color?: string;
  size?: number;
  fill?: string;
}

// Home Icon
export const Home: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

// Book Open Icon
export const BookOpen: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Svg>
);

// Sparkles Icon
export const Sparkles: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 3v3m0 12v3m-9-9h3m12 0h3m-2.5-6.5-2 2m-9 9-2 2m11-2 2 2m-9-11-2-2" />
    <Path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
  </Svg>
);

// User Icon
export const User: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);

// Plus Icon
export const Plus: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

// Heart Icon
export const Heart: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

// MessageCircle Icon
export const MessageCircle: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

// Bookmark Icon
export const Bookmark: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

// CheckCircle Icon
export const CheckCircle: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4 12 14.01l-3-3" />
  </Svg>
);

// ChevronRight Icon
export const ChevronRight: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="m9 18 6-6-6-6" />
  </Svg>
);

// ChevronDown Icon
export const ChevronDown: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="m6 9 6 6 6-6" />
  </Svg>
);

// Bell Icon
export const Bell: React.FC<IconProps> = ({ color = '#000', size = 24, fill = 'none' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);
