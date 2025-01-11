const express = require('express');
const bodyParser = require('body-parser');
const { initModels } = require('./models');
const userRoutes = require('../modules/Users/routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

initModels();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
