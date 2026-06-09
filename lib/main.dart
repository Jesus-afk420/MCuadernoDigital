import 'package:flutter/material.dart';
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
      appBar: AppBar(
        title: const Text('Mi Cuaderno Digital', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: const Color(0xFF0F172A),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, size: 18, color: Colors.white60),
            onPressed: () => setState(() {
              _profile = null;
              _currentTab = 0;
              _subContext = null;
              _clsContext = null;
            }),
          )
        ],
      ),
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
        selectedItemColor: const Color(0xFF818CF8),
        unselectedItemColor: Colors.white38,
        backgroundColor: const Color(0xFF0D1426),
        onTap: (tab) => setState(() => _currentTab = tab),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inicio'),
          BottomNavigationBarItem(icon: Icon(Icons.comment), label: 'Asistente IA'),
        ],
      ),
    );
  }
}
