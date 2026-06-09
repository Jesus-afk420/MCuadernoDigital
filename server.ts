import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// High-fidelity structured local tutor assistant fallback for resilient offline learning when API quota (20 free queries) is reached
function getLocalTutorResponse(query: string, role: string, subject: string, isQuota: boolean): string {
  const norm = query.toLowerCase();
  const isProfesor = role === "profesor";
  const userRoleStr = isProfesor ? "Profesor" : "Estudiante";
  const contextSubject = subject || "General";

  const banner = isQuota
    ? `### 🤖 Asistente IA "Bien" — Modo de Respaldo Activo 🌿\n\n> ⚠️ **Aviso de Límite de Cuota alcanzado (20 consultas diarias):** Tu clave de API gratuita ha agotado el límite de 20 consultas diarias. ¡Pero el aprendizaje no se detiene! Para apoyarte en tus actividades escolares sin interrupciones, hemos activado el **Modo de Respaldo Local**.\n\n`
    : `### 🤖 Asistente IA "Bien" — Modo de Respaldo Activo 🌿\n\n> ⚙️ **Aviso del Sistema:** La conexión directa con el servidor de IA está experimentando alta demanda o requiere configuración en Settings. ¡Pero el aprendizaje no se detiene! He activado el **Modo de Respaldo Local** para apoyarte sin interrupciones.\n\n`;

  const footer = `\n\n---\n💡 *Tip: Puedes seguir organizando tus semanas, completando tus tareas en el calendario y guardando apuntes. Tu cuaderno digital sigue totalmente operativo.*`;

  // 1. Hola, saludos, etc.
  if (norm.includes("hola") || norm.includes("saludo") || norm.includes("buenos d") || norm.includes("buenas t") || norm.includes("bien") || norm.trim() === "?" || norm.trim() === "ayuda") {
    if (isProfesor) {
      return banner + `¡Hola! Qué gusto saludarte. En este **Modo de Respaldo para Profesores**, estoy listo para ayudarte a planificar tu materia de **${contextSubject}**:

- 📝 **Estructuras de clase**: Inicio, Desarrollo y Cierre de tus lecciones.
- 🎯 **Rúbricas rápidas**: Criterios prácticos para calificar el desempeño.
- ⚡ **Dinámicas creativas**: Ideas didácticas para entusiasmar a tus alumnos.

**Dime el tema que deseas preparar hoy** (por ejemplo, escribe *fotosíntesis* u *óptica*) y te daré una propuesta curricular detallada de inmediato.` + footer;
    } else {
      return banner + `¡Hola! Un gusto saludarte en este momento de estudio. En este **Modo de Respaldo para Alumnos**, te guiaré paso a paso en **${contextSubject}**:

- 🧩 **Explicaciones sencillas**: Desgloso temas complejos de forma muy fácil de asimilar.
- 🧠 **Cuestionarios de autoevaluación**: Preguntas clave para entrenar antes de tus exámenes.
- 🔍 **Guías paso a paso**: Cómo razonar problemas y estudiar correctamente.

**Escribe el tema que necesitas comprender hoy** (por ejemplo, escribe *fotosíntesis*, *álgebra*, o *leyes del movimiento*) para iniciar tu sesión de entrenamiento.` + footer;
    }
  }

  // 2. Fotosíntesis / biología
  if (norm.includes("fotosin") || norm.includes("planta") || norm.includes("biolog") || norm.includes("celu") || norm.includes("ciencia") || norm.includes("clorof")) {
    if (isProfesor) {
      return banner + `### 📖 Planificación de Clase: La Fotosíntesis
Diseñado para la enseñanza didáctica del proceso de captación de energía de las plantas.

#### ⏱️ Distribución del Tiempo (Clase de 50 minutos)
1. **Inicio Inteligente (10 min):** Plantea la duda: *¿Por qué las plantas no comen, pero aumentan de tamaño e incluso dan frutos deliciosos?* Esto activa sus ideas previas sobre absorción de sustancias.
2. **Explicación Central (25 min):** Detalla las dos fases clave:
   - **Fase Luminosa:** Se da en los **tilacoides** (monedas en los cloroplastos). Captura luz, descompone la molécula de agua ($H_2O$) expulsando Oxígeno ($O_2$) y acumulando ATP.
   - **Fase Oscura (Ciclo de Calvin):** Se da en el **estroma** (fluido interno). Usa el Dióxido de Carbono ($CO_2$) recolectado del aire y la energía ATP para sintetizar fructosa/glucosa ($C_6H_{12}O_6$).
3. **Puntos Prácticos (15 min):** Reto en el cuaderno digital. Que los alumnos esquematicen la fórmula química en un diagrama conceptual limpio y la compartan.

#### 🧪 Reacción Química General:
\`\`\`
6 CO₂ (Dióxido de Carbono) + 6 H₂O (Agua) + Luz Solar ───> C₆H₁₂O₆ (Glucosa) + 6 O₂ (Oxígeno)
\`\`\`

#### ✏️ Cuestionario Diagnóstico Sugerido:
- ¿Qué orgánulo celular lleva a cabo la fotosíntesis? *(Respuesta: El Cloroplasto)*
- ¿Cuál es la materia prima que aporta los electrones para liberar Oxígeno molecular? *(Respuesta: El Agua)*` + footer;
    } else {
      return banner + `### 🌿 Guía de Estudio Rápido: La Fotosíntesis paso a paso
La **fotosíntesis** es la maravillosa receta natural que realizan las plantas para crear su alimento (azúcar) usando los rayos de sol, el agua de la tierra y el aire.

#### 1. Las Dos Fases Fundamentales:
- **Fase Luminosa (El día de producción):**
  - Ocurre en unos saquitos verdes llamados **tilacoides** de los cloroplastos.
  - La clorofila (el tinte verde de las hojas) captura la luz del sol, toma agua ($H_2O$) por la raíz, rompe esa agua y ¡libera el **Oxígeno ($O_2$)** al aire para que respiremos!
- **Fase Oscura o Ciclo de Calvin (La fase de ensamble):**
  - Ocurre en el fluido interno llamado **estroma**.
  - No necesita luz solar directa. Une el Dióxido de Carbono ($CO_2$) del aire usando la energía del paso anterior para moldear **Glucosa** (su comida y energía estructural).

#### 📊 Ecuación para tus notas:
\`\`\`
Dióxido de Carbono + Agua + Energía Solar ───> Glucosa + Oxígeno
\`\`\`

#### 🧠 ¿Quieres evaluarte ahora? Responde mentalmente:
*¿Qué pasaría con las plantas si bloqueáramos las raíces y no pudieran absorber agua? ¿Qué fase fallará primero?* (Pista: La fase luminosa ya no podrá liberar Oxígeno!)` + footer;
    }
  }

  // 3. Matemáticas / Álgebra
  if (norm.includes("mate") || norm.includes("ecuac") || norm.includes("resolv") || norm.includes("algebra") || norm.includes("sumar") || norm.includes("restar") || norm.includes("multipli") || norm.includes("divi") || norm.includes("calcul") || norm.includes("limit") || norm.includes("deriv") || norm.includes("integ")) {
    if (isProfesor) {
      return banner + `### 📊 Estructura de Clase: Ecuaciones de 1er Grado
Metodología interactiva para introducir el despeje elemental de incógnitas.

#### 🎯 Metodología Didáctica del "Equilibrio"
Presenta la ecuación como una **balanza perfecta de dos platos**. Si agregas, quitas, multiplicas o divides un término en un plato, tienes que hacer exactamente lo mismo en el otro plato para que se mantenga el equilibrio.

#### 📝 Ejemplo para clase paso a paso:
**Resolver: $3x + 12 = 27$**
- **Paso 1 (Mover la constante numérica):** Restamos $12$ a ambos miembros para equilibrar.
  \`\`\`
  3x + 12 - 12 = 27 - 12
  3x = 15
  \`\`\`
- **Paso 2 (Despejar x):** Dividimos entre $3$ ambos miembros.
  \`\`\`
  3x / 3 = 15 / 3
  x = 5
  \`\`\`

#### ✏️ Ejercicios para Asignar hoy:
1. $4x - 9 = 15 \quad (Solución: x = 6)$
2. $2x + 7 = 3x - 1 \quad (Solución: x = 8)$` + footer;
    } else {
      return banner + `### 📐 Guía de Estudio: ¡Cómo resolver Ecuaciones!
Una **ecuación** es una balanza perfecta. El signo **igual ($=$)** separa la balanza en dos lados. Tu misión es dejar a la letra **$x$** solita para revelar su número misterioso.

#### 🔑 Reglas básicas para despejar:
Para dejar sola a la $x$, cruza los otros números de bando aplicando su **operación opuesta**:
- Si un número está **sumando ($+$)**, cruza al otro lado **restando ($-$)**.
- Si está **restando ($-$)**, cruza **sumando ($+$)**.
- Si está **multiplicando** (como el $3$ en $3x$), cruza **dividiendo ($\div$)**.

---

#### 🔍 Hagamos un ejercicio juntos paso a paso:
Consigamos el valor secreto de:
\`\`\`
2x + 10 = 22
\`\`\`

1. **Paso 1:** El $+10$ se cruza de bando restándole al $22$:
   \`\`\`
   2x = 22 - 10
   2x = 12
   \`\`\`
2. **Paso 2:** El $2$ que multiplicaba a la $x$ pasa dividiendo al $12$:
   \`\`\`
   x = 12 / 2
   x = 6
   \`\`\`
3. **¡Comprobación!** Sustituyemos $6$ por la $x$: $2(6) + 10 = 12 + 10 = 22$. ¡Es correcto!

#### 📝 Ponte a prueba:
*Resuelve en tu cuaderno: $4x - 5 = 11$. ¿Cuánto vale x? (Pista: Pasa el $-5$ sumando primero, y luego divide entre $4$).*` + footer;
    }
  }

  // 4. Historia
  if (norm.includes("historia") || norm.includes("imperio") || norm.includes("guerra") || norm.includes("colón") || norm.includes("revoluc") || norm.includes("independe") || norm.includes("edad media") || norm.includes("romano")) {
    if (isProfesor) {
      return banner + `### 📜 Esquema Metodológico: Análisis de Procesos Históricos
Estrategia instruccional para educar en la interpretación del tiempo y el cambio social.

#### 1. Enfoques Clave de Análisis
- **Causalidad Múltiple:** Separar causas coyunturales o detonantes de las estructurales (sociales, de largo plazo).
- **Testimonios Históricos:** Invitar a contrastar fuentes primarias (cartas, documentos de la época) con las fuentes secundarias modernas.

#### 2. Dinámica de Grupo Sugerida: "La Máquina del Tiempo"
Pídeles a tus estudiantes que redacten en su cuaderno una carta ficticia como si estuvieran viviendo en un día clave del periodo tratado (por ejemplo, el inicio del comercio en rutas de seda, o el fin de una contienda), explicando el ambiente diario.

#### 3. Criterios de Evaluación recomendados:
- Ubicación espacial y temporal correcta.
- Reconocimiento de los personajes clave y los intereses de su bando.` + footer;
    } else {
      return banner + `### 🗺️ Guía de Estudio: Análisis de Procesos Históricos
¡Analizar historia es como armar un rompecabezas de decisiones del pasado! No tienes que memorizar todas las fechas, sino buscar el **porqué** se dieron las cosas.

#### 💡 Fórmula del Éxito Histórico:
1. **Antecedentes (La chispa previa):** ¿Cuáles eran las injusticias, necesidades o tensiones que ya existían?
2. **Hitos clave (La acción):** Los levantamientos, descubrimientos, guerras o tratados principales.
3. **Legado actual (¿Cómo nos afecta hoy?):** Las leyes actuales, el idioma que hablamos o la composición social de nuestro país.

*Intenta imaginar los hechos históricos como las consecuencias de grandes decisiones de personas iguales a nosotros. Cuéntame sobre qué periodo de historia estudias hoy y organizaremos sus causas de inmediato.*` + footer;
    }
  }

  // 5. Física / Newton
  if (norm.includes("fisi") || norm.includes("fuerza") || norm.includes("graved") || norm.includes("velocid") || norm.includes("aceler") || norm.includes("newton") || norm.includes("relativid")) {
    if (isProfesor) {
      return banner + `### ⚙️ Guía de Laboratorio Teórico: Las Leyes de Newton
Plan de clase para la conceptualización empírica de fuerzas mecánicas.

#### 🧠 Dinámica Instruccional
- **1ra Ley (Inercia):** Todo cuerpo resiste el cambio en su estado de movimiento. *(Explicar con el ejemplo del pasajero en un coche que frena).*
- **2da Ley ($F = m \\cdot a$):** La fuerza ejercida es proporcional a la interacción de masa y aceleración alcanzada.
- **3ra Ley (Acción y Reacción):** Fuerzas que actúan simétricamente en sentidos contrarios. *(Explicar usando el despegue de fuegos artificiales).*

#### 🧪 Ejercicio Práctico de Aula:
Pide a tus alumnos que apliquen $F = m \\cdot a$ para calcular cuál será la fuerza necesaria para acelerar una caja de $15\\text{ kg}$ a $3\\text{ m/s}^2$. *(Respuesta: $45\\text{ N}$)*.` + footer;
    } else {
      return banner + `### 🚀 Guía de Combate: Las Tres Leyes de Newton
Newton descubrió las reglas de oro que explican por qué se mueven las cosas en el universo entero. ¡Son súper sencillas!

#### 1️⃣ Primera Ley: Inercia 🛋️
- **Qué dice:** Los objetos son muy perezosos. Si algo está quieto no se moverá a menos que lo empujes, y si se está moviendo a velocidad constante no se detendrá a menos que haya rozamiento (del aire o suelo) que lo pare.
- **Ejemplo diario:** Si viajas parado en un camión y el chofer acelera, sientes un empujón hacia atrás porque tu cuerpo quiere seguir quieto.

#### 2️⃣ Segunda Ley: Fuerza ($F = masa \\cdot aceleración$) ⚽
- **Qué dice:** Para acelerar un objeto pesado necesitas mucha más fuerza que para uno liviano.
- **Ejemplo diario:** Puedes lanzar un balón de fútbol de rincón a rincón de un parque, pero no una piedra del tamaño de tu cabeza con la misma velocidad.

#### 3️⃣ Tercera Ley: Acción y Reacción 🛹
- **Qué dice:** Toda acción tiene una reacción idéntica en sentido opuesto. Si empujas, te empujan.
- **Ejemplo diario:** Al saltar desde tu patineta hacia enfrente, la patineta sale impulsada con la misma fuerza hacia atrás.` + footer;
    }
  }

  // 6. Default Fallback
  if (isProfesor) {
    return banner + `### 📋 Propuesta de Planeación y Guía para: **"${query}"**
Un recurso inmediato para el diseño de tu cátedra de **${contextSubject}**:

#### 1. Introducción al Concepto
Presentar de forma accesible la noción técnica detrás del término **"${query}"**. Utiliza ejemplos cotidianos aplicados a la materia de **${contextSubject}** para enganchar la atención de tus alumnos en los primeros 5 minutos del período.

#### 2. Objetivos e Ideas para el Cuaderno de Actividades
- **Lectura e Hipótesis:** Que los alumnos planteen una hipótesis de 2 renglones sobre cómo se comporta este concepto en el mundo real.
- **Caso Guiado en Parejas:** Formular un problema que incorpore este término para que lo resuelvan colectivamente en el cuaderno.

#### 3. Formato de Consolidación
Cierra estimulando la metacognición del estudiante: invítalos a escribir qué duda les quedó pendiente de resolver sobre el tema.` + footer;
  } else {
    return banner + `### 📗 Guía Temática: Aprendiendo sobre **"${query}"**
He preparado un desglose didáctico sobre **"${query}"** para tu materia de **${contextSubject}**:

#### 1️⃣ Concepto de Base:
Este tema forma parte fundamental de **${contextSubject}**. Su estudio profundiza en cómo ciertos elementos se relacionan de forma sistemática para generar conclusiones o resolver problemas numéricos, científicos o históricos específicos.

#### 2️⃣ ¿Cómo entender este tema fácil?
- **Paso A:** Busca siempre una analogía con cosas que ya conozcas.
- **Paso B:** Diferencia los datos/hechos principales de los secundarios.
- **Paso C:** Intenta crear un esquema visual o un resumen corto de 3 líneas en tus apuntes con tus propias palabras para fijar la memoria de largo plazo.

**¿Qué aspecto de este tema te gustaría investigar detalladamente? Escríbeme tu respuesta o coméntame tu duda actual para trabajarla.**` + footer;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for chatbot
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, userRole, subject, className } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "El historial de mensajes es obligatorio." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Clave de API no configurada. Añádela en la pestaña Secrets de la aplicación." 
        });
      }

      // Initialize Google GenAI on server side
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Contextual system instruction
      const systemInstruction = `Eres "Bien", un asistente inteligente de aprendizaje integrado en el ecosistema "Mi Cuaderno Digital".
Estás interactuando con un usuario que tiene el rol de: "${userRole || 'Estudiante'}".
Si el usuario seleccionó una clase o materia específica, es: "${subject || className || 'General'}".

Instrucciones de comportamiento:
1. Tu tono debe ser cálido, inteligente, motivador y sumamente claro.
2. Explica conceptos paso a paso con un formato markdown elegante (utiliza negrita, viñetas y bloques de código de forma prudente).
3. Adapta tus explicaciones al rol del usuario:
   - Si es Alumno: sé un tutor paciente que desglosa temas complejos, anima a resolver problemas y ofrece ejemplos prácticos para estudiar y prepararse.
   - Si es Profesor: sé un asistente metodológico que ayuda a estructurar lecciones, diseñar rúbricas, formular preguntas de examen o planificar actividades creativas.
4. Siempre responde en español.
5. Invita al usuario a profundizar o practicar con preguntas de seguimiento.`;

      // Filter and map message history to form a valid, strictly alternating conversation starting with 'user'
      const formattedContents: any[] = [];
      let currentRole: "user" | "model" | null = null;
      let currentContent: any = null;

      for (const m of messages) {
        const role = m.role === "assistant" ? "model" : "user";
        if (!m.content || typeof m.content !== "string" || !m.content.trim()) {
          continue;
        }

        if (formattedContents.length === 0) {
          // The history must start with "user"
          if (role !== "user") {
            continue; // Skip prepended assistant greetings or context alerts
          }
          currentContent = {
            role: "user",
            parts: [{ text: m.content }]
          };
          formattedContents.push(currentContent);
          currentRole = "user";
        } else {
          if (role === currentRole) {
            // Merge adjacent messages with the same role
            currentContent.parts[0].text += "\n" + m.content;
          } else {
            currentContent = {
              role: role,
              parts: [{ text: m.content }]
            };
            formattedContents.push(currentContent);
            currentRole = role;
          }
        }
      }

      // Fallback: if we filtered out all messages, provide a basic user greeting
      if (formattedContents.length === 0) {
        const lastMsg = messages[messages.length - 1];
        formattedContents.push({
          role: "user",
          parts: [{ text: lastMsg && lastMsg.content ? lastMsg.content : "Hola" }]
        });
      }

      // Helper function to handle automatic retries for transient 503 / "high demand" errors gracefully
      const generateWithRetry = async (aiInstance: any, params: any, maxRetries = 3, initialDelay = 1000) => {
        let attempt = 0;
        while (attempt < maxRetries) {
          try {
            return await aiInstance.models.generateContent(params);
          } catch (err: any) {
            attempt++;
            const errorMessage = String(err.message || err);
            const isTransient = errorMessage.includes("503") || 
                                errorMessage.includes("demand") || 
                                errorMessage.includes("temporary") || 
                                errorMessage.includes("UNAVAILABLE") || 
                                errorMessage.includes("rate limit") || 
                                errorMessage.includes("429");

            if (!isTransient || attempt >= maxRetries) {
              throw err;
            }

            const delay = initialDelay * Math.pow(2, attempt - 1);
            console.warn(`[Gemini Proxy Attempt ${attempt}/${maxRetries} failed: ${errorMessage}]. Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      };

      // Generate content with nested try-catches to achieve maximum resiliency
      let response;
      try {
        response = await generateWithRetry(ai, {
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          }
        });
      } catch (firstErr: any) {
        console.warn("[Gemini API Warning] gemini-3.5-flash failed or hit rate limits:", firstErr.message || firstErr);
        const firstErrMsg = String(firstErr.message || firstErr);
        const isQuotaErr = firstErrMsg.includes("429") || 
                           firstErrMsg.toLowerCase().includes("quota") || 
                           firstErrMsg.includes("RESOURCE_EXHAUSTED");

        try {
          console.log("[Gemini API Fallback] Attempting secondary model gemini-3.1-flash-lite...");
          response = await generateWithRetry(ai, {
            model: "gemini-3.1-flash-lite",
            contents: formattedContents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });
        } catch (secondErr: any) {
          console.error("[Gemini API Error] Both gemini-3.5-flash and gemini-3.1-flash-lite failed!");
          
          const secondErrMsg = String(secondErr.message || secondErr);
          const isQuota = isQuotaErr || 
                          secondErrMsg.includes("429") || 
                          secondErrMsg.toLowerCase().includes("quota") || 
                          secondErrMsg.includes("RESOURCE_EXHAUSTED");

          const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
          const queryText = lastUserMsg && lastUserMsg.content ? lastUserMsg.content : "Hola";

          const fallbackText = getLocalTutorResponse(queryText, userRole || "alumno", subject || className || "General", isQuota);
          return res.json({ text: fallbackText });
        }
      }

      const replyText = response && response.text ? response.text : "Lo siento, no pude procesar tu solicitud en este momento.";
      res.json({ text: replyText });
    } catch (outerError: any) {
      console.error("Critical error in chat route handler:", outerError);
      // Even if something completely outside the API calls throws, keep the experience smooth and return local fallback tutor
      const lastUserMsg = [...req.body.messages].reverse().find((m: any) => m.role === "user");
      const queryText = lastUserMsg && lastUserMsg.content ? lastUserMsg.content : "Hola";
      const fallbackText = getLocalTutorResponse(queryText, req.body.userRole || "alumno", req.body.subject || req.body.className || "General", false);
      res.json({ text: fallbackText });
    }
  });

  // Serve static UI assets using Vite middleware or production built files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
