"use client";

import { useState, useRef, useEffect } from "react";
import { User, FileText, Award, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function UsagerProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
      // TODO: Implement actual logout logic (Supabase auth)
      router.push('/connexion'); 
  };

  const handleMyContraventions = () => {
    alert("Mes contraventions");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#F0B90B] transition-colors border border-[#2a2a2a]"
        aria-label="Menu profil"
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-[#0C0C0C] border border-[#1f1f1f] rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-[#1f1f1f]">
            <p className="text-sm font-medium text-white">Mon Profil Usager</p>
            <p className="text-xs text-gray-400 mt-1">Gérez vos informations</p>
          </div>
          
          <div className="p-2">
            <button
              onClick={handleMyContraventions}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-white hover:bg-[#1f1f1f] rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F0B90B]/10 text-[#F0B90B] group-hover:bg-[#F0B90B] group-hover:text-black transition-colors">
                <FileText size={16} />
              </div>
              Mes contraventions
            </button>

            <div
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-500 rounded-lg mt-1 select-none"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1f1f1f] text-gray-600">
                <Award size={16} />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span>XP Points</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1f1f1f] px-2 py-1 rounded text-[#F0B90B]">Soon</span>
            </div>
          </div>

          <div className="p-2 border-t border-[#1f1f1f]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400">
                <LogOut size={16} />
              </div>
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
