import 'package:flutter/material.dart';
import '../utils/theme.dart';

class IdeasScreen extends StatelessWidget {
  const IdeasScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Идеи сообщества'),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildIdeaCard(
            title: 'Децентрализованный арбитраж',
            author: 'Александр',
            description: 'Протокол на основе точки Шеллинга для разрешения споров',
            score: 89,
            votes: 42,
          ),
          _buildIdeaCard(
            title: 'ИИ-агент для поиска связей',
            author: 'Вы',
            description: 'Анализ диалогов для поиска людей с общими интересами',
            score: 75,
            votes: 28,
          ),
          _buildIdeaCard(
            title: 'Децентрализованный маркетплейс',
            author: 'Дмитрий',
            description: 'Маркетплейс без посредников с честным рейтингом',
            score: 92,
            votes: 56,
          ),
          _buildIdeaCard(
            title: 'Портативная репутация',
            author: 'Мария',
            description: 'Система репутации, которая принадлежит пользователю',
            score: 68,
            votes: 19,
          ),
        ],
      ),
    );
  }

  Widget _buildIdeaCard({
    required String title,
    required String author,
    required String description,
    required int score,
    required int votes,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.accentColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '🔥 $score%',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.accentColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Автор: $author',
              style: const TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              description,
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.thumb_up_outlined,
                  size: 14,
                  color: Colors.grey.shade600,
                ),
                const SizedBox(width: 4),
                Text(
                  '$votes',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
                const Spacer(),
                TextButton(
                  onPressed: () {},
                  style: TextButton.styleFrom(
                    foregroundColor: AppTheme.accentColor,
                  ),
                  child: const Text('Обсудить'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
