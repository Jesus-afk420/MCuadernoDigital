/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle, 
  Sparkles, 
  GraduationCap, 
  UserCheck, 
  BookOpen,
  LogOut,
  Smartphone
} from "lucide-react";
import { UserProfile, ClassItem, ChatMessage } from "./types";
import { INITIAL_CLASSES } from "./data";
import { Navigation } from "./components/Navigation";
import { RegistrationForm } from "./components/RegistrationForm";
import { DashboardView } from "./components/DashboardView";
import { AssistantView } from "./components/AssistantView";
import { FlutterIntegration } from "./components/FlutterIntegration";

export default function App() {
  // 1. User Profile State (persisted to localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem("cuaderno_profile");
    return stored ? JSON.parse(stored) : null;
  });

  // 2. Active Classes & Tasks state (persisted to localStorage, falls back to INITIAL_CLASSES)
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const stored = localStorage.getItem("cuaderno_classes");
    return stored ? JSON.parse(stored) : INITIAL_CLASSES;
  });

  // 3. Tab Navigation State
  const [currentTab, setCurrentTab] = useState<string>("inicio");

  // 4. Mobile Drawer Responsive Toggle
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 5. Context class for AI Assistant
  const [selectedAISubject, setSelectedAISubject] = useState<string | undefined>(undefined);
  const [selectedAIClassName, setSelectedAIClassName] = useState<string | undefined>(undefined);

  // 6. Chat History state (persisted to localStorage, initialized with high-fidelity greeting card)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem("cuaderno_chat");
    if (stored) return JSON.parse(stored);
    
    return [
      {
        id: "msg-init-1",
        role: "assistant",
        content: "¡Hola! Soy **Bien** 🤖, tu asistente en **Mi Cuaderno Digital**. Estoy aquí para ayudarte a resolver dudas sobre tus materias, resumir textos o preparar tus exámenes.\n\n¿En qué materia necesitas ayuda hoy?",
        timestamp: "09:41"
      }
    ];
  });

  // Persist State Updates
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("cuaderno_profile", JSON.stringify(userProfile));
    } else {
      localStorage.removeItem("cuaderno_profile");
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("cuaderno_classes", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("cuaderno_chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Handle account registration
  const handleRegister = (profile: UserProfile) => {
    setUserProfile(profile);
    // Custom greeting for registered student/professor
    const personalGreeting: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      role: "assistant",
      content: `¡Bienvenido de vuelta, **${profile.name}**! He adaptado mi sistema de aprendizaje a tu rol de **${profile.role === "alumno" ? "Estudiante" : "Profesor"}**. Explora tus bento cards e introduce códigos de clase para ver o calificar tareas. \n\n¿Tienes alguna duda sobre ${profile.role === "alumno" ? "tus materias o tareas pendientes?" : "la metodología o material que deseas planificar?"}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, personalGreeting]);
    setCurrentTab("inicio");
  };

  // Logout reset
  const handleLogout = () => {
    setUserProfile(null);
    setClasses(INITIAL_CLASSES);
    setChatHistory([
      {
        id: "msg-init-1",
        role: "assistant",
        content: "¡Hola! Soy **Bien** 🤖, tu asistente en **Mi Cuaderno Digital**. Estoy aquí para ayudarte a resolver dudas sobre tus materias, resumir textos o preparar tus exámenes.\n\n¿En qué materia necesitas ayuda hoy?",
        timestamp: "09:41"
      }
    ]);
    setCurrentTab("inicio");
    localStorage.clear();
  };

  // Open Assistant with classroom pre-selected context
  const handleOpenAssistantContext = (subject?: string, className?: string) => {
    setSelectedAISubject(subject);
    setSelectedAIClassName(className);
    
    if (subject && className) {
      const contextAlert: ChatMessage = {
        id: `msg-context-${Date.now()}`,
        role: "assistant",
        content: `He enfocado mi sesión activa en la clase de **${className}** (${subject}). Pregúntame resúmenes, explicaciones o ejercicios prácticos de este curso.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, contextAlert]);
    }
    
    setCurrentTab("asistente");
  };

  // Render authentication or application dashboard
  if (!userProfile) {
    return <RegistrationForm onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden pb-24 md:pb-6">
      
      {/* Top App Header Bar */}
      <header className="flex justify-between items-center px-4 md:px-12 h-16 w-full z-50 fixed top-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2 hover:bg-slate-900 transition-colors rounded-full text-slate-150 cursor-pointer md:hidden"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5 text-indigo-400" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold font-display shadow-md shadow-indigo-600/20">
              C
            </div>
            <h1 className="font-display font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Mi Cuaderno Digital
            </h1>
          </div>
        </div>

        {/* Global Toolbar actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={() => handleOpenAssistantContext("Ayuda general", "General")} 
            className="p-2 hover:bg-slate-905 hover:text-indigo-400 rounded-full text-slate-400 duration-200"
            title="Consola de Búsqueda"
          >
            <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
          <button 
            onClick={() => alert("No tienes notificaciones de tareas pendientes nuevas hoy.")} 
            className="p-2 hover:bg-slate-905 hover:text-indigo-400 rounded-full text-slate-400 duration-200 relative animate-pulse"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => handleOpenAssistantContext("Manual", "Uso del Cuaderno")} 
            className="p-2 hover:bg-slate-905 hover:text-indigo-400 rounded-full text-slate-400 duration-200"
            title="Preguntas Frecuentes"
          >
            <HelpCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </header>

      {/* Main Drawer Navigation & Main panel Layout */}
      <div className="flex">
        {/* Persistent Desktop Sidebar Drawer and Responsive Mobile Overlay */}
        <Navigation 
          currentTab={currentTab} 
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setIsDrawerOpen(false);
          }}
          userProfile={userProfile}
          onLogout={handleLogout}
        />

        {/* Backdrop for interactive Mobile overlay */}
        {isDrawerOpen && (
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden"
          ></div>
        )}

        {/* Mobile slide drawer */}
        <div className={`fixed inset-y-0 left-0 z-50 transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:hidden w-72 bg-slate-900 border-r border-slate-800`}>
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="font-display font-extrabold text-lg text-indigo-300">Navegación</h2>
            <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 text-sm font-semibold">Cerrar</button>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <button
              onClick={() => { setCurrentTab("inicio"); setIsDrawerOpen(false); }}
              className={`flex items-center gap-4 py-3 px-4 rounded-xl text-left ${currentTab === "inicio" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => { setCurrentTab("clases"); setIsDrawerOpen(false); }}
              className={`flex items-center gap-4 py-3 px-4 rounded-xl text-left ${currentTab === "clases" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Mis Clases</span>
            </button>
            <button
              onClick={() => { setCurrentTab("asistente"); setIsDrawerOpen(false); }}
              className={`flex items-center gap-4 py-3 px-4 rounded-xl text-left ${currentTab === "asistente" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Asistente IA</span>
            </button>
            <button
              onClick={() => { setCurrentTab("flutter"); setIsDrawerOpen(false); }}
              className={`flex items-center gap-4 py-3 px-4 rounded-xl text-left ${currentTab === "flutter" ? "bg-indigo-600 text-white font-bold" : "text-slate-400"}`}
            >
              <Smartphone className="w-5 h-5" />
              <span>Móvil Flutter</span>
            </button>
            
            <div className="border-t border-slate-800 pt-4 mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 py-3 px-4 rounded-xl text-left w-full text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 pt-24 px-4 md:px-12 md:ml-72 min-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* View Switching Router based on currentTab */}
            {currentTab === "inicio" && (
              <DashboardView 
                userProfile={userProfile}
                classes={classes}
                setClasses={setClasses}
                onOpenAssistant={handleOpenAssistantContext}
              />
            )}

            {currentTab === "clases" && (
              <DashboardView 
                userProfile={userProfile}
                classes={classes}
                setClasses={setClasses}
                onOpenAssistant={handleOpenAssistantContext}
              />
            )}

            {currentTab === "asistente" && (
              <AssistantView 
                userProfile={userProfile}
                selectedSubject={selectedAISubject}
                selectedClass={selectedAIClassName}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
              />
            )}

            {currentTab === "flutter" && (
              <FlutterIntegration />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
