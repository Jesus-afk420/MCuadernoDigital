import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  ArrowRight, 
  Smile, 
  ShieldCheck, 
  Zap, 
  Sparkles 
} from "lucide-react";
import { UserProfile, UserRole } from "../types";

interface RegistrationFormProps {
  onRegister: (profile: UserProfile) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<UserRole>("alumno");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMsg("Por favor, completa todos los campos del formulario.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas ingresadas no coinciden.");
      return;
    }

    if (password.length < 4) {
      setErrorMsg("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    // Call onRegister with successfully built credentials
    onRegister({
      name: fullName.trim(),
      email: email.trim(),
      role: accountType
    });
  };

  // Quick fill handler for easy platform exploration
  const handleQuickFill = (role: UserRole) => {
    if (role === "alumno") {
      setFullName("prueba alum2");
      setEmail("alumno@cuadernodigital.edu");
      setPassword("123456");
      setConfirmPassword("123456");
      setAccountType("alumno");
    } else {
      setFullName("prueba profe");
      setEmail("profesor@cuadernodigital.edu");
      setPassword("123456");
      setConfirmPassword("123456");
      setAccountType("profesor");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-10 px-4 md:px-12 bg-slate-950 overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[130px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/80% bg-purple-600/5 blur-[160px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[480px]">
        {/* Quick entry helpers */}
        <div className="mb-4 flex flex-wrap gap-2 justify-center text-xs text-slate-400">
          <span className="flex items-center text-slate-500 mr-2 border-r border-slate-800 pr-2">Rellenar demo:</span>
          <button 
            type="button" 
            onClick={() => handleQuickFill("alumno")}
            className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-indigo-400 hover:bg-indigo-950/20 text-slate-300 rounded cursor-pointer"
          >
            Estudiante (alum2)
          </button>
          <button 
            type="button" 
            onClick={() => handleQuickFill("profesor")}
            className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-indigo-400 hover:bg-indigo-950/20 text-slate-300 rounded cursor-pointer"
          >
            Profesor (profe)
          </button>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] shadow-2xl flex flex-col items-center">
          {/* Main icon shield */}
          <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-500/5">
            <User className="text-indigo-400 w-8 h-8" />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl text-slate-100 tracking-tight mb-2">Crear Cuenta</h1>
            <p className="font-sans text-slate-400 text-sm">Únete a Mi Cuaderno Digital</p>
          </div>

          {errorMsg && (
            <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Nombre Completo */}
            <div className="relative flex items-center bg-slate-900/60 border border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all duration-200">
              <User className="absolute left-4 text-slate-500 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
                required
                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-[16px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Correo Electrónico */}
            <div className="relative flex items-center bg-slate-900/60 border border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all duration-200">
              <Mail className="absolute left-4 text-slate-500 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                required
                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-[16px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
              />
            </div>

            {/* Contraseña */}
            <div className="relative flex items-center bg-slate-900/60 border border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all duration-200">
              <Lock className="absolute left-4 text-slate-500 w-5 h-5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-[16px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative flex items-center bg-slate-900/60 border border-slate-800 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all duration-200">
              <Lock className="absolute left-4 text-slate-500 w-5 h-5 pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                required
                className="w-full bg-transparent border-none py-4 pl-12 pr-12 text-[16px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Selección de Tipo de Cuenta */}
            <div className="space-y-3">
              <label className="font-mono text-xs tracking-wider uppercase text-slate-400 pl-1">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAccountType("alumno")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                    accountType === "alumno"
                      ? "bg-indigo-600 text-white font-semibold ring-1 ring-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Smile className="w-5 h-5" />
                  <span className="text-sm">Alumno</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("profesor")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                    accountType === "profesor"
                      ? "bg-indigo-600 text-white font-semibold ring-1 ring-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-sm">Profesor</span>
                </button>
              </div>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-6 rounded-xl font-medium shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all duration-200 mt-4 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Registrarse</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Footer info bits */}
        <footer className="mt-8 flex justify-center gap-8 opacity-40">
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider">IA Integrada</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
