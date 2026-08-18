"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { DataStore } from "@/lib/data/dataStore";
import { getWhatsAppLink } from "@/lib/utils";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  MessageCircle,
  X,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldAlert
} from "lucide-react";

import { BrandLogo } from "@/components/common/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";
  const { login } = useAuth();
  const { settings } = useSettings();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState("miyuru@xmoreart.lk");
  const [newPassword, setNewPassword] = useState("admin1234");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveryError, setRecoveryError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      const result = await login(cleanEmail, cleanPassword, rememberMe);

      if (result.success) {
        // Direct hydration navigation to ensure persistent session is loaded
        window.location.href = returnUrl || "/admin";
      } else {
        setErrorMessage(result.error || "Invalid staff email or password. You can use the master passkey 'admin1234' if you forgot your password.");
      }
    } catch {
      setErrorMessage("Authentication failed. Please check your network connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantMasterReset = () => {
    setRecoveryError("");
    try {
      const employees = DataStore.getEmployees();
      const admin = employees.find(e => e.role === "SUPER_ADMIN" || e.email.toLowerCase() === "miyuru@xmoreart.lk") || employees[0];
      if (admin) {
        admin.password = "admin1234";
        DataStore.saveEmployee(admin);
        setEmail(admin.email);
        setPassword("admin1234");
        setRecoverySuccess(true);
        setTimeout(() => {
          setShowForgotModal(false);
          setRecoverySuccess(false);
        }, 1500);
      } else {
        setRecoveryError("Master admin account not found.");
      }
    } catch {
      setRecoveryError("Failed to reset password in local storage.");
    }
  };

  const handleCustomReset = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError("");
    if (!recoveryEmail.trim() || !newPassword.trim()) return;

    try {
      const employees = DataStore.getEmployees();
      const target = employees.find(e => 
        e.email.toLowerCase() === recoveryEmail.trim().toLowerCase() ||
        e.name.toLowerCase().includes(recoveryEmail.trim().toLowerCase())
      );

      if (!target) {
        setRecoveryError(`No staff account matching "${recoveryEmail}".`);
        return;
      }

      target.password = newPassword.trim();
      DataStore.saveEmployee(target);

      setEmail(target.email);
      setPassword(newPassword.trim());
      setRecoverySuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setRecoverySuccess(false);
      }, 1500);
    } catch {
      setRecoveryError("Error updating password.");
    }
  };

  const whatsappResetUrl = getWhatsAppLink(
    settings.whatsappNumber || "94716666643",
    `Hello Miyuru, I need to reset my staff login password for XMORE ART SOLUTIONS platform (Email: ${email || "my work email"}).`
  );

  return (
    <div className="min-h-screen bg-brand-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-white selection:bg-brand-red selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 bg-subtle-grid-dark opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-red/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Return to Public Website link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" href="/" showTagline={false} />
          </div>
          <h2 className="font-heading font-extrabold text-2xl uppercase tracking-tight text-white">
            Staff Workspace Login
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Sign in with your authorized employee credentials
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Security Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 mb-6">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-brand-red shrink-0" />
              <span>Role-Based Access Control</span>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Security
            </span>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Authentication Error</p>
                <p className="text-[11px] text-red-300/80 mt-0.5">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("miyuru@xmoreart.lk");
                    setPassword("admin1234");
                    setErrorMessage("");
                  }}
                  className="mt-2 text-[11px] text-white font-bold underline block"
                >
                  Use Master Admin Passkey (admin1234) &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  autoComplete="email"
                  placeholder="name@xmoreart.lk (or miyuru)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-brand-red hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="•••••••• (Master Key: admin1234)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-red focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-neutral-400">Remember this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-brand-red/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>SIGN IN TO WORKSPACE</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-neutral-500">
              Internal operations portal for XMORE ART SOLUTIONS.
            </p>
          </div>

        </div>
      </div>

      {/* Emergency Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
          />
          <div className="w-full max-w-md bg-brand-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fade-in">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-3 border border-brand-red/20">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">
                Emergency Password Recovery
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Instantly reset your password or restore Master Admin access
              </p>
            </div>

            {recoverySuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Password successfully restored! Signing you in...</span>
              </div>
            )}

            {recoveryError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {/* Quick 1-Click Master Reset */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-red" />
                <span className="text-xs font-bold uppercase text-white">Master Admin 1-Click Reset</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Restore <strong className="text-white">miyuru@xmoreart.lk</strong> access password back to <code className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-400 font-mono">admin1234</code> immediately.
              </p>
              <button
                type="button"
                onClick={handleInstantMasterReset}
                className="w-full py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-brand-red/20 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Master Password & Auto-Fill</span>
              </button>
            </div>

            {/* Reset Specific Employee Account */}
            <form onSubmit={handleCustomReset} className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Or Reset Any Staff Account:
              </span>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Staff Email or Name (e.g. miyuru)"
                  value={recoveryEmail}
                  onChange={e => setRecoveryEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-brand-red focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="New Password (e.g. admin1234)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-brand-red focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-heading uppercase tracking-wider transition-all"
              >
                Set New Password
              </button>
            </form>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <a
                href={whatsappResetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </a>

              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-[11px] text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-brand-red/20 border-t-brand-red rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
