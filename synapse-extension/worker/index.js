// worker/index.js — Cloudflare Worker для анализа диалогов

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    if (path === '/analyze' && request.method === 'POST') {
      const body = await request.json();
      const { dialog, userId } = body;
      
      const analysis = analyzeDialog(dialog);
      
      if (env.KV) {
        const profile = await env.KV.get(`profile:${userId}`, 'json') || { interests: [], ideas: [], needs: [] };
        profile.interests = [...new Set([...profile.interests, ...analysis.interests])];
        profile.ideas = [...new Set([...profile.ideas, ...analysis.ideas])];
        profile.needs = [...new Set([...profile.needs, ...analysis.needs])];
        await env.KV.put(`profile:${userId}`, JSON.stringify(profile));
      }
      
      const matches = await findMatches(userId, env);
      
      return new Response(JSON.stringify({
        success: true,
        ideas: analysis.ideas,
        interests: analysis.interests,
        needs: analysis.needs,
        matches: matches
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    if (path === '/matches' && request.method === 'GET') {
      const userId = url.searchParams.get('userId');
      const matches = await findMatches(userId, env);
      
      return new Response(JSON.stringify({
        success: true,
        matches: matches
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

function analyzeDialog(dialog) {
  const text = dialog.map(m => m.text).join(' ');
  const lowerText = text.toLowerCase();
  
  const interests = [];
  if (lowerText.includes('децентрализация') || lowerText.includes('блокчейн')) interests.push('Блокчейн');
  if (lowerText.includes('ai') || lowerText.includes('ии') || lowerText.includes('нейросеть')) interests.push('Искусственный интеллект');
  if (lowerText.includes('стартап') || lowerText.includes('бизнес')) interests.push('Стартапы');
  if (lowerText.includes('инвестиции') || lowerText.includes('инвестор')) interests.push('Инвестиции');
  if (lowerText.includes('разработка') || lowerText.includes('программирование')) interests.push('Разработка');
  
  const ideas = [];
  const ideaPatterns = [
    { match: 'можно сделать', idea: 'Новая идея' },
    { match: 'предлагаю', idea: 'Предложение' },
    { match: 'решение', idea: 'Решение проблемы' },
    { match: 'протокол', idea: 'Протокол' },
    { match: 'децентрализован', idea: 'Децентрализованное решение' }
  ];
  
  for (const pattern of ideaPatterns) {
    if (lowerText.includes(pattern.match)) {
      ideas.push(pattern.idea);
    }
  }
  
  const needs = [];
  if (lowerText.includes('ищу')) needs.push('Поиск партнёров');
  if (lowerText.includes('инвестиции') || lowerText.includes('инвестор')) needs.push('Поиск инвестиций');
  if (lowerText.includes('помощь') || lowerText.includes('помогите')) needs.push('Поиск экспертов');
  
  return {
    interests: [...new Set(interests)],
    ideas: [...new Set(ideas)],
    needs: [...new Set(needs)]
  };
}

async function findMatches(userId, env) {
  const demoMatches = [
    { userId: 'user_demo_1', name: 'Александр', reason: 'Интересуется децентрализацией', score: 0.85 },
    { userId: 'user_demo_2', name: 'Мария', reason: 'Ищет CTO для DeFi-стартапа', score: 0.72 },
    { userId: 'user_demo_3', name: 'Дмитрий', reason: 'Инвестор в Web3', score: 0.68 }
  ];
  
  if (env.KV) {
    try {
      return demoMatches;
    } catch (e) {
      console.error('Ошибка поиска связей:', e);
    }
  }
  
  return demoMatches;
}