import 'dart:convert';
import 'package:http/http.dart' as http;
import 'models.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  final List<ClassItem> _classes = [
    ClassItem(
      id: 'math-diff',
      name: 'Cálculo Diferencial',
      subject: 'MATEMÁTICAS',
      code: 'MATH42',
      teacherName: 'Roberto Méndez',
      studentCount: 12,
      tasks: [
        Task(id: 'task-1', title: 'Ejercicios de Límites y Continuidad', dueDate: '2026-06-15', submitted: false),
      ],
    ),
    ClassItem(
      id: 'hist-cont',
      name: 'Historia Contemporánea',
      subject: 'HISTORIA',
      code: 'HIST82',
      teacherName: 'Elena Vargas',
      studentCount: 8,
      tasks: [
        Task(id: 'task-2', title: 'Resumen de la Segunda Guerra Mundial', dueDate: '2026-06-10', submitted: true, score: 95),
      ],
    ),
    ClassItem(
      id: 'bio-gen',
      name: 'Biología General',
      subject: 'BIOLOGÍA',
      code: 'BIO258',
      teacherName: 'prueba profe',
      studentCount: 2,
      tasks: [
        Task(id: 'task-3', title: 'Modelar el Ciclo de Krebs', dueDate: '2026-06-12', submitted: false),
      ],
    ),
  ];

  List<ClassItem> getClasses() => _classes;

  void submitTask(String classId, String taskId) {
    for (var cls in _classes) {
      if (cls.id == classId) {
        for (var i = 0; i < cls.tasks.length; i++) {
          if (cls.tasks[i].id == taskId) {
            cls.tasks[i] = Task(
              id: cls.tasks[i].id,
              title: cls.tasks[i].title,
              dueDate: cls.tasks[i].dueDate,
              submitted: true,
              score: null,
            );
          }
        }
      }
    }
  }

  void gradeTask(String classId, String taskId, int score) {
    for (var cls in _classes) {
      if (cls.id == classId) {
        for (var i = 0; i < cls.tasks.length; i++) {
          if (cls.tasks[i].id == taskId) {
            cls.tasks[i] = Task(
              id: cls.tasks[i].id,
              title: cls.tasks[i].title,
              dueDate: cls.tasks[i].dueDate,
              submitted: true,
              score: score,
            );
          }
        }
      }
    }
  }

  void joinClass(String code) {
    String cleanCode = code.trim().toUpperCase();
    if (!_classes.any((c) => c.code == cleanCode)) {
      _classes.add(ClassItem(
        id: 'custom-${DateTime.now().millisecondsSinceEpoch}',
        name: 'Clase Autogenerada $cleanCode',
        subject: 'MATEMÁTICAS',
        code: cleanCode,
        teacherName: 'Profesor Virtual',
        studentCount: 1,
        tasks: [
          Task(id: 'task-custom', title: 'Ensayo de Bienvenida', dueDate: '2026-06-20', submitted: false),
        ],
      ));
    }
  }

  void createClass(String name, String subject, String teacherName) {
    String prefix = subject.substring(0, 3).toUpperCase();
    int numbers = 100 + (DateTime.now().millisecondsSinceEpoch % 900);
    _classes.add(ClassItem(
      id: 'class-${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      subject: subject,
      code: '$prefix$numbers',
      teacherName: teacherName,
      studentCount: 0,
      tasks: [],
    ));
  }

  void addTask(String classId, String title) {
    for (var cls in _classes) {
      if (cls.id == classId) {
        cls.tasks.add(Task(
          id: 'task-${DateTime.now().millisecondsSinceEpoch}',
          title: title,
          dueDate: '2026-06-15',
          submitted: false,
        ));
      }
    }
  }

  Future<String> queryGemini(String prompt, String role) async {
    try {
      final response = await http.post(
        Uri.parse('/api/gemini/chat'), 
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'messages': [{'role': 'user', 'content': prompt}],
          'userRole': role,
        }),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['text'] ?? 'Sin respuesta';
      }
    } catch (_) {}
    return 'Hola, soy Bien 🤖. Estoy aquí para ayudarte a resolver tus dudas académicas.';
  }
}
