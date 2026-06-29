class Idea {
  final String id;
  final String title;
  final String description;
  final String author;
  final double score;
  final int votes;
  final DateTime createdAt;

  Idea({
    required this.id,
    required this.title,
    required this.description,
    required this.author,
    required this.score,
    required this.votes,
    required this.createdAt,
  });

  factory Idea.fromJson(Map<String, dynamic> json) {
    return Idea(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      author: json['author'] ?? 'Аноним',
      score: (json['score'] as num?)?.toDouble() ?? 0.0,
      votes: json['votes'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'author': author,
      'score': score,
      'votes': votes,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
