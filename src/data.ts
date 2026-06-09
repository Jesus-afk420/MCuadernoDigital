import { ClassItem } from "./types";

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "math-diff",
    name: "Cálculo Diferencial",
    subject: "MATEMÁTICAS",
    code: "MATH42",
    teacherName: "Roberto Méndez",
    studentCount: 12,
    tasks: [
      {
        id: "task-1",
        title: "Ejercicios de Límites y Continuidad",
        dueDate: "2026-06-15",
        submitted: false,
        score: null
      }
    ]
  },
  {
    id: "hist-cont",
    name: "Historia Contemporánea",
    subject: "HISTORIA",
    code: "HIST82",
    teacherName: "Elena Vargas",
    studentCount: 8,
    tasks: [
      {
        id: "task-2",
        title: "Resumen de la Segunda Guerra Mundial",
        dueDate: "2026-06-10",
        submitted: true,
        score: 95
      }
    ]
  },
  {
    id: "bio-gen",
    name: "Biología General",
    subject: "BIOLOGÍA",
    code: "BIO258",
    teacherName: "prueba profe",
    studentCount: 2,
    tasks: [
      {
        id: "task-3",
        title: "Modelar el Ciclo de Krebs",
        dueDate: "2026-06-12",
        submitted: false,
        score: null
      }
    ]
  }
];

export const SUGGESTED_CHIPS = [
  { text: "¿Qué es la fotosíntesis?", icon: "sprout" },
  { text: "Explica el teorema de Pitágoras", icon: "triangle" },
  { text: "¿Cuándo fue la Revolución Francesa?", icon: "scroll" }
];
