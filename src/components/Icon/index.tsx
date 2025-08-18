'use client';

import React from 'react';

// icons
import IconGrid from './Grid';
import IconSearch from './Search';
// types
export type IconType = 'grid' | 'search';

export interface IconProps {
  type: IconType;
  active?: boolean;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ type, active = false, className = '', size = 24 }) => {
  // Use a switch statement to return the appropriate icon
  switch (type) {
    case 'grid':
      return <IconGrid active={active} className={className} size={size} />;
    case 'search':
      return <IconSearch active={active} className={className} size={size} />;
    default:
      return <></>;
  }
};

export default Icon;
