const apiBaseUrl = '/api/news';

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

async function fetchNewsById(id) {
  try {
    const response = await fetch(apiBaseUrl + '/' + id);
    if (!response.ok) throw new Error('Notícia não encontrada');
    const news = await response.json();
    return news;
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    return null;
  }
}

async function createNews(data) {
  try {
    const response = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao criar notícia');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateNews(id, data) {
  try {
    const response = await fetch(apiBaseUrl + '/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar notícia');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function deleteNews(id) {
  try {
    const response = await fetch(apiBaseUrl + '/' + id, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar notícia');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function importRSS(url) {
  try {
    const response = await fetch('/api/import-rss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) throw new Error('Erro ao importar RSS');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Manipulação do formulário de notícia
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('news-form');
  const btnImportRSS = document.getElementById('btn-import-rss');
  const rssModal = document.getElementById('rss-modal');
  const rssForm = document.getElementById('rss-form');
  const btnCancelRSS = document.getElementById('btn-cancel-rss');

  // Carregar notícia para edição se id estiver na query string
  const params = new URLSearchParams(window.location.search);
  const newsId = params.get('id');

  if (newsId) {
    document.getElementById('form-title').textContent = 'Editar Notícia';
    fetchNewsById(newsId).then((news) => {
      if (news) {
        document.getElementById('news-id').value = news.id;
        document.getElementById('title').value = news.title;
        document.getElementById('category').value = news.category;
        document.getElementById('date').value = news.date ? news.date.split('T')[0] : '';
        document.getElementById('imageUrl').value = news.imageUrl || '';
        document.getElementById('content').value = news.content;
      } else {
        alert('Notícia não encontrada');
        window.location.href = 'index.html';
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('news-id').value;
    const data = {
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      date: document.getElementById('date').value,
      imageUrl: document.getElementById('imageUrl').value,
      content: document.getElementById('content').value,
    };

    let success;
    if (id) {
      success = await updateNews(id, data);
    } else {
      success = await createNews(data);
    }

    if (success) {
      alert('Notícia salva com sucesso!');
      window.location.href = 'index.html';
    } else {
      alert('Erro ao salvar notícia.');
    }
  });

  btnImportRSS.addEventListener('click', () => {
    rssModal.classList.remove('hidden');
  });

  btnCancelRSS.addEventListener('click', () => {
    rssModal.classList.add('hidden');
  });

  rssForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('rss-url').value;
    const success = await importRSS(url);
    if (success) {
      alert('Importação iniciada com sucesso!');
      rssModal.classList.add('hidden');
      window.location.href = 'index.html';
    } else {
      alert('Erro ao importar RSS.');
    }
  });
});
