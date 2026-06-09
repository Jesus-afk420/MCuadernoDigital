import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  MoreVertical, 
  Mic, 
  Paperclip, 
  Copy, 
  Check, 
  Sprout, 
  Ruler, 
  Scroll,
  CornerDownLeft,
  ChevronDown
} from "lucide-react";
import { ChatMessage, UserProfile } from "../types";
import { SUGGESTED_CHIPS } from "../data";

interface AssistantViewProps {
  userProfile: UserProfile;
  selectedSubject?: string;
  selectedClass?: string;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  userProfile,
  selectedSubject,
  selectedClass,
  chatHistory,
  setChatHistory,
}) => {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [questionsRemaining, setQuestionsRemaining] = useState(49);

  const listEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll chat history on new messages
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Handle autogrowing textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  // Copy text helper
  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Query server proxy endpoint with current messages (handles retries gracefully to avoid duplicate historical messages)
  const sendMessageToServer = async (messageContent: string, isRetry = false) => {
    if (!messageContent.trim()) return;

    setErrorMsg("");
    let updatedHistory = chatHistory;

    if (!isRetry) {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: "user",
        content: messageContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      updatedHistory = [...chatHistory, userMsg];
      setChatHistory(updatedHistory);
      setInputText("");
      setQuestionsRemaining(prev => Math.max(0, prev - 1));
    }

    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
          userRole: userProfile.role,
          subject: selectedSubject,
          className: selectedClass
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "No se pudo obtener respuesta de Bien.");
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Error communicating with Gemini proxy API:", err);
      setErrorMsg(err.message || "Lo siento, hubo un problema al conectarse con el Asistente IA 'Bien'.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    // Find the last message sent by the user to retry it gracefully without duplication
    const lastUserMessage = [...chatHistory].reverse().find(msg => msg.role === "user");
    if (lastUserMessage) {
      sendMessageToServer(lastUserMessage.content, true);
    } else {
      sendMessageToServer("¿Qué es la fotosíntesis?");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToServer(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageToServer(inputText);
    }
  };

  // Parse elementary markdown tags safely and performantly, adding layout lists and styling
  const formatMarkdown = (text: string) => {
    // 1. Remove dangerous scripts
    let safeText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. Bold text **something**
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300 font-bold">$1</strong>');
    
    // 3. Italics *something*
    safeText = safeText.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // 4. Code block representation
    safeText = safeText.replace(/```([\s\S]*?)```/g, '<pre class="bg-indigo-950/40 p-3 rounded-lg border border-indigo-900/30 font-mono text-xs text-slate-300 my-2 overflow-x-auto select-all">$1</pre>');
    safeText = safeText.replace(/`([^`]+)`/g, '<code class="bg-indigo-950/40 text-indigo-200 px-1 py-0.5 rounded font-mono text-xs border border-indigo-900/20">$1</code>');

    // 5. Linebreaks and list format
    const lines = safeText.split("\n");
    let inList = false;
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const content = trimmed.substring(1).trim();
        const prefix = inList ? "" : '<ul class="list-disc pl-5 space-y-1.5 my-2">';
        inList = true;
        return `${prefix}<li>${content}</li>`;
      } else {
        const suffix = inList ? "</ul>" : "";
        inList = false;
        return `${suffix}<p class="mb-2 leading-relaxed">${line}</p>`;
      }
    });

    return formattedLines.join("");
  };

  // Map suggesting chip icons
  const getChipIcon = (iconName: string) => {
    switch (iconName) {
      case "sprout":
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      case "triangle":
        return <Ruler className="w-4 h-4 text-indigo-400" />;
      case "scroll":
        return <Scroll className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] relative overflow-hidden bg-slate-950 rounded-2xl border border-slate-900 shadow-xl max-w-4xl mx-auto">
      
      {/* Header Chat Identity */}
      <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 shadow-lg">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-slate-100 leading-tight">Bien - Asistente IA</h2>
            <p className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
              {questionsRemaining} preguntas disponibles hoy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedSubject && (
            <span className="hidden sm:inline bg-indigo-950/40 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-505/20 max-w-[120px] truncate">
              {selectedSubject}
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-slate-950 text-slate-400 px-3 py-1 rounded-full text-xs border border-slate-805 cursor-pointer hover:bg-slate-900">
            <span>General</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <button className="text-slate-400 hover:text-indigo-400 p-1.5 rounded-lg transition-colors cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main chat log */}
      <div className="flex-1 overflow-y-auto px-6 py-6 chat-scroll space-y-6">
        
        {chatHistory.map((message) => {
          const isAI = message.role === "assistant";
          return (
            <div 
              key={message.id} 
              className={`flex flex-col max-w-[85%] ${isAI ? "items-start" : "items-end ml-auto"}`}
            >
              {/* Message metadata details */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  {isAI ? "BIEN" : "TÚ"} • {message.timestamp}
                </span>
              </div>

              {/* Message balloon */}
              <div 
                className={`p-5 rounded-2xl relative shadow-sm leading-relaxed overflow-hidden group ${
                  isAI 
                    ? "rounded-tl-none bg-slate-900 border border-slate-800 text-slate-200" 
                    : "rounded-tr-none bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10"
                }`}
              >
                {isAI ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                    className="space-y-1 font-sans text-sm md:text-[15px]"
                  />
                ) : (
                  <p className="font-sans text-sm md:text-[15px] whitespace-pre-wrap">{message.content}</p>
                )}
              </div>

              {/* Auxiliary inline message actions (e.g. copy) */}
              {isAI && (
                <button
                  onClick={() => handleCopyToClipboard(message.content, message.id)}
                  className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-202 transition-all text-xs font-medium cursor-pointer"
                >
                  {copiedId === message.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-450" />
                      <span className="text-emerald-400 font-semibold">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar sugerencia</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}

        {/* Dynamic AI typing pulsed dots state */}
        {isTyping && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex gap-1 bg-slate-900 p-3 rounded-2xl rounded-tl-none border border-slate-800">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1s" }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms", animationDuration: "1s" }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms", animationDuration: "1s" }}></div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm max-w-lg mx-auto text-center">
            <p className="font-semibold mb-1">Error de Conexión</p>
            <p>{errorMsg}</p>
            <button 
              onClick={handleRetry}
              className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-rose-200 px-3 py-1 rounded-lg border border-red-500/30 font-semibold uppercase cursor-pointer"
            >
              Reintentar pregunta
            </button>
          </div>
        )}

        <div ref={listEndRef} />
      </div>

      {/* Input area control panel */}
      <div className="p-6 bg-slate-900/90 border-t border-slate-800 backdrop-blur-sm mt-auto z-10 space-y-4">
        
        {/* Chips row shortcuts */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
          {SUGGESTED_CHIPS.map((chip, index) => (
            <button
              key={index}
              onClick={() => sendMessageToServer(chip.text)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-indigo-600 text-slate-350 hover:text-white transition-all rounded-full border border-slate-850 whitespace-nowrap text-xs font-semibold cursor-pointer active:scale-95"
            >
              {getChipIcon(chip.icon)}
              <span>{chip.text}</span>
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-3">
          <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all px-4 py-3.5 flex items-center shadow-inner">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-slate-100 placeholder:text-slate-505 resize-none text-[15px] max-h-40 font-sans"
            />
            
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <button 
                type="button"
                onClick={() => sendMessageToServer("Hola Bien, ayúdame a repasar para mis exámenes.")}
                className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded hover:bg-slate-900 cursor-pointer"
                title="Dictar pregunta"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={() => setInputText("Adjunto mapa conceptual...")}
                className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded hover:bg-slate-900 cursor-pointer"
                title="Adjuntar archivo"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer ${
              inputText.trim() && !isTyping
                ? "bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-600/10"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Background radial soft elements */}
      <div className="absolute top-1/4 -right-24 w-72 h-72 bg-indigo-600/5 rounded-full blur-[90px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 -left-2a4 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] pointer-events-none z-0"></div>
    </div>
  );
};
