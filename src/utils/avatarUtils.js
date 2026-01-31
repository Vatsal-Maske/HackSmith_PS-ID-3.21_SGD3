/**
 * Avatar Utility Functions
 * Generates initials and colors for profile avatars
 */

/**
 * Generate initials from a full name
 * @param {string} name - Full name (e.g., "Vatsal Maske")
 * @returns {string} Initials (e.g., "VM")
 */
export const generateInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return 'U'; // Default to 'U' for User
  }

  // Remove extra spaces and split by space
  const nameParts = name.trim().split(/\s+/);
  
  if (nameParts.length === 0) {
    return 'U';
  }

  if (nameParts.length === 1) {
    // For single name, return first 2 characters (or 1 if name is short)
    const singleName = nameParts[0];
    return singleName.length >= 2 
      ? singleName.substring(0, 2).toUpperCase()
      : singleName.substring(0, 1).toUpperCase();
  }

  // For multiple names, take first letter of each word (max 2)
  const initials = nameParts
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');

  return initials || 'U';
};

/**
 * Generate a consistent background color based on the name
 * @param {string} name - Full name to generate color from
 * @returns {string} CSS color value
 */
export const generateAvatarColor = (name) => {
  if (!name || typeof name !== 'string') {
    return '#6B7280'; // Default gray color
  }

  // Create a hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Define a palette of professional colors
  const colorPalette = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#8B5CF6', // Violet
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#A855F7', // Purple
  ];

  // Use the hash to select a color from the palette
  const colorIndex = Math.abs(hash) % colorPalette.length;
  return colorPalette[colorIndex];
};

/**
 * Generate a gradient background based on the name
 * @param {string} name - Full name to generate gradient from
 * @returns {string} CSS gradient value
 */
export const generateAvatarGradient = (name) => {
  const baseColor = generateAvatarColor(name);
  
  // Create a gradient using the base color
  const gradients = {
    '#3B82F6': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', // Blue
    '#10B981': 'linear-gradient(135deg, #10B981 0%, #059669 100%)', // Emerald
    '#8B5CF6': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', // Violet
    '#F59E0B': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', // Amber
    '#EF4444': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', // Red
    '#06B6D4': 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', // Cyan
    '#84CC16': 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)', // Lime
    '#F97316': 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', // Orange
    '#EC4899': 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)', // Pink
    '#14B8A6': 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', // Teal
    '#6366F1': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', // Indigo
    '#A855F7': 'linear-gradient(135deg, #A855F7 0%, #9333EA 100%)', // Purple
  };

  return gradients[baseColor] || gradients['#3B82F6'];
};

/**
 * Get text color that contrasts well with the avatar background
 * @param {string} name - Full name to determine text color for
 * @returns {string} Text color (white or dark gray)
 */
export const getAvatarTextColor = (name) => {
  // For all our chosen colors, white text provides good contrast
  return '#FFFFFF';
};
