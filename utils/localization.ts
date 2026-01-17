
/**
 * Safely gets a localized string from either a localized object or a legacy string.
 * This prevents crashes when rendering data that might not be fully migrated.
 */
export const getLocalized = (data: any, language: 'id' | 'en'): string => {
  if (!data) return '';
  
  // If it's already a string, return it (Legacy data support)
  if (typeof data === 'string') return data;
  
  // If it's the new localized object format
  if (typeof data === 'object' && data !== null) {
    return data[language] || data['id'] || data['en'] || '';
  }
  
  return '';
};
