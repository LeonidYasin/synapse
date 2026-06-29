class User {
  final String id;
  final String name;
  final String? email;
  final String? avatarUrl;
  final List<String> interests;
  final List<String> skills;
  final double rating;
  final int completedDeals;
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    this.email,
    this.avatarUrl,
    this.interests = const [],
    this.skills = const [],
    this.rating = 0.0,
    this.completedDeals = 0,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Аноним',
      email: json['email'],
      avatarUrl: json['avatarUrl'],
      interests: List<String>.from(json['interests'] ?? []),
      skills: List<String>.from(json['skills'] ?? []),
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      completedDeals: json['completedDeals'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
      'interests': interests,
      'skills': skills,
      'rating': rating,
      'completedDeals': completedDeals,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
