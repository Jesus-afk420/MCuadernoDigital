import 'package:flutter/material.dart';
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

  int _average = 0;
  int _submitted = 0;
  int _pending = 0;

  @override
  void initState() {
    super.initState();
    _calculateStats();
  }

  void _calculateStats() {
    int sub = 0;
    int pend = 0;
    int sum = 0;
    int scored = 0;

    for (var cls in _db.getClasses()) {
      for (var t in cls.tasks) {
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
            Text(widget.userProfile.name, style: const TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _bentoCard('$_average%', Icons.star, Colors.amber, 'PROMEDIO')),
                const SizedBox(width: 8),
                Expanded(child: _bentoCard('$_submitted', Icons.check_circle, Colors.greenAccent, 'ENTREGADOS')),
                const SizedBox(width: 8),
                Expanded(child: _bentoCard('$_pending', Icons.access_time, const Color(0xFFF43F5E), 'PENDIENTES')),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                  child: Text(widget.userProfile.role == 'alumno' ? '+ Unirse' : '+ Crear', style: const TextStyle(color: Color(0xFF818CF8))),
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
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size.fromHeight(54), 
                        side: const BorderSide(color: Colors.white24),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))
                      ),
                      onPressed: () {
                        if (widget.userProfile.role == 'alumno') {
                          _showJoinDialog();
                        } else {
                          _showCreateDialog();
                        }
                      },
                      child: Text(
                        widget.userProfile.role == 'alumno' ? 'Unirse a clase con código' : 'Crear nueva materia virtual',
                        style: const TextStyle(color: Colors.white70),
                      ),
                    ),
                  );
                }
                final cls = classes[index];
                return Card(
                  color: const Color(0xFF0D1426),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: Colors.white10),
                  ),
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    title: Text(cls.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text('Código: ${cls.code} • Profesor: ${cls.teacherName}', style: const TextStyle(color: Colors.white38, fontSize: 11)),
                        const SizedBox(height: 6),
                        Text('Progreso: ${cls.tasks.where((t)=>t.submitted).length}/${cls.tasks.length} entregas', style: const TextStyle(color: Colors.indigoAccent, fontSize: 12)),
                      ],
                    ),
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
      color: const Color(0xFF0E1A30),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Colors.indigoAccent, width: 1),
      ),
      margin: const EdgeInsets.only(top: 24, bottom: 24),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(cls.name, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color.fromRGBO(129, 140, 248, 0.2), borderRadius: BorderRadius.circular(8)),
                  child: Text(cls.code, style: const TextStyle(color: Color(0xFF818CF8), fontFamily: 'monospace', fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: () => widget.onOpenAssistant(cls.subject, cls.name),
              icon: const Icon(Icons.psychology, color: Colors.white),
              label: const Text('Preguntar a Bien IA sobre esta materia', style: TextStyle(color: Colors.white)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Tareas de la Materia', style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold)),
            const Divider(color: Colors.white10),
            if (cls.tasks.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16.0),
                child: Text('No hay tareas asignadas en esta materia.', style: TextStyle(color: Colors.white38, fontSize: 12)),
              ),
            ...cls.tasks.map((t) => Card(
              color: Colors.transparent,
              elevation: 0,
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(t.title, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
                subtitle: Text('Fecha de entrega: ${t.dueDate}', style: const TextStyle(color: Colors.white38, fontSize: 11)),
                leading: Icon(
                  t.submitted ? Icons.check_circle : Icons.radio_button_unchecked,
                  color: t.submitted ? Colors.greenAccent : Colors.white38,
                ),
                trailing: t.submitted && t.score != null 
                  ? Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(color: const Color.fromRGBO(167, 243, 208, 0.1), borderRadius: BorderRadius.circular(6)),
                      child: Text('Calificación: ${t.score}', style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                    )
                  : (!t.submitted && widget.userProfile.role == 'alumno'
                      ? ElevatedButton(
                          onPressed: () {
                            _db.submitTask(cls.id, t.id);
                            _calculateStats();
                            setState(() {});
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E293B), padding: const EdgeInsets.symmetric(horizontal: 12)),
                          child: const Text('Entregar', style: TextStyle(color: Colors.indigoAccent, fontSize: 11)),
                        )
                      : (t.submitted && widget.userProfile.role == 'profesor' && t.score == null
                          ? ElevatedButton(
                              onPressed: () => _showGradeDialog(cls.id, t.id),
                              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1E293B)),
                              child: const Text('Calificar', style: TextStyle(color: Colors.amber, fontSize: 11)),
                            )
                          : Text(t.submitted ? 'Entregado' : 'Pendiente', style: const TextStyle(color: Colors.white38, fontSize: 11)))),
              ),
            )),
            if (widget.userProfile.role == 'profesor') ...[
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () => _showAddTaskDialog(cls.id),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Asignar Nueva Tarea'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(40),
                  side: const BorderSide(color: Colors.white10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              )
            ]
          ],
        ),
      ),
    );
  }

  Widget _bentoCard(String val, IconData icon, Color color, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1426), 
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10, width: 1),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 8),
          Text(val, style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(color: Colors.white38, fontSize: 9, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  void _showJoinDialog() {
    _joinCodeController.clear();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0E1424),
        title: const Text('Unirse a una clase', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: _joinCodeController,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'Ej. MATH42',
            hintStyle: TextStyle(color: Colors.white24),
            enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar', style: TextStyle(color: Colors.white38))),
          ElevatedButton(
            onPressed: () {
              if (_joinCodeController.text.trim().isNotEmpty) {
                _db.joinClass(_joinCodeController.text);
                Navigator.pop(context);
                _calculateStats();
                setState(() {});
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
            child: const Text('Unirse', style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }

  void _showCreateDialog() {
    _createClassNameController.clear();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0E1424),
        title: const Text('Crear nueva clase', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: _createClassNameController,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'Nombre de la materia (ej. Física II)',
            hintStyle: TextStyle(color: Colors.white24),
            enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar', style: TextStyle(color: Colors.white38))),
          ElevatedButton(
            onPressed: () {
              if (_createClassNameController.text.trim().isNotEmpty) {
                _db.createClass(_createClassNameController.text, 'FÍSICA', widget.userProfile.name);
                Navigator.pop(context);
                _calculateStats();
                setState(() {});
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
            child: const Text('Crear', style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }

  void _showAddTaskDialog(String classId) {
    final titleController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0E1424),
        title: const Text('Asignar tarea', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: titleController,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'Título de la tarea',
            hintStyle: TextStyle(color: Colors.white24),
            enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar', style: TextStyle(color: Colors.white38))),
          ElevatedButton(
            onPressed: () {
              if (titleController.text.trim().isNotEmpty) {
                _db.addTask(classId, titleController.text);
                Navigator.pop(context);
                _calculateStats();
                setState(() {});
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
            child: const Text('Crear', style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }

  void _showGradeDialog(String classId, String taskId) {
    final gradeController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF0E1424),
        title: const Text('Calificar entrega', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: gradeController,
          keyboardType: TextInputType.number,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            hintText: 'Calificación (0-100)',
            hintStyle: TextStyle(color: Colors.white24),
            enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar', style: TextStyle(color: Colors.white38))),
          ElevatedButton(
            onPressed: () {
              final score = int.tryParse(gradeController.text);
              if (score != null) {
                _db.gradeTask(classId, taskId, score);
                Navigator.pop(context);
                _calculateStats();
                setState(() {});
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5)),
            child: const Text('Guardar', style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }
}
