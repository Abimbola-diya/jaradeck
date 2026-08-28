import React from 'react';
import EyeOffIcon from './EyeOffIcon';
import HugeAnimatedEye from '../HugeAnimatedEye';

export default function EyeIcon({ visible = true, stroke = "#64748B", size = 20, className = "" }) {
  if (!visible) {
    return <EyeOffIcon size={size} stroke={stroke} className={className} />;
  }
  return <HugeAnimatedEye size={size} color={stroke} className={className} />;
}
