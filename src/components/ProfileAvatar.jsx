import React from 'react';
import { generateInitials, generateAvatarGradient, getAvatarTextColor } from '../utils/avatarUtils.js';

/**
 * ProfileAvatar Component
 * A reusable avatar component that displays initials with a name-based background color
 */
const ProfileAvatar = ({ 
  name, 
  size = 'md', 
  className = '', 
  showBorder = true,
  animate = true,
  showStatus = false,
  statusColor = 'green',
  onClick = null
}) => {
  // Generate avatar properties
  const initials = generateInitials(name);
  const backgroundGradient = generateAvatarGradient(name);
  const textColor = getAvatarTextColor(name);

  // Size configurations
  const sizeConfig = {
    xs: {
      container: 'w-6 h-6 text-xs',
      fontSize: 'text-xs',
      statusSize: 'w-1.5 h-1.5'
    },
    sm: {
      container: 'w-8 h-8 text-sm',
      fontSize: 'text-sm',
      statusSize: 'w-2 h-2'
    },
    md: {
      container: 'w-10 h-10 text-base',
      fontSize: 'text-base',
      statusSize: 'w-2.5 h-2.5'
    },
    lg: {
      container: 'w-12 h-12 text-lg',
      fontSize: 'text-lg',
      statusSize: 'w-3 h-3'
    },
    xl: {
      container: 'w-16 h-16 text-xl',
      fontSize: 'text-xl',
      statusSize: 'w-3.5 h-3.5'
    },
    '2xl': {
      container: 'w-20 h-20 text-2xl',
      fontSize: 'text-2xl',
      statusSize: 'w-4 h-4'
    },
    '3xl': {
      container: 'w-24 h-24 text-3xl',
      fontSize: 'text-3xl',
      statusSize: 'w-5 h-5'
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  // Animation classes
  const animationClasses = animate 
    ? 'transition-transform duration-200 hover:scale-105' 
    : '';

  // Border classes
  const borderClasses = showBorder 
    ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-100' 
    : '';

  // Click classes
  const clickClasses = onClick 
    ? 'cursor-pointer' 
    : '';

  // Status color configurations
  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
    blue: 'bg-blue-500'
  };

  const currentStatusColor = statusColors[statusColor] || statusColors.green;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        rounded-full overflow-hidden font-semibold
        ${currentSize.container} ${currentSize.fontSize}
        ${animationClasses} ${borderClasses} ${clickClasses} ${className}
      `}
      style={{
        background: backgroundGradient,
        color: textColor,
      }}
      title={name || 'User'}
      onClick={onClick}
    >
      {initials}
      
      {/* Status Indicator */}
      {showStatus && (
        <div 
          className={`
            absolute -bottom-0 -right-0 rounded-full border-2 border-white
            ${currentSize.statusSize} ${currentStatusColor}
          `}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
