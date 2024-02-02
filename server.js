const express = require('express');
const cors = require('cors');  // Importar el módulo cors
const appRoute = require('./routes/route.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Configuración de CORS
const corsOptions = {
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));

/**routes* */
app.use('/api', appRoute);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
