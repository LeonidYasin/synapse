import '../models/message.dart';
import '../models/match.dart';

class AgentService {
  static final AgentService _instance = AgentService._internal();
  factory AgentService() => _instance;
  AgentService._internal();

  // Анализ диалога
  Future<Map<String, dynamic>> analyzeMessages(
    List<Message> messages,
    String lastMessage,
  ) async {
    // В реальности — запрос к бэкенду
    // Сейчас имитация
    await Future.delayed(const Duration(milliseconds: 500));

    final interests = _extractInterests(lastMessage);
    final ideas = _extractIdeas(lastMessage);
    final needs = _extractNeeds(lastMessage);

    return {
      'interests': interests,
      'ideas': ideas,
      'needs': needs,
    };
  }

  List<String> _extractInterests(String text) {
    final keywords = ['децентрализация', 'блокчейн', 'крипто', 'AI', 'ИИ', 'стартап', 'разработка', 'инвестиции'];
    return keywords.where((k) => text.toLowerCase().contains(k.toLowerCase())).toList();
  }

  List<String> _extractIdeas(String text) {
    final patterns = [
      'децентрализован',
      'арбитраж',
      'маркетплейс',
      'протокол',
    ];
    return patterns.where((p) => text.toLowerCase().contains(p.toLowerCase())).toList();
  }

  List<String> _extractNeeds(String text) {
    final needs = <String>[];
    if (text.toLowerCase().contains('ищу')) needs.add('Поиск партнёров');
    if (text.toLowerCase().contains('инвестиции') || text.toLowerCase().contains('инвестор')) {
      needs.add('Поиск инвестиций');
    }
    if (text.toLowerCase().contains('помощь') || text.toLowerCase().contains('помогите')) {
      needs.add('Поиск экспертов');
    }
    return needs;
  }
}
