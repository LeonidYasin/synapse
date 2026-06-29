import 'package:flutter/material.dart';
import '../models/message.dart';
import '../services/api_service.dart';
import '../widgets/message_bubble.dart';
import '../utils/theme.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _textController = TextEditingController();
  final List<Message> _messages = [];
  bool _isLoading = false;
  bool _isAgentEnabled = true;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _addSystemMessage();
  }

  void _addSystemMessage() {
    _messages.add(Message(
      id: 'system',
      text: '👋 Добро пожаловать в Synapse! Расскажите о своих интересах, идеях или потребностях — агент поможет найти нужных людей.',
      senderId: 'system',
      senderName: 'Synapse',
      timestamp: DateTime.now(),
      isUser: false,
    ));
  }

  Future<void> _sendMessage() async {
    final text = _textController.text.trim();
    if (text.isEmpty || _isLoading) return;

    final userMessage = Message(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      text: text,
      senderId: 'user',
      senderName: 'Вы',
      timestamp: DateTime.now(),
      isUser: true,
    );
    setState(() {
      _messages.add(userMessage);
      _textController.clear();
      _isLoading = true;
    });
    _scrollToBottom();

    try {
      final apiService = ApiService();
      final reply = await apiService.sendMessage(text);

      final assistantMessage = Message(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        text: reply,
        senderId: 'assistant',
        senderName: 'ИИ-ассистент',
        timestamp: DateTime.now(),
        isUser: false,
      );
      setState(() {
        _messages.add(assistantMessage);
        _isLoading = false;
      });
      _scrollToBottom();

      if (_isAgentEnabled) {
        // Агент анализирует диалог
        // В реальности здесь будет вызов AgentService
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка: ${e.toString()}')),
      );
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Synapse Chat'),
        centerTitle: true,
        actions: [
          Switch(
            value: _isAgentEnabled,
            onChanged: (value) {
              setState(() {
                _isAgentEnabled = value;
              });
            },
            activeColor: AppTheme.accentColor,
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
            color: _isAgentEnabled ? Colors.green.shade50 : Colors.grey.shade100,
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _isAgentEnabled ? Colors.green : Colors.grey,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  _isAgentEnabled ? 'Агент активен' : 'Агент отключён',
                  style: TextStyle(
                    fontSize: 12,
                    color: _isAgentEnabled ? Colors.green.shade700 : Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return MessageBubble(message: message);
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(color: Colors.grey.shade300),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: InputDecoration(
                      hintText: 'Напишите сообщение...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey.shade100,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                    ),
                    maxLines: null,
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppTheme.accentColor,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: _isLoading ? null : _sendMessage,
                    iconSize: 20,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}