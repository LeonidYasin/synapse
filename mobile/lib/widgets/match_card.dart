import 'package:flutter/material.dart';
import '../models/match.dart';
import '../utils/theme.dart';

class MatchCard extends StatelessWidget {
  final Match match;
  final void Function(Match match) onConnect;

  const MatchCard({
    super.key,
    required this.match,
    required this.onConnect,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 28,
              backgroundColor: AppTheme.accentColor.withOpacity(0.2),
              child: Text(
                match.name.isNotEmpty ? match.name[0].toUpperCase() : '?',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.accentColor,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    match.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    match.reason,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.thumb_up,
                        size: 14,
                        color: AppTheme.accentColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '${(match.score * 100).toInt()}% совпадение',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.accentColor,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () => onConnect(match),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.accentColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
              child: const Text(
                'Связаться',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}