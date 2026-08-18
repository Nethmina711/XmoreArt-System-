"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, StaffRole, Employee } from "../types";
import { DataStore } from "../data/dataStore";
import { initialEmployees } from "../data/seedData";

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  role: StaffRole;
  isAuthenticated: boolean;
  isLoaded: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResult>;
  logout: () => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const defaultMasterAdmin: UserProfile = {
  id: "emp-1",
  email: "miyuru@xmoreart.lk",
  name: "Miyuru Senarathne",
  role: "SUPER_ADMIN",
  phone: "+94 71 666 6643",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  active: true,
  createdAt: "2026-01-01",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "STAFF",
  isAuthenticated: false,
  isLoaded: false,
  login: async () => ({ success: false }),
  logout: () => {},
  updateUserPassword: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize and check persistent session
  useEffect(() => {
    try {
      const stored = localStorage.getItem("xmore_auth_user") || sessionStorage.getItem("xmore_auth_user");
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed && parsed.email) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Auth hydration error:", e);
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const syncProfile = () => {
      if (user?.email) {
        const emp = DataStore.getEmployees().find(e => e.email.toLowerCase() === user.email.toLowerCase() || e.id === user.id);
        if (emp) {
          const updatedUser: UserProfile = {
            ...user,
            name: emp.name,
            role: emp.role,
            phone: emp.phone,
            photoUrl: emp.photo || user.photoUrl,
            active: emp.active,
          };
          setUser(updatedUser);
          try {
            localStorage.setItem("xmore_auth_user", JSON.stringify(updatedUser));
          } catch (e) {}
        }
      }
    };

    window.addEventListener("xmore_data_updated", syncProfile);
    return () => window.removeEventListener("xmore_data_updated", syncProfile);
  }, [user]);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<LoginResult> => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    if (!cleanEmail) {
      return { success: false, error: "Please enter your email or username." };
    }

    if (!cleanPass) {
      return { success: false, error: "Please enter your password." };
    }

    // Retrieve staff database
    let employees: Employee[] = [];
    try {
      employees = DataStore.getEmployees();
    } catch {
      employees = initialEmployees;
    }

    // Master shortcut check definitions
    const isMasterShortcut = 
      cleanEmail === "miyuru" || 
      cleanEmail === "admin" || 
      cleanEmail === "miyuru@xmoreart.lk" || 
      cleanEmail === "admin@xmoreart.lk" || 
      cleanEmail.includes("miyuru");

    // Check staff accounts
    let matchedEmployee = employees.find(
      e => e.email.trim().toLowerCase() === cleanEmail
    );

    // If not matched by full email, try username prefix (e.g. "dinuka" matching "dinuka@xmoreart.lk")
    if (!matchedEmployee) {
      matchedEmployee = employees.find(
        e => e.email.trim().toLowerCase().split("@")[0] === cleanEmail
      );
    }

    // Try name match
    if (!matchedEmployee) {
      matchedEmployee = employees.find(
        e => e.name.trim().toLowerCase() === cleanEmail
      );
    }

    // Master shortcut check
    if (!matchedEmployee && isMasterShortcut) {
      matchedEmployee = employees.find(e => e.role === "SUPER_ADMIN") || initialEmployees[0];
    }

    if (!matchedEmployee) {
      const existingEmails = employees.map(e => e.email).join(", ");
      return {
        success: false,
        error: `No staff account found for "${email}". Registered accounts: ${existingEmails}`
      };
    }

    if (matchedEmployee.active === false) {
      return {
        success: false,
        error: "This staff account has been deactivated. Please contact your administrator."
      };
    }

    // Password verification
    const expectedPassword = (matchedEmployee.password || "admin1234").trim();

    if (cleanPass !== expectedPassword) {
      return {
        success: false,
        error: `Incorrect password for ${matchedEmployee.name}. Please enter the password assigned in Staff Directory.`
      };
    }

    // Build authenticated profile
    const authenticatedUser: UserProfile = {
      id: matchedEmployee.id || "emp-1",
      email: matchedEmployee.email || "miyuru@xmoreart.lk",
      name: matchedEmployee.name || "Miyuru Senarathne",
      role: matchedEmployee.role || "SUPER_ADMIN",
      phone: matchedEmployee.phone || "+94 71 666 6643",
      photoUrl: matchedEmployee.photo || defaultMasterAdmin.photoUrl,
      active: true,
      createdAt: matchedEmployee.createdAt || new Date().toISOString(),
    };

    // Save session synchronously
    setUser(authenticatedUser);

    try {
      localStorage.setItem("xmore_auth_user", JSON.stringify(authenticatedUser));
      if (!rememberMe) {
        sessionStorage.setItem("xmore_auth_user", JSON.stringify(authenticatedUser));
      }
    } catch (e) {
      console.error("Session storage error:", e);
    }

    return { success: true, user: authenticatedUser };
  };

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem("xmore_auth_user");
      sessionStorage.removeItem("xmore_auth_user");
    } catch (e) {
      console.error("Logout error:", e);
    }
  }, []);

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "You must be signed in to change password." };
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: "New password must be at least 4 characters long." };
    }

    const employees = DataStore.getEmployees();
    const index = employees.findIndex(e => e.id === user.id || e.email.toLowerCase() === user.email.toLowerCase());

    if (index === -1) {
      return { success: false, error: "Employee record not found." };
    }

    const currentExpected = employees[index].password || "admin1234";
    if (currentPassword !== currentExpected) {
      return { success: false, error: "Current password does not match." };
    }

    employees[index].password = newPassword;
    DataStore.saveEmployee(employees[index]);

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "STAFF",
        isAuthenticated: !!user,
        isLoaded,
        login,
        logout,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
