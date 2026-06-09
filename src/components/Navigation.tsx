import React from "react";
import { GraduationCap, Home, Info, MessageSquare, Settings, User, Smartphone } from "lucide-react";

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userProfile: { name: string; role: string } | null;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  onLogout,
}) => {
  const menuItems = [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "clases", label: "Mis Clases", icon: GraduationCap },
    { id: "asistente", label: "Asistente IA", icon: MessageSquare },
    { id: "flutter", label: "Móvil Flutter", icon: Smartphone },
  ];

  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 flex-col py-6 bg-slate-900 border-r border-slate-800 w-72 h-full pt-20">
        <nav className="flex flex-col gap-2 px-4 h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-4 py-3 px-4 rounded-full transition-all duration-200 cursor-pointer text-left w-full ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-indigo-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-sans text-[16px]">{item.label}</span>
              </button>
            );
          })}
          
          <div className="mt-auto border-t border-slate-800 pt-4 flex flex-col gap-2">
            {userProfile && (
              <div className="px-4 py-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center border border-indigo-500/30">
                  {userProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-200 truncate">{userProfile.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{userProfile.role}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={onLogout}
              className="flex items-center gap-4 py-2.5 px-4 rounded-full text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left cursor-pointer"
            >
              <User className="w-5 h-5 text-red-400/80" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Bottom navbar for Mobile viewports */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-safe md:hidden bg-slate-900 border-t border-slate-800/80 shadow-lg">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 rounded-xl px-4 ${
                isActive
                  ? "text-indigo-400 font-medium scale-105"
                  : "text-slate-400 hover:text-indigo-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-mono text-[10px] uppercase mt-1 tracking-wider">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-red-300 rounded-xl px-4"
        >
          <User className="w-5 h-5 text-red-400/80" />
          <span className="font-mono text-[10px] uppercase mt-1 tracking-wider">Salir</span>
        </button>
      </nav>
    </>
  );
};
