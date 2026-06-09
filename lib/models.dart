class UserProfile {
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
      parsedTasks.add(Task.fromMap(Map<String, dynamic>.from(rawTasks[i]), 'task-$i'));
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
