import 'package:flutter/material.dart';
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
  final List<ChatMessage> _messages = [];
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    String intro = '¡Hola! Soy Bien 🤖, tu copiloto de Inteligencia Artificial.';
    if (widget.className != null) {
      intro += ' He sintonizado mi contexto con tu clase de **${widget.className}** (${widget.subject}). ¿Qué duda quieres resolver?';
    } else {
      intro += ' ¿En qué materia o tarea necesitas asesoría académica hoy?';
    }
    _messages.add(ChatMessage(id: '1', role: 'assistant', content: intro, timestamp: 'Ahora'));
  }

  void _sendMessage(String text) async {
    if (text.trim().isEmpty) return;
    _textController.clear();
    setState(() {
      _messages.add(ChatMessage(id: DateTime.now().toString(), role: 'user', content: text, timestamp: 'Ahora'));
      _isTyping = true;
    });

    String promptContext = text;
    if (widget.className != null) {
      promptContext = "Teniendo en cuenta mi clase de ${widget.className} (${widget.subject}): $text";
    }

    final reply = await _db.queryGemini(promptContext, widget.userProfile.role);
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
          if (widget.className != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              color: const Color.fromRGBO(129, 140, 248, 0.1),
              child: Row(
                children: [
                  const Icon(Icons.psychology, size: 16, color: Color(0xFF818CF8)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Contexto activo de IA: ${widget.className}',
                      style: const TextStyle(color: Color(0xFF818CF8), fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
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
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isAI ? const Color(0xFF0D1426) : const Color(0xFF4F46E5),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: isAI ? Radius.zero : const Radius.circular(16),
                        bottomRight: isAI ? const Radius.circular(16) : Radius.zero,
                      ),
                      border: isAI ? Border.all(color: Colors.white10) : null,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isAI ? 'BIEN IA' : widget.userProfile.name.toUpperCase(),
                          style: TextStyle(
                            color: isAI ? const Color(0xFF818CF8) : Colors.white70,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          m.content,
                          style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isTyping)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8.0),
              child: Center(
                child: SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF818CF8)),
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFF0D1426),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white10),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: TextField(
                      controller: _textController,
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                      onSubmitted: _sendMessage,
                      decoration: const InputDecoration(
                        hintText: 'Pregúntale lo que quieras...',
                        hintStyle: TextStyle(color: Colors.white24, fontSize: 13),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: const Color(0xFF4F46E5),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 16),
                    onPressed: () => _sendMessage(_textController.text),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
