let newsData = [];
let currentId = 1;

class News {
  constructor(title, content, category, date, imageUrl) {
    this.id = currentId++;
    this.title = title;
    this.content = content;
    this.category = category;
    this.date = date;
    this.imageUrl = imageUrl;
  }
}

function getAllNews() {
  return newsData;
}

function getNewsById(id) {
  return newsData.find((n) => n.id === id);
}

function createNews(title, content, category, date, imageUrl) {
  const news = new News(title, content, category, date, imageUrl);
  newsData.push(news);
  return news;
}

function updateNews(id, title, content, category, date, imageUrl) {
  const news = getNewsById(id);
  if (!news) return null;
  news.title = title !== undefined ? title : news.title;
  news.content = content !== undefined ? content : news.content;
  news.category = category !== undefined ? category : news.category;
  news.date = date !== undefined ? date : news.date;
  news.imageUrl = imageUrl !== undefined ? imageUrl : news.imageUrl;
  return news;
}

function deleteNews(id) {
  const index = newsData.findIndex((n) => n.id === id);
  if (index === -1) return false;
  newsData.splice(index, 1);
  return true;
}

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
