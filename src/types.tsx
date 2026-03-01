// src/types.ts

// This interface will now live here and can be imported anywhere.
export interface Country {
  name: string;
  code: string;     // currency code, e.g. 'GBP', 'NGN'
  flag: string;     // emoji flag, e.g. '🇬🇧', '🇳🇬'
  flagCode: string; // ISO 3166-1 alpha-2 for CircleFlag, e.g. 'gb', 'ng'
}
