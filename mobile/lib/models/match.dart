class Match {
  final String userId;
  final String name;
  final String reason;
  final double score;
  final String? avatarUrl;

  Match({
    required this.userId,
    required this.name,
    required this.reason,
    required this.score,
    this.avatarUrl,
  });

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      userId: json['userId'] ?? '',
      name: json['name'] ?? 'Аноним',
      reason: json['reason'] ?? 'Общие интересы',
      score: (json['score'] as num?)?.toDouble() ?? 0.0,
      avatarUrl: json['avatarUrl'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'name': name,
      'reason': reason,
      'score': score,
      'avatarUrl': avatarUrl,
    };
  }
}