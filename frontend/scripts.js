const apiBaseUrl = '/api/news';

const categoryColors = {
  'Política': 'category-politica',
  'Esportes': 'category-esportes',
  'Economia': 'category-economia',
  'Cultura': 'category-cultura',
  'Tecnologia': 'category-tecnologia',
  'Geral': 'category-geral',
};

async function fetchNews() {
  try {
    const response = await fetch(apiBaseUrl);
    const news = await response.json();
    return news;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}

function createNewsCard(newsItem) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded shadow p-4 flex flex-col';

  const categoryClass = categoryColors[newsItem.category] || 'category-geral';

  const categoryLabel = document.createElement('span');
  categoryLabel.className = `category-label ${categoryClass} inline-block mb-2`;
  categoryLabel.textContent = newsItem.category;

  const title = document.createElement('h2');
  title.className = 'text-lg font-bold mb-2 text-gray-800';
  title.textContent = newsItem.title;

  const date = document.createElement('time');
  date.className = 'text-sm text-gray-500 mb-2';
  date.dateTime = newsItem.date;
  date.textContent = new Date(newsItem.date).toLocaleDateString('pt-BR');

  const content = document.createElement('p');
  content.className = 'text-gray-700 flex-grow';
  content.innerHTML = newsItem.content;

  card.appendChild(categoryLabel);
  card.appendChild(title);
  card.appendChild(date);
  card.appendChild(content);

  if (newsItem.imageUrl) {
    const img = document.createElement('img');
    img.src = newsItem.imageUrl;
    img.alt = newsItem.title;
    img.className = 'mt-2 rounded';
    card.appendChild(img);
  }

  return card;
}

function displayNews(news, categoryFilter = 'todas') {
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '';

  const filteredNews = categoryFilter === 'todas'
    ? news
    : news.filter((item) => item.category === categoryFilter);

  if (filteredNews.length === 0) {
    newsList.innerHTML = '<p class="text-center text-gray-600">Nenhuma notícia encontrada para esta categoria.</p>';
    return;
  }

  filteredNews.forEach((newsItem) => {
    const card = createNewsCard(newsItem);
    newsList.appendChild(card);
  });
}

async function init() {
  const news = await fetchNews();
  displayNews(news);

  const buttons = document.querySelectorAll('nav button[data-category]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      displayNews(news, category);
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
