import React, { useState, useEffect } from "react";
import { 
  PlusCircle, 
  ChevronRight, 
  User, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Badge, 
  X,
  Star,
  Clock,
  ArrowRight
} from "lucide-react";
import { ClassItem, Task, UserProfile } from "../types";

interface DashboardViewProps {
  userProfile: UserProfile;
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  onOpenAssistant: (subject?: string, className?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  classes,
  setClasses,
  onOpenAssistant
}) => {
  // Stats state variables
  const [stats, setStats] = useState({ average: 0, submitted: 0, pending: 0 });

  // Modal display control
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  // Create class input fields
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("MATEMÁTICAS");
  const [newClassTeacher, setNewClassTeacher] = useState(userProfile.name);

  // Selected Class details state
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Task creation state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-06-15");

  // Grade state index
  const [gradingTaskId, setGradingTaskId] = useState<string | null>(null);
  const [gradingScore, setGradingScore] = useState("");

  // Calculate dynamic statistics based on active classes and current profile
  useEffect(() => {
    let totals = 0;
    let submittedCount = 0;
    let pendingCount = 0;
    let scoredSum = 0;
    let scoredCount = 0;

    classes.forEach(c => {
      c.tasks.forEach(t => {
        totals++;
        if (t.submitted) {
          submittedCount++;
          if (t.score !== null) {
            scoredSum += t.score;
            scoredCount++;
          }
        } else {
          pendingCount++;
        }
      });
    });

    const averageScore = scoredCount > 0 ? Math.round(scoredSum / scoredCount) : 0;
    setStats({
      average: averageScore,
      submitted: submittedCount,
      pending: pendingCount
    });
  }, [classes]);

  // Handle joining a class code
  const handleJoinClass = () => {
    setJoinError("");
    const cleanedCode = joinCode.trim().toUpperCase();

    if (cleanedCode.length !== 6) {
      setJoinError("El código de la clase debe tener exactamente 6 caracteres.");
      return;
    }

    // Check if class exists and is not already joined
    const matchedClass = classes.find(c => c.code === cleanedCode);
    if (!matchedClass) {
      // Create a temporary mock class if they enter a custom code to allow seamless exploration
      const randomSubjects = ["BIOLOGÍA", "HISTORIA", "MATEMÁTICAS", "CIENCIAS", "LITERATURA"];
      const randomSub = randomSubjects[Math.floor(Math.random() * randomSubjects.length)];
      const customClass: ClassItem = {
        id: `custom-${Date.now()}`,
        name: `Clase Autogenerada ${cleanedCode}`,
        subject: randomSub,
        code: cleanedCode,
        teacherName: "Profesor Virtual",
        studentCount: 1,
        tasks: [
          {
            id: `task-custom-${Date.now()}`,
            title: "Ensayo Introductorio de la Materia",
            dueDate: "2026-06-20",
            submitted: false,
            score: null
          }
        ]
      };
      setClasses(prev => [...prev, customClass]);
      setIsJoinModalOpen(false);
      setJoinCode("");
      return;
    }

    // Since the system keeps full catalog locally in `classes` during mock simulation, 
    // it's already there! Just open it and let user know it's already registered or successfully selected.
    setIsJoinModalOpen(false);
    setJoinCode("");
    setSelectedClassId(matchedClass.id);
  };

  // Create a new class (for teachers)
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // Generate random 6 characters alphanumeric code (e.g. MAT281, BIO942)
    const prefix = newClassSubject.slice(0, 3).toUpperCase();
    const numbers = Math.floor(100 + Math.random() * 900);
    const code = `${prefix}${numbers}`;

    const newClass: ClassItem = {
      id: `class-${Date.now()}`,
      name: newClassName.trim(),
      subject: newClassSubject,
      code: code,
      teacherName: newClassTeacher || userProfile.name,
      studentCount: 0,
      tasks: []
    };

    setClasses(prev => [newClass, ...prev]);
    setNewClassName("");
    setIsCreateModalOpen(false);
  };

  // Add task to a specific class (for teachers)
  const handleAddTask = (e: React.FormEvent, classId: string) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      dueDate: newTaskDueDate,
      submitted: false,
      score: null
    };

    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          tasks: [...c.tasks, newTask]
        };
      }
      return c;
    }));

    setNewTaskTitle("");
  };

  // Mark student task as submitted / delivered (for students)
  const handleDeliverTask = (classId: string, taskId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          tasks: c.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, submitted: true, score: null }; // Pending grade initially
            }
            return t;
          })
        };
      }
      return c;
    }));
  };

  // Input grade score for student task (for teachers)
  const handleGradeTask = (classId: string, taskId: string) => {
    const scoreVal = parseInt(gradingScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) return;

    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          tasks: c.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, score: scoreVal, submitted: true };
            }
            return t;
          })
        };
      }
      return c;
    }));

    setGradingTaskId(null);
    setGradingScore("");
  };

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días,";
    if (hour < 19) return "Buenas tardes,";
    return "Buenas noches,";
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <section className="mb-8">
        <p className="text-slate-400 font-sans text-sm mb-1">{getGreeting()}</p>
        <h2 className="text-indigo-300 font-display font-extrabold text-3xl md:text-4xl capitalize">
          {userProfile.name}
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-1 tracking-wider uppercase">
          Rol: {userProfile.role === "alumno" ? "Estudiante" : "Docente"} • Cuaderno Activo
        </p>
      </section>

      {/* Quick Stats Bento Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Stat 1: Promedio */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-all duration-300">
          <Star className="text-amber-400 w-8 h-8 mb-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display font-bold text-4xl text-slate-100">{stats.average}%</span>
          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider mt-1">PROMEDIO GRADO</span>
        </div>

        {/* Stat 2: Entregados */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-all duration-300">
          <CheckCircle className="text-emerald-400 w-8 h-8 mb-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display font-bold text-4xl text-slate-100">{stats.submitted}</span>
          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider mt-1">ENTREGADOS</span>
        </div>

        {/* Stat 3: Pendientes */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-all duration-300">
          <Clock className="text-rose-400 w-8 h-8 mb-4 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display font-bold text-4xl text-slate-100">{stats.pending}</span>
          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider mt-1">TAREAS PENDIENTES</span>
        </div>
      </section>

      {/* Interactive Main Classes Area */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="font-display font-bold text-xl text-slate-200">Tus Clases</h3>
          <span className="text-slate-400 font-mono text-xs">{classes.length} clases en curso</span>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const pendingTasks = cls.tasks.filter(t => !t.submitted).length;
            const subjectColors: Record<string, string> = {
              "MATEMÁTICAS": "bg-indigo-600/30 border-indigo-500/40 text-indigo-200",
              "BIOLOGÍA": "bg-emerald-600/30 border-emerald-500/40 text-emerald-200",
              "HISTORIA": "bg-amber-600/30 border-amber-500/40 text-amber-200",
              "CIENCIAS": "bg-sky-600/30 border-sky-500/40 text-sky-200",
              "LITERATURA": "bg-purple-600/30 border-purple-500/40 text-purple-200",
            };

            const matchedColor = subjectColors[cls.subject] || "bg-slate-700/30 border-slate-600/40 text-slate-200";

            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`bg-slate-900/40 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between group ${
                  selectedClassId === cls.id 
                    ? "border-indigo-500 ring-1 ring-indigo-500/20 bg-slate-900/60" 
                    : "border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/50"
                }`}
              >
                {/* Visual Header */}
                <div className="p-5 border-b border-slate-800/60 relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-medium border ${matchedColor}`}>
                      {cls.subject}
                    </span>
                    <span className="text-slate-500 font-mono text-xs font-semibold">{cls.code}</span>
                  </div>
                  <h4 className="font-display font-bold text-[18px] text-slate-100 leading-snug group-hover:text-indigo-400 transition-colors">
                    {cls.name}
                  </h4>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 font-sans text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Prof: {cls.teacherName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>{cls.studentCount} estudiantes inscritos</span>
                  </div>
                </div>

                {/* Footer block */}
                <div className="px-5 py-4 bg-slate-950/40 border-t border-slate-800/60 flex justify-between items-center text-xs">
                  {pendingTasks > 0 ? (
                    <span className="text-amber-400 font-mono font-medium tracking-wide">
                      {pendingTasks} {pendingTasks === 1 ? "TAREA PENDIENTE" : "TAREAS PENDIENTES"}
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono font-medium">TODO ENTREGADO</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {/* Dotted responsive trigger for adding or joining based on Rol */}
          <button
            onClick={() => userProfile.role === "alumno" ? setIsJoinModalOpen(true) : setIsCreateModalOpen(true)}
            className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-indigo-500 hover:text-indigo-300 transition-all duration-300 cursor-pointer group text-center min-h-[180px] bg-transparent"
          >
            <Plus className="w-8 h-8 mb-3 text-slate-500 group-hover:scale-110 transition-transform duration-300" />
            <p className="font-sans font-medium text-sm">
              {userProfile.role === "alumno" ? "Unirse a otra clase" : "Crear nueva materia"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {userProfile.role === "alumno" ? "Introduce el código del profesor" : "Genera un aula digital"}
            </p>
          </button>
        </div>

        {/* Selected Class expanded details panel */}
        {selectedClass && (
          <div className="mt-8 p-6 md:p-8 bg-slate-900/30 border border-slate-850 rounded-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">{selectedClass.subject} • CÓDIGO: {selectedClass.code}</span>
                <h3 className="font-display font-extrabold text-2xl text-slate-200 mt-1">{selectedClass.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Impartido por {selectedClass.teacherName} • Estudiantes: {selectedClass.studentCount}</p>
              </div>

              {/* Action buttons inside class context */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onOpenAssistant(selectedClass.subject, selectedClass.name)}
                  className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Preguntar a Bien IA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedClassId(null)}
                  className="text-slate-400 hover:bg-slate-800 p-2 rounded-xl border border-slate-800 hover:border-slate-750 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Tabs: Tasks Manager */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Tasks List */}
              <div className="lg:col-span-12 space-y-4">
                <h4 className="font-display font-bold text-lg text-slate-300">Tareas y Entregas</h4>

                {selectedClass.tasks.length === 0 ? (
                  <p className="text-slate-500 text-sm italic py-4">No hay tareas programadas para esta clase.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedClass.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition-colors"
                      >
                        <div>
                          <p className="font-sans font-semibold text-slate-200">{task.title}</p>
                          <div className="flex flex-wrap gap-3 items-center mt-1.5 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5 font-mono">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              Límite: {task.dueDate}
                            </span>
                            
                            {task.submitted ? (
                              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px] font-semibold">
                                <CheckCircle className="w-3.5 h-3.5" />
                                ENTREGADO
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-rose-400 font-mono text-[11px] font-semibold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                PENDIENTE
                              </span>
                            )}

                            {task.score !== null && (
                              <span className="bg-amber-400/10 text-amber-300 px-2.5 py-0.5 rounded border border-amber-400/20 font-mono text-[11px] font-bold">
                                Nota: {task.score}/100
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Interactive state actions depending on roles */}
                        <div className="self-end sm:self-auto flex items-center gap-2">
                          {userProfile.role === "alumno" && !task.submitted && (
                            <button
                              onClick={() => handleDeliverTask(selectedClass.id, task.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/10 transition-colors cursor-pointer"
                            >
                              Entregar Tarea
                            </button>
                          )}

                          {userProfile.role === "profesor" && (
                            <div className="flex items-center gap-2">
                              {task.submitted ? (
                                <>
                                  {gradingTaskId === task.id ? (
                                    <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 border border-slate-805 rounded-xl animate-in fade-in zoom-in-95">
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder="Nota"
                                        value={gradingScore}
                                        onChange={(e) => setGradingScore(e.target.value)}
                                        className="w-16 bg-slate-950 border-slate-800 rounded-lg p-1 text-xs text-center text-slate-100 focus:outline-none"
                                      />
                                      <button
                                        onClick={() => handleGradeTask(selectedClass.id, task.id)}
                                        className="bg-indigo-600 text-white p-1 rounded-lg hover:bg-indigo-500 cursor-pointer"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setGradingTaskId(null)}
                                        className="text-slate-400 p-1 rounded"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setGradingTaskId(task.id);
                                        setGradingScore(task.score?.toString() || "");
                                      }}
                                      className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg border border-indigo-500/20 font-medium text-xs transition-colors cursor-pointer"
                                    >
                                      {task.score !== null ? "Editar Nota" : "Calificar"}
                                    </button>
                                  )}
                                </>
                              ) : (
                                <p className="text-xs text-slate-500 italic">Espera de entrega</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Teacher Only Column: Add new Assignment tasks */}
              {userProfile.role === "profesor" && (
                <div className="lg:col-span-12 border-t border-slate-800/80 pt-6">
                  <h4 className="font-display font-semibold text-slate-300 mb-3 text-sm">Añadir nueva asignación de tarea</h4>
                  <form onSubmit={(e) => handleAddTask(e, selectedClass.id)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/20 p-4 border border-slate-850 rounded-2xl items-end">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-slate-400">Título de la tarea</label>
                      <input
                        type="text"
                        placeholder="Ej. Análisis de Lectura"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        required
                        className="w-full bg-slate-950/60 border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-slate-400">Fecha Límite</label>
                      <input
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        required
                        className="w-full bg-slate-950/60 border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-sm h-11 cursor-pointer transition-colors sm:col-span-2 lg:col-span-2"
                    >
                      Crear Tarea
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* MODAL 1: UNIRSE A UNA CLASE (Exactly matching screenshot layout details) */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay blur */}
          <div 
            onClick={() => {
              setIsJoinModalOpen(false);
              setJoinCode("");
              setJoinError("");
            }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          ></div>

          {/* Modal Card content */}
          <div className="glass-panel relative w-full max-w-[420px] mx-4 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <header className="mb-6">
              <h2 className="font-display font-bold text-2xl text-slate-100 mb-2">Unirse a una clase</h2>
              <p className="text-slate-400 text-sm">Ingresa el código de tu profesor:</p>
            </header>

            {joinError && (
              <p className="text-red-400 text-xs mb-3 font-medium bg-red-400/5 p-2 rounded border border-red-500/10 text-center">{joinError}</p>
            )}

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Código"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-center text-xl font-mono text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex justify-end mt-2">
                  <span className={`font-mono text-xs tracking-wider ${joinCode.length === 6 ? "text-indigo-400 font-bold" : "text-slate-500"}`}>
                    {joinCode.length}/6
                  </span>
                </div>
              </div>

              {/* Quick suggestions to make it simple */}
              <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-850/50 text-xs text-slate-400">
                <p className="font-semibold mb-1 text-[11px] uppercase tracking-wider text-slate-500">Códigos disponibles en el sistema:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {classes.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setJoinCode(c.code)}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 hover:border-indigo-400 rounded font-bold text-[11px] font-mono cursor-pointer"
                    >
                      {c.name} ({c.code})
                    </button>
                  ))}
                  <button 
                    onClick={() => setJoinCode("GEO711")} 
                    className="px-2 py-1 bg-slate-950 border border-slate-800 hover:border-indigo-400 rounded font-bold text-[11px] font-mono cursor-pointer text-indigo-400/95"
                  >
                    + Nuevo GEO711
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setIsJoinModalOpen(false);
                    setJoinCode("");
                    setJoinError("");
                  }}
                  className="px-6 py-2.5 text-slate-300 font-semibold hover:bg-slate-800 transition-colors rounded-full cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleJoinClass}
                  disabled={joinCode.length !== 6}
                  className={`px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-full transition-all cursor-pointer ${
                    joinCode.length === 6 
                      ? "hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 active:scale-95" 
                      : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  Unirme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR UNA MATERIA / CLASE (For teachers) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay */}
          <div 
            onClick={() => setIsCreateModalOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          ></div>

          <div className="glass-panel relative w-full max-w-[450px] mx-4 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <header className="mb-6">
              <h2 className="font-display font-bold text-2xl text-slate-100 mb-2">Crear nueva clase</h2>
              <p className="text-slate-400 text-sm">Configura la información de la materia:</p>
            </header>

            <form onSubmit={handleCreateClass} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-450 tracking-wider">Nombre de la Clase</label>
                <input
                  type="text"
                  placeholder="Ej. Cálculo Multivariable"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-450 tracking-wider">Categoría / Área de Estudio</label>
                <select
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:border-indigo-500 focus:outline-none font-sans"
                >
                  <option value="MATEMÁTICAS">MATEMÁTICAS</option>
                  <option value="BIOLOGÍA">BIOLOGÍA</option>
                  <option value="HISTORIA">HISTORIA</option>
                  <option value="CIENCIAS">CIENCIAS</option>
                  <option value="LITERATURA">LITERATURA</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-slate-450 tracking-wider">Nombre del Docente</label>
                <input
                  type="text"
                  value={newClassTeacher}
                  onChange={(e) => setNewClassTeacher(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-205 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 text-slate-300 font-semibold hover:bg-slate-800 transition-colors rounded-full cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full shadow-lg shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer"
                >
                  Crear Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Buttons Area for convenient touch layout */}
      <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50 flex flex-col items-end gap-3">
        {userProfile.role === "alumno" ? (
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="bg-indigo-600 text-white rounded-xl px-5 py-4 flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all group cursor-pointer border border-indigo-500/30"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold text-sm">Unirse a Clase</span>
          </button>
        ) : (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 text-white rounded-xl px-5 py-4 flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all group cursor-pointer border border-indigo-500/30"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">Crear Clase</span>
          </button>
        )}
      </div>
    </div>
  );
};
