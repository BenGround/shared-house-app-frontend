import i18n from '../../i18n'; // Path to your i18n configuration
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from 'src/locales/en.json';
import jp from 'src/locales/jp.json';

// Mock i18next methods
jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn(),
  t: jest.fn(),
}));

describe('i18n configuration', () => {
  beforeEach(() => {
    // Reset mock calls before each test
    jest.clearAllMocks(); // This will reset all mocks
  });

  it('should initialize i18n with the correct configuration', () => {
    // Call i18n.init() (which will invoke the mocked version)
    i18n.init();

    // Check if i18n.init() was called with the correct configuration
    expect(i18n.init).toHaveBeenCalledWith({
      resources: {
        en: { translation: en },
        jp: { translation: jp },
      },
      fallbackLng: 'en',
      supportedLngs: ['en', 'jp'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
  });

  it('should call i18n.use() with LanguageDetector and initReactI18next', () => {
    // Call i18n.init() (which will invoke the mocked version)
    i18n.init();

    // Check that i18n.use() was called twice with the correct arguments
    expect(i18n.use).toHaveBeenCalledWith(LanguageDetector);
    expect(i18n.use).toHaveBeenCalledWith(initReactI18next);
  });

  it('should set the fallback language to English', () => {
    i18n.init();

    // Check if the fallback language is set to 'en'
    expect(i18n.options.fallbackLng).toBe('en');
  });

  it('should support English and Japanese languages', () => {
    i18n.init();

    // Check that supported languages include 'en' and 'jp'
    expect(i18n.options.supportedLngs).toEqual(['en', 'jp']);
  });
});
