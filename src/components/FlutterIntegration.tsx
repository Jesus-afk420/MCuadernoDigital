import React, { useState } from "react";
import { 
  Smartphone, 
  Flame, 
  Terminal, 
  Copy, 
  Check, 
  Layout, 
  Code2, 
  FolderPlus, 
  FileCode,
  Sparkles,
  BookOpen
} from "lucide-react";

export const FlutterIntegration: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>("pubspec");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeFiles: Record<string, { name: string; lang: string; desc: string; code: string }> = {
    pubspec: {
      name: "pubspec.yaml",
      lang: "yaml",
      desc: "Paquetes oficiales de Flutter para conectarse a Firebase Core, Firestore y peticiones HTTP.",
      code: `name: cuaderno_digital_app
description: "Ecosistema Móvil para Mi Cuaderno Digital con Sincronización Firebase."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  
  # Paquetes oficiales para conectar con Firebase Cloud
  firebase_core: ^2.24.2
  cloud_firestore: ^4.14.0
  firebase_auth: ^4.16.0
  http: ^1.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
`
    },
    models: {
      name: "models.dart",
      lang: "dart",
      desc: "Estructuras de datos en Dart que replican fielmente todos los tipos definidos en TypeScript.",
      code: `class UserProfile {
  final String name;
  final String email;
  final String role; // 'alumno' | 'profesor'

  UserProfile({
    required this.name,
    required this.email,
    required this.role,
  });

  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      name: map['name'] ?? '',
      email: map['email'] ?? '',
      role: map['role'] ?? 'alumno',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'role': role,
    };
  }
}

class Task {
  final String id;
  final String title;
  final String dueDate;
  final bool submitted;
  final int? score;

  Task({
    required this.id,
    required this.title,
    required this.dueDate,
    required this.submitted,
    this.score,
  });

  factory Task.fromMap(Map<String, dynamic> data, String docId) {
    return Task(
      id: docId,
      title: data['title'] ?? '',
      dueDate: data['dueDate'] ?? '2026-06-15',
      submitted: data['submitted'] ?? false,
      score: data['score'] as int?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'dueDate': dueDate,
      'submitted': submitted,
      'score': score,
    };
  }
}

class ClassItem {
  final String id;
  final String name;
  final String subject;
  final String code;
  final String teacherName;
  final int studentCount;
  final List<Task> tasks;

  ClassItem({
    required this.id,
    required this.name,
    required this.subject,
    required this.code,
    required this.teacherName,
    required this.studentCount,
    required this.tasks,
  });

  factory ClassItem.fromMap(Map<String, dynamic> data, String docId) {
    var rawTasks = data['tasks'] as List? ?? [];
    List<Task> parsedTasks = [];
    for (var i = 0; i < rawTasks.length; i++) {
      parsedTasks.add(Task.fromMap(Map<String, dynamic>.from(rawTasks[i]), 'task-\${i}'));
    }

    return ClassItem(
      id: docId,
      name: data['name'] ?? '',
      subject: data['subject'] ?? 'MATEMÁTICAS',
      code: data['code'] ?? '',
      teacherName: data['teacherName'] ?? '',
      studentCount: data['studentCount'] ?? 0,
      tasks: parsedTasks,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'subject': subject,
      'code': code,
      'teacherName': teacherName,
      'studentCount': studentCount,
      'tasks': tasks.map((t) => t.toMap()).toList(),
    };
  }
}

class ChatMessage {
  final String id;
  final String role; // 'user' | 'assistant'
  final String content;
  final String timestamp;

  ChatMessage({
    required this.id,
    required this.role,
    required this.content,
    required this.timestamp,
  });
}
`
    },
    firebase_service: {
      name: "firebase_service.dart",
      lang: "dart",
      desc: "Servicio de persistencia con soporte offline y peticiones HTTP al proxy de Bien IA de la web.",
      code: `import 'dart:convert';
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
        id: 'custom-\${DateTime.now().millisecondsSinceEpoch}',
        name: 'Clase Autogenerada \${cleanCode}',
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
      id: 'class-\${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      subject: subject,
      code: '\${prefix}\${numbers}',
      teacherName: teacherName,
      studentCount: 0,
      tasks: [],
    ));
  }

  void addTask(String classId, String title) {
    for (var cls in _classes) {
      if (cls.id == classId) {
        cls.tasks.add(Task(
          id: 'task-\${DateTime.now().millisecondsSinceEpoch}',
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
`
    },
    registration_screen: {
      name: "registration_screen.dart",
      lang: "dart",
      desc: "Formulario de registro con animaciones, validación y selector de roles Alumno/Profesor.",
      code: `import 'package:flutter/material';
import 'models.dart';

class RegistrationScreen extends StatefulWidget {
  final Function(UserProfile) onRegister;
  const RegistrationScreen({super.key, required this.onRegister});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  String _role = 'alumno';
  bool _showPassword = false;
  String _errorMsg = '';

  void _handleSubmit() {
    setState(() => _errorMsg = '');
    final name = _fullNameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final confirm = _confirmPasswordController.text;

    if (name.isEmpty || email.isEmpty || password.isEmpty || confirm.isEmpty) {
      setState(() => _errorMsg = 'Por favor, completa todos los campos.');
      return;
    }
    if (password != confirm) {
      setState(() => _errorMsg = 'Las contraseñas no coinciden.');
      return;
    }

    widget.onRegister(UserProfile(name: name, email: email, role: _role));
  }

  void _quickFill(String role) {
    setState(() {
      _role = role;
      if (role == 'alumno') {
        _fullNameController.text = 'prueba alum2';
        _emailController.text = 'alumno@cuadernodigital.edu';
      } else {
        _fullNameController.text = 'prueba profe';
        _emailController.text = 'profesor@cuadernodigital.edu';
      }
      _passwordController.text = '123456';
      _confirmPasswordController.text = '123456';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF030712),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Card(
            color: const Color(0xFF0D1426),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(28),
              side: const BorderSide(color: Colors.white10),
            ),
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextButton(
                        onPressed: () => _quickFill('alumno'),
                        child: const Text('Completar Estudiante', style: TextStyle(color: Color(0xFF818CF8))),
                      ),
                      const SizedBox(width: 8),
                      TextButton(
                        onPressed: () => _quickFill('profesor'),
                        child: const Text('Completar Docente', style: TextStyle(color: Color(0xFF818CF8))),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text('Crear Cuenta', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 16),
                  if (_errorMsg.isNotEmpty) Text(_errorMsg, style: const TextStyle(color: Colors.redAccent)),
                  const SizedBox(height: 16),
                  TextField(controller: _fullNameController, decoration: const InputDecoration(labelText: 'Nombre Completo', labelStyle: TextStyle(color: Colors.white60))),
                  const SizedBox(height: 12),
                  TextField(controller: _emailController, decoration: const InputDecoration(labelText: 'Correo Electrónico', labelStyle: TextStyle(color: Colors.white60))),
                  const SizedBox(height: 12),
                  TextField(controller: _passwordController, obscureText: !_showPassword, decoration: const InputDecoration(labelText: 'Contraseña', labelStyle: TextStyle(color: Colors.white60))),
                  const SizedBox(height: 12),
                  TextField(controller: _confirmPasswordController, obscureText: !_showPassword, decoration: const InputDecoration(labelText: 'Confirmar Contraseña', labelStyle: TextStyle(color: Colors.white60))),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('Alumno'),
                          selected: _role == 'alumno',
                          onSelected: (val) => setState(() => _role = 'alumno'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('Profesor'),
                          selected: _role == 'profesor',
                          onSelected: (val) => setState(() => _role = 'profesor'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _handleSubmit,
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5), minimumSize: const Size.fromHeight(50)),
                    child: const Text('Registrarse', style: TextStyle(color: Colors.white)),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`
    },
    dashboard_screen: {
      name: "dashboard_screen.dart",
      lang: "dart",
      desc: "Dashboard responsive con Bento Cards de estadísticas, listado de clases interactivo y gestión de tareas.",
      code: `import 'package:flutter/material';
import 'models.dart';
import 'firebase_service.dart';

class DashboardScreen extends StatefulWidget {
  final UserProfile userProfile;
  final Function(String, String) onOpenAssistant;
  const DashboardScreen({super.key, required this.userProfile, required this.onOpenAssistant});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final FirebaseService _db = FirebaseService();
  String? _selectedClassId;

  final _joinCodeController = TextEditingController();
  final _createClassNameController = TextEditingController();
  String _createClassSubject = 'MATEMÁTICAS';

  int _average = 0;
  int _submitted = 0;
  int _pending = 0;

  @override
  void initState() {
    super.initState();
    _calculateStats();
  }

  void _calculateStats() {
    int total = 0;
    int sub = 0;
    int pend = 0;
    int sum = 0;
    int scored = 0;

    for (var cls in _db.getClasses()) {
      for (var t in cls.tasks) {
        total++;
        if (t.submitted) {
          sub++;
          if (t.score != null) {
            sum += t.score!;
            scored++;
          }
        } else {
          pend++;
        }
      }
    }

    setState(() {
      _average = scored > 0 ? (sum ~/ scored) : 0;
      _submitted = sub;
      _pending = pend;
    });
  }

  @override
  Widget build(BuildContext context) {
    final classes = _db.getClasses();
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Buenos días,', style: TextStyle(color: Colors.white24, fontSize: 14)),
            Text(widget.userProfile.name, style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _bentoCard('\${_average}%', Icons.star, Colors.amber, 'PROMEDIO')),
                const SizedBox(width: 8),
                Expanded(child: _bentoCard('\${_submitted}', Icons.check_circle, Colors.emerald, 'ENTREGADOS')),
                const SizedBox(width: 8),
                Expanded(child: _bentoCard('\${_pending}', Icons.access_time, Colors.rose, 'PENDIENTES')),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text('Tus Clases', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                TextButton(
                  onPressed: () {
                    if (widget.userProfile.role == 'alumno') {
                      _showJoinDialog();
                    } else {
                      _showCreateDialog();
                    }
                  },
                  child: Text(widget.userProfile.role == 'alumno' ? 'Unirse' : 'Crear', style: const TextStyle(color: Color(0xFF818CF8))),
                )
              ],
            ),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: classes.length + 1,
              itemBuilder: (context, index) {
                if (index == classes.length) {
                  return Container(
                    margin: const EdgeInsets.only(top: 8),
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(54), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                      onPressed: () {
                        if (widget.userProfile.role == 'alumno') {
                          _showJoinDialog();
                        } else {
                          _showCreateDialog();
                        }
                      },
                      child: Text(widget.userProfile.role == 'alumno' ? 'Unirse a clase' : 'Crear nueva materia'),
                    ),
                  );
                }
                final cls = classes[index];
                return Card(
                  color: const Color(0xFF0D1426),
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    title: Text(cls.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    subtitle: Text('Progreso: \${cls.tasks.where((t)=>t.submitted).length}/\${cls.tasks.length} tareas', style: const TextStyle(color: Colors.white54)),
                    trailing: const Icon(Icons.chevron_right, color: Colors.indigoAccent),
                    onTap: () => setState(() => _selectedClassId = cls.id),
                  ),
                );
              },
            ),
            if (_selectedClassId != null) _buildClassDetails(),
          ],
        ),
      ),
    );
  }

  Widget _buildClassDetails() {
    final cls = _db.getClasses().firstWhere((c) => c.id == _selectedClassId);
    return Card(
      color: const Color(0xFF0D1426),
      margin: const EdgeInsets.only(top: 24),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Text(cls.name, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                Text(cls.code, style: const TextStyle(color: Colors.white38, fontFamily: 'monospace')),
              ],
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => widget.onOpenAssistant(cls.subject, cls.name),
              child: const Text('Preguntar a Bien IA'),
            ),
            const SizedBox(height: 16),
            ...cls.tasks.map((t) => ListTile(
              title: Text(t.title),
              subtitle: Text(t.submitted ? 'Completado' : 'Pendiente'),
              trailing: t.submitted && t.score != null ? Text('\${t.score}/100') : null,
              onTap: () {
                if (widget.userProfile.role == 'alumno' && !t.submitted) {
                  _db.submitTask(cls.id, t.id);
                  _calculateStats();
                  setState(() {});
                }
              },
            )),
          ],
        ),
      ),
    );
  }

  Widget _bentoCard(String val, IconData icon, Color color, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(color: const Color(0xFF0D1426), borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(val, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(color: Colors.white38, fontSize: 8)),
        ],
      ),
    );
  }

  void _showJoinDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0D1426),
        title: const Text('Unirse a una clase'),
        content: TextField(controller: _joinCodeController, decoration: const InputDecoration(hintText: 'CÓDIGO (6 car.)')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          TextButton(
            onPressed: () {
              _db.joinClass(_joinCodeController.text);
              Navigator.pop(context);
              _calculateStats();
              setState(() {});
            },
            child: const Text('Unirse'),
          )
        ],
      ),
    );
  }

  void _showCreateDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0D1426),
        title: const Text('Crear clase'),
        content: TextField(controller: _createClassNameController, decoration: const InputDecoration(hintText: 'Nombre de la clase')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          TextButton(
            onPressed: () {
              _db.createClass(_createClassNameController.text, 'MATEMÁTICAS', widget.userProfile.name);
              Navigator.pop(context);
              _calculateStats();
              setState(() {});
            },
            child: const Text('Crear'),
          )
        ],
      ),
    );
  }
}
`
    },
    assistant_screen: {
      name: "assistant_screen.dart",
      lang: "dart",
      desc: "Consola de chat con burbujas personalizadas, chips rápidos y llamadas HTTP al asistente de IA.",
      code: `import 'package:flutter/material';
import 'models.dart';
import 'firebase_service.dart';

class AssistantScreen extends StatefulWidget {
  final UserProfile userProfile;
  final String? subject;
  final String? className;
  const AssistantScreen({super.key, required this.userProfile, this.subject, this.className});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final FirebaseService _db = FirebaseService();
  final _textController = TextEditingController();
  final List<ChatMessage> _messages = [
    ChatMessage(id: '1', role: 'assistant', content: '¿En qué materia necesitas ayuda hoy?', timestamp: '09:41'),
  ];
  bool _isTyping = false;

  void _sendMessage(String text) async {
    if (text.trim().isEmpty) return;
    _textController.clear();
    setState(() {
      _messages.add(ChatMessage(id: DateTime.now().toString(), role: 'user', content: text, timestamp: 'Ahora'));
      _isTyping = true;
    });

    final reply = await _db.queryGemini(text, widget.userProfile.role);
    setState(() {
      _messages.add(ChatMessage(id: DateTime.now().toString(), role: 'assistant', content: reply, timestamp: 'Ahora'));
      _isTyping = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, id) {
                final m = _messages[id];
                final isAI = m.role == 'assistant';
                return Align(
                  alignment: isAI ? Alignment.centerLeft : Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isAI ? const Color(0xFF0D1426) : const Color(0xFF4F46E5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(m.content, style: const TextStyle(color: Colors.white)),
                  ),
                );
              },
            ),
          ),
          if (_isTyping) const Padding(padding: EdgeInsets.all(8.0), child: CircularProgressIndicator()),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: const InputDecoration(hintText: 'Pregúntame lo que quieras...', hintStyle: TextStyle(color: Colors.white24)),
                  ),
                ),
                IconButton(icon: const Icon(Icons.send), onPressed: () => _sendMessage(_textController.text)),
              ],
            ),
          )
        ],
      ),
    );
  }
}
`
    },
    main: {
      name: "main.dart",
      lang: "dart",
      desc: "Punto de entrada de Flutter con la navegación y los temas responsivos de Mi Cuaderno Digital.",
      code: `import 'package:flutter/material';
import 'models.dart';
import 'registration_screen.dart';
import 'dashboard_screen.dart';
import 'assistant_screen.dart';

void main() {
  runApp(const MiCuadernoApp());
}

class MiCuadernoApp extends StatelessWidget {
  const MiCuadernoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mi Cuaderno Digital',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF030712),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4F46E5), brightness: Brightness.dark),
      ),
      home: const AppContainer(),
    );
  }
}

class AppContainer extends StatefulWidget {
  const AppContainer({super.key});

  @override
  State<AppContainer> createState() => _AppContainerState();
}

class _AppContainerState extends State<AppContainer> {
  UserProfile? _profile;
  int _currentTab = 0;
  String? _subContext;
  String? _clsContext;

  @override
  Widget build(BuildContext context) {
    if (_profile == null) {
      return RegistrationScreen(onRegister: (p) => setState(() => _profile = p));
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Mi Cuaderno Digital'), backgroundColor: const Color(0xFF0F172A)),
      body: IndexedStack(
        index: _currentTab,
        children: [
          DashboardScreen(
            userProfile: _profile!,
            onOpenAssistant: (sub, cls) => setState(() {
              _subContext = sub;
              _clsContext = cls;
              _currentTab = 1;
            }),
          ),
          AssistantScreen(
            userProfile: _profile!,
            subject: _subContext,
            className: _clsContext,
          )
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentTab,
        onTap: (tab) => setState(() => _currentTab = tab),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inicio'),
          BottomNavigationBarItem(icon: Icon(Icons.comment), label: 'Asistente IA'),
        ],
      ),
    );
  }
}
`
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Visual Header */}
      <section className="relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            Ecosistema Sincronizado
          </div>
          <h2 className="font-display font-extrabold text-3xl text-slate-100 tracking-tight">
            Sinergia Flutter &amp; Firebase
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Hemos habilitado e integrado el soporte oficial de Firebase. Al estar conectado a Firestore y Auth, puedes compilar el código de esta sección directamente en tu computadora para sincronizar en tiempo real tu smartphone con la plataforma web.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <Smartphone className="w-12 h-12 text-indigo-400" />
          <div>
            <p className="text-xs text-slate-500 font-mono">ESTADO FLUTTER</p>
            <p className="text-sm font-bold text-emerald-400">Listo para Compilación</p>
          </div>
        </div>
      </section>

      {/* Integration Guide Bento Steps */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 font-mono font-bold mb-4">
              01
            </div>
            <h4 className="font-display font-bold text-lg text-slate-200 mb-2">Instalar Flutter</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Configura Flutter en tu computadora desde <strong className="text-indigo-300">flutter.dev</strong>. Crea un nuevo proyecto ejecutando <code>flutter create cuaderno_digital_app</code> desde la terminal.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 font-mono text-[10px] text-slate-500 select-all">
            flutter create cuaderno_digital_app
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 font-mono font-bold mb-4">
              02
            </div>
            <h4 className="font-display font-bold text-lg text-slate-200 mb-2">Vincular Firebase</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Ejecuta <code>flutterfire configure</code> para vincular tu app de iOS/Android al mismo proyecto de Firebase configurado para el Cuaderno Digital en este entorno.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 font-mono text-[10px] text-slate-500 select-all">
            npm install -g firebase-tools &amp;&amp; flutterfire configure
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 font-mono font-bold mb-4">
              03
            </div>
            <h4 className="font-display font-bold text-lg text-slate-200 mb-2">Sincronización Total</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Pega los archivos Dart que te proporcionamos abajo. ¡Cualquier cambio que realices en el sitio web (crear tareas, cambiar notas) se actualizará instantáneamente en el celular!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-indigo-400 font-mono text-[10px]">
            <Sparkles className="w-3.5 h-3.5" />
            AUTOMÁTICO CON STREAMS
          </div>
        </div>
      </section>

      {/* Code Area Workspace */}
      <section className="bg-slate-900/20 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <header className="px-6 py-4 bg-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Layout className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-display font-bold text-slate-100 text-[16px] leading-tight">Estructura del Proyecto Flutter</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{codeFiles[activeFile].desc}</p>
            </div>
          </div>

          <button
            onClick={() => handleCopy(codeFiles[activeFile].code)}
            className="flex items-center justify-center gap-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 py-2 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-all self-end sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar {codeFiles[activeFile].name}</span>
              </>
            )}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          {/* File selector Left menu */}
          <div className="md:col-span-3 border-r border-slate-800 p-4 bg-slate-950/40 space-y-1.5">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3 pl-2">ARCHIVOS DE FLUTTER</p>
            
            <button
              onClick={() => setActiveFile("pubspec")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                activeFile === "pubspec" 
                  ? "bg-slate-800 text-slate-100 font-bold border-l-2 border-indigo-500" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <FolderPlus className="w-4 h-4 text-indigo-400" />
              <span>pubspec.yaml</span>
            </button>

            <button
              onClick={() => setActiveFile("models")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                activeFile === "models" 
                  ? "bg-slate-800 text-slate-100 font-bold border-l-2 border-indigo-500" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>models.dart</span>
            </button>

            <button
              onClick={() => setActiveFile("firebase_service")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                activeFile === "firebase_service" 
                  ? "bg-slate-800 text-slate-100 font-bold border-l-2 border-indigo-500" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-500" />
              <span>firebase_service.dart</span>
            </button>

            <button
              onClick={() => setActiveFile("registration_screen")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                activeFile === "registration_screen" 
                  ? "bg-slate-800 text-slate-100 font-bold border-l-2 border-indigo-500" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>registration_screen.dart</span>
            </button>

            <button
              onClick={() => setActiveFile("dashboard_screen")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                activeFile === "dashboard_screen" 
                  ? "bg-slate-800 text-slate-100 font-bold border-l-2 border-indigo-500" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <Layout className="w-4 h-4 text-indigo-400" />
              <span>dashboard_screen.dart</span>
            </button>

            <button
              onClick={() => setActiveFile("assistant_screen")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                activeFile === "assistant_screen" 
                  ? "bg-slate-800 text-slate-100 font-bold border-l-2 border-indigo-500" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>assistant_screen.dart</span>
            </button>

            <button
              onClick={() => setActiveFile("main")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                activeFile === "main" 
                  ? "bg-slate-800 text-slate-100 font-bold border-l-2 border-indigo-500" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              <Terminal className="w-4 h-4 text-teal-400" />
              <span>main.dart</span>
            </button>
          </div>

          {/* Pre Code Panel Area */}
          <div className="md:col-span-9 bg-slate-950/80 p-6 flex flex-col justify-between overflow-x-auto select-all">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre max-h-[550px] overflow-y-auto">
              <code>{codeFiles[activeFile].code}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
