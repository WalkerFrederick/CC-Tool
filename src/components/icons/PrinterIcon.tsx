import React from 'react';
import Svg, { Rect, Circle } from 'react-native-svg';

export type PrinterIconProps = {
  variant?: 'filled' | 'outline';
  size?: number;
  color?: string;
};

const PrinterIcon: React.FC<PrinterIconProps> = ({
  variant = 'outline',
  size = 24,
  color = 'black',
}) => {
  if (variant === 'filled') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x={3}
          y={5}
          width={18}
          height={14}
          rx={2}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
        <Rect
          x={6}
          y={8}
          width={12}
          height={6}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
        <Circle cx={18} cy={10} r={1} fill={color} />
        <Circle cx={18} cy={14} r={1} fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={5}
        width={18}
        height={14}
        rx={2}
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
      <Rect
        x={6}
        y={8}
        width={12}
        height={6}
        stroke={color}
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
};

export default PrinterIcon;
