"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { DataStore } from "@/lib/data/dataStore";
import { Employee } from "@/lib/types";
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
  Sparkles,
  UserCheck,
  ChevronRight,
  X
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
  const [registeredEmployees, setRegisteredEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    try {
      const list = DataStore.getEmployees();
      setRegisteredEmployees(list || []);
      // If only 1 employee (Master Admin), default to filling master admin
      if (list && list.length === 1 && !email) {
        setEmail(list[0].email);
        setPassword(list[0].password || "admin1234");
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSelectStaff = (emp: Employee) => {
    setEmail(emp.email);
    setPassword(emp.password || "admin1234");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        // Direct browser navigation ensures session is fully hydrated on the next page
        window.location.href = returnUrl || "/admin";
      } else {
        setErrorMessage(result.error || "Authentication failed. Please verify your credentials.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappHelpUrl = getWhatsAppLink(
    settings.whatsappNumber || "94716666643",
    `Hello Administrator! I am requesting a password reset for my XMORE staff account: ${email || "[Your Email]"}.`
  );

  const fillMasterAdmin = () => {
    const admin = registeredEmployees.find(e => e.role === "SUPER_ADMIN") || registeredEmployees[0];
    setEmail(admin ? admin.email : "miyuru@xmoreart.lk");
    setPassword(admin?.password || "admin1234");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-brand-black text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-subtle-grid-dark opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 animate-fade-in">
        
        {/* Top Back Link & Security Badge */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            <span>Encrypted Portal</span>
          </span>
        </div>

        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <BrandLogo size="lg" href="/" />
          </div>
          <h1 className="font-heading font-extrabold text-xl uppercase tracking-wider text-white">
            Staff Portal Sign In
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Access internal studio operations, CRM & quotations
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3 animate-slide-up">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Sign In Failed</p>
              <p className="text-neutral-300 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Real Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Staff Email Address
              </label>
              <button
                type="button"
                onClick={fillMasterAdmin}
                className="text-[11px] text-brand-red hover:underline font-medium"
              >
                Auto-Fill Master
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                required
                autoComplete="email"
                placeholder="e.g. miyuru@xmoreart.lk"
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
                className="text-[11px] text-brand-red hover:underline"
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
                placeholder="Enter your access password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-brand-red focus:outline-none text-white text-xs placeholder-neutral-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
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

        {/* Registered Staff Accounts Quick Select */}
        {registeredEmployees.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-brand-red" />
                <span>Registered Staff Accounts ({registeredEmployees.length}):</span>
              </span>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {registeredEmployees.map((emp) => (
                <button
                  type="button"
                  key={emp.id}
                  onClick={() => handleSelectStaff(emp)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    email.toLowerCase() === emp.email.toLowerCase()
                      ? "bg-brand-red/10 border-brand-red text-white"
                      : "bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={emp.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                      alt={emp.name}
                      className="w-7 h-7 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{emp.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{emp.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                      {emp.role.replace("_", " ")}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-neutral-500">
            Internal operations portal for XMORE ART SOLUTIONS. Unauthorized login attempts are logged.
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowForgotModal(false)}
          />
          <div className="w-full max-w-sm bg-brand-dark-card border border-white/15 rounded-3xl p-6 shadow-2xl relative z-10 animate-fade-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="font-heading font-bold text-lg text-white mb-2">
              Staff Password Assistance
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              For security, staff account passwords are managed centrally. Please message your Super Administrator to reset your access PIN.
            </p>

            <div className="space-y-3">
              <a
                href={whatsappHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Admin via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-red/20 border-t-brand-red rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
