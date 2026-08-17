"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppNotification } from "../types";
import { DataStore } from "../data/dataStore";
import { initialNotifications } from "../data/seedData";

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: initialNotifications,
  unreadCount: 2,
  markAsRead: () => {},
  markAllAsRead: () => {},
  addNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = () => {
    setNotifications(DataStore.getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener("xmore_data_updated", handleUpdate);
    return () => window.removeEventListener("xmore_data_updated", handleUpdate);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    DataStore.markNotificationAsRead(id);
    loadNotifications();
  };

  const markAllAsRead = () => {
    DataStore.markAllNotificationsAsRead();
    loadNotifications();
  };

  const addNotification = (notif: Omit<AppNotification, "id" | "read" | "createdAt">) => {
    DataStore.addNotification(notif);
    loadNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
