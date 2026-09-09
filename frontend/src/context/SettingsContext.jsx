import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { api } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const unwrapSettingsResponse = (response) => {
  return (
    response?.data?.data ??
    response?.data ??
    response ??
    {}
  );
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hexToRgb = (hex) => {
    if (!hex) return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 10)}, ${parseInt(result[2], 10)}, ${parseInt(result[3], 10)}` : null;
  };

  const applyThemeVariables = useCallback((theme) => {
    if (!theme) return;

    const root = document.documentElement;

    const primaryRgb = hexToRgb(theme.primaryColor);
    const secondaryRgb = hexToRgb(theme.secondaryColor);
    const textRgb = hexToRgb(theme.textColor);

    const variables = {
      '--primary-color': theme.primaryColor,
      '--primary-color-rgb': primaryRgb,
      '--secondary-color': theme.secondaryColor,
      '--secondary-color-rgb': secondaryRgb,
      '--accent-color': theme.accentColor,
      '--success-color': theme.successColor,
      '--danger-color': theme.dangerColor,
      '--warning-color': theme.warningColor,
      '--info-color': theme.infoColor,
      '--bg-color': theme.backgroundColor,
      '--card-bg-color': theme.cardColor,
      '--text-color': theme.textColor,
      '--text-color-rgb': textRgb,
      '--border-radius': theme.borderRadius,
      '--box-shadow': theme.shadowStyle,
      '--font-family-base': theme.fontFamily,
      '--font-family-heading': theme.headingFont,
    };

    Object.entries(variables).forEach(([variable, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        root.style.setProperty(variable, value);
      }
    });
  }, []);

  const fetchSettings = useCallback(
    async (isAdmin = false) => {
      try {
        setLoading(true);

        const endpoint = isAdmin
          ? '/settings/admin'
          : '/settings/public';

        const response = await api.get(endpoint);

        console.log(
          `SETTINGS ${isAdmin ? 'ADMIN' : 'PUBLIC'} RESPONSE:`,
          response
        );

        // api.ts already parses JSON.
        // Support:
        // { success: true, data: {...} }
        // OR:
        // {...}
        const payload = unwrapSettingsResponse(response);

        setSettings(payload);

        if (payload?.theme) {
          applyThemeVariables(payload.theme);
        }

        setError(null);

        return payload;
      } catch (err) {
        console.error(
          `Failed to fetch ${isAdmin ? 'admin' : 'public'} settings:`,
          err
        );

        setError(
          err?.data?.message ||
          err?.message ||
          'Failed to load settings'
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [applyThemeVariables]
  );

  useEffect(() => {
    fetchSettings(false).catch(() => { });
  }, [fetchSettings]);

  const updateSettings = async (newData) => {
    try {
      const response = await api.put(
        '/settings/admin',
        newData
      );

      console.log('SETTINGS UPDATE RESPONSE:', response);

      // Refresh the actual persisted database state.
      const persistedSettings = await fetchSettings(true);

      // Apply the persisted theme, not merely the submitted theme.
      if (persistedSettings?.theme) {
        applyThemeVariables(persistedSettings.theme);
      }

      return persistedSettings;
    } catch (err) {
      console.error('Failed to update settings:', err);
      throw err;
    }
  };

  const invalidateCache = useCallback(() => {
    return fetchSettings(false);
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
        updateSettings,
        invalidateCache,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};