import React from 'react';
import ProfileAvatar from './ProfileAvatar.jsx';

/**
 * AvatarDemo Component
 * Shows different avatar sizes and configurations
 */
const AvatarDemo = () => {
  const sampleNames = [
    'Vatsal Maske',
    'John Doe',
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim'
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Avatar Demo</h3>
      
      {/* Size Variations */}
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Size Variations</h4>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <ProfileAvatar name="Vatsal Maske" size="xs" />
              <p className="text-xs text-gray-500 mt-1">xs</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Vatsal Maske" size="sm" />
              <p className="text-xs text-gray-500 mt-1">sm</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Vatsal Maske" size="md" />
              <p className="text-xs text-gray-500 mt-1">md</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Vatsal Maske" size="lg" />
              <p className="text-xs text-gray-500 mt-1">lg</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Vatsal Maske" size="xl" />
              <p className="text-xs text-gray-500 mt-1">xl</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Vatsal Maske" size="2xl" />
              <p className="text-xs text-gray-500 mt-1">2xl</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Vatsal Maske" size="3xl" />
              <p className="text-xs text-gray-500 mt-1">3xl</p>
            </div>
          </div>
        </div>

        {/* Different Names */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Different Names & Colors</h4>
          <div className="flex items-center space-x-4">
            {sampleNames.map((name, index) => (
              <div key={index} className="text-center">
                <ProfileAvatar name={name} size="lg" />
                <p className="text-xs text-gray-500 mt-1 truncate w-16">{name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Status Indicators</h4>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <ProfileAvatar name="Online User" size="lg" showStatus={true} statusColor="green" />
              <p className="text-xs text-gray-500 mt-1">Online</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Away User" size="lg" showStatus={true} statusColor="yellow" />
              <p className="text-xs text-gray-500 mt-1">Away</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Busy User" size="lg" showStatus={true} statusColor="red" />
              <p className="text-xs text-gray-500 mt-1">Busy</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Offline User" size="lg" showStatus={true} statusColor="gray" />
              <p className="text-xs text-gray-500 mt-1">Offline</p>
            </div>
          </div>
        </div>

        {/* Border Options */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Border Options</h4>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <ProfileAvatar name="With Border" size="lg" showBorder={true} />
              <p className="text-xs text-gray-500 mt-1">With Border</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="No Border" size="lg" showBorder={false} />
              <p className="text-xs text-gray-500 mt-1">No Border</p>
            </div>
          </div>
        </div>

        {/* Animation */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Animation</h4>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <ProfileAvatar name="Animated" size="lg" animate={true} />
              <p className="text-xs text-gray-500 mt-1">Animated</p>
            </div>
            <div className="text-center">
              <ProfileAvatar name="Static" size="lg" animate={false} />
              <p className="text-xs text-gray-500 mt-1">Static</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemo;
