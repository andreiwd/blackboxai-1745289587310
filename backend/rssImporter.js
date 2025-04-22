const fetch = require('node-fetch');
const xml2js = require('xml2js');
const { createNews } = require('./models/news');

async function importFromRSS(url) {
  try {
    const response = await fetch(url);
    const xml = await response.text();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    if (!result.rss || !result.rss.channel || !result.rss.channel[0].item) {
      console.error('RSS feed inválido ou sem itens');
      return;
    }

    const items = result.rss.channel[0].item;

    items.forEach((item) => {
      const title = item.title ? item.title[0] : 'Sem título';
      const content = item.description ? item.description[0] : '';
      const category = item.category ? item.category[0] : 'Geral';
      const pubDate = item.pubDate ? new Date(item.pubDate[0]).toISOString() : new Date().toISOString();
      const imageUrl = ''; // RSS feed may not have image URL, can be extended if needed

      // Check if news with same title already exists to avoid duplicates
      const existingNews = createNews(title, content, category, pubDate, imageUrl);
      // For simplicity, we just create news here. In real app, check for duplicates before creating.
    });

    console.log('Importação RSS concluída');
  } catch (error) {
    console.error('Erro ao importar RSS:', error);
  }
}

module.exports = { importFromRSS };
