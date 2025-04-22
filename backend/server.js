const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const newsRoutes = require('./routes/news');
const { importFromRSS } = require('./rssImporter');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/news', newsRoutes);

// Endpoint to trigger RSS import manually
app.post('/api/import-rss', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL do feed RSS é obrigatória' });
  }
  try {
    await importFromRSS(url);
    res.json({ message: 'Importação RSS iniciada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao importar RSS' });
  }
});

// Rota para servir index.html para qualquer outra rota (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
