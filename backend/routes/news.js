const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require('../models/news');

// List all news
router.get('/', (req, res) => {
  const news = getAllNews();
  res.json(news);
});

// Get news by id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const news = getNewsById(id);
  if (!news) {
    return res.status(404).json({ error: 'Notícia não encontrada' });
  }
  res.json(news);
});

// Create news
router.post('/', (req, res) => {
  const { title, content, category, date, imageUrl } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Campos obrigatórios: title, content, category' });
  }
  const news = createNews(title, content, category, date || new Date().toISOString(), imageUrl || '');
  res.status(201).json(news);
});

// Update news
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content, category, date, imageUrl } = req.body;
  const updated = updateNews(id, title, content, category, date, imageUrl);
  if (!updated) {
    return res.status(404).json({ error: 'Notícia não encontrada' });
  }
  res.json(updated);
});

// Delete news
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = deleteNews(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Notícia não encontrada' });
  }
  res.json({ message: 'Notícia deletada com sucesso' });
});

module.exports = router;
