"use client";

import React, { useState } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/utils";
import { MessageCircle, X, Sparkles } from "lucide-react";

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello XMORE ART SOLUTIONS! I would like to consult on a creative project / get a fast quote."
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="bg-brand-dark-card border border-white/10 text-white rounded-2xl p-3.5 shadow-2xl max-w-xs animate-slide-up flex items-start gap-2 relative">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute top-4 left-4" />
          <div className="pl-4 pr-1">
            <div className="text-xs font-bold font-heading text-white flex items-center gap-1.5">
              <span>Chat with Xmore Studio</span>
              <Sparkles className="w-3 h-3 text-brand-red" />
            </div>
            <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
              Need quick pricing or artwork advice? We are active on WhatsApp!
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowTooltip(false);
            }}
            className="text-neutral-400 hover:text-white p-1"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-900/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/30"
        aria-label="Chat with Xmore on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="font-heading font-bold text-xs tracking-wider uppercase pr-1 hidden sm:inline-block">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
};
