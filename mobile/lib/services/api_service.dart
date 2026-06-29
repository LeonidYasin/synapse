import 'package:dio/dio.dart';
import '../models/message.dart';
import '../models/match.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late Dio _dio;
  String? _userId;

  void init({required String baseUrl, required String userId}) {
    _userId = userId;
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ));
  }

  Future<Map<String, dynamic>> analyzeDialog(List<Message> messages) async {
    try {
      final response = await _dio.post('/analyze', data: {
        'userId': _userId,
        'dialog': messages.map((m) => m.toJson()).toList(),
      });
      return response.data;
    } on DioException catch (e) {
      throw Exception('Ошибка анализа: ${e.message}');
    }
  }

  Future<List<Match>> getMatches() async {
    try {
      final response = await _dio.get('/matches', queryParameters: {
        'userId': _userId,
      });
      final List data = response.data['matches'] ?? [];
      return data.map((item) => Match.fromJson(item)).toList();
    } on DioException catch (e) {
      throw Exception('Ошибка загрузки: ${e.message}');
    }
  }

  Future<String> sendMessage(String text) async {
    try {
      final response = await _dio.post('/chat', data: {
        'userId': _userId,
        'message': text,
      });
      return response.data['reply'] ?? 'Извините, не удалось получить ответ';
    } on DioException catch (e) {
      throw Exception('Ошибка отправки: ${e.message}');
    }
  }
}