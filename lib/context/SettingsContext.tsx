"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CompanySettings, WebsiteContent } from "../types";
import { DataStore } from "../data/dataStore";
import { initialCompanySettings, initialWebsiteContent } from "../data/seedData";

interface SettingsContextType {
  settings: CompanySettings;
  websiteContent: WebsiteContent;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  updateWebsiteContent: (newContent: Partial<WebsiteContent>) => void;
  resetAllData: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: initialCompanySettings,
  websiteContent: initialWebsiteContent,
  updateSettings: () => {},
  updateWebsiteContent: () => {},
  resetAllData: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(initialCompanySettings);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(initialWebsiteContent);

  const loadData = () => {
    setSettings(DataStore.getSettings());
    setWebsiteContent(DataStore.getWebsiteContent());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("xmore_data_updated", handleUpdate);
    return () => window.removeEventListener("xmore_data_updated", handleUpdate);
  }, []);

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    const updated = DataStore.updateSettings(newSettings);
    setSettings(updated);
  };

  const updateWebsiteContent = (newContent: Partial<WebsiteContent>) => {
    const updated = DataStore.updateWebsiteContent(newContent);
    setWebsiteContent(updated);
  };

  const resetAllData = () => {
    DataStore.resetToInitialSeedData();
    loadData();
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        websiteContent,
        updateSettings,
        updateWebsiteContent,
        resetAllData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
