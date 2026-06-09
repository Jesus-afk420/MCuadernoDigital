import 'package:flutter/material.dart';
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
                  TextField(
                    controller: _fullNameController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      labelText: 'Nombre Completo',
                      labelStyle: TextStyle(color: Colors.white60),
                      enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _emailController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      labelText: 'Correo Electrónico',
                      labelStyle: TextStyle(color: Colors.white60),
                      enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _passwordController,
                    obscureText: !_showPassword,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      labelText: 'Contraseña',
                      labelStyle: const TextStyle(color: Colors.white60),
                      enabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                      suffixIcon: IconButton(
                        icon: Icon(_showPassword ? Icons.visibility : Icons.visibility_off, color: Colors.white60),
                        onPressed: () => setState(() => _showPassword = !_showPassword),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _confirmPasswordController,
                    obscureText: !_showPassword,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(
                      labelText: 'Confirmar Contraseña',
                      labelStyle: TextStyle(color: Colors.white60),
                      enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: Colors.white24)),
                    ),
                  ),
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
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4F46E5),
                      minimumSize: const Size.fromHeight(50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Registrarse', style: TextStyle(color: Colors.white, fontSize: 16)),
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
