require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

//Definimos un array para almacenar las urls
const urls = [];

//logger middleware
app.use(function (req, res, next) {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
}
);

//Añadimos linea para permitir a express recibir datos en formato json enviados por formulario
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

//Se puede usar el req.body para obtener los parámetros de la url
app.post('/api/shorturl', function (req, res) {
  let original_url = req.body.url;

  // Validar la URL, el regex esta sacado de https://stackoverflow.com/questions/5717093/check-if-a-string-is-a-valid-url-in-javascript
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlPattern.test(original_url)) {
    return res.json({ error: 'invalid url' });
  }

  // Aquí puedes agregar la lógica para almacenar la URL original y generar un short URL
  // Por simplicidad, solo devolveremos la URL original en este ejemplo
  // En un caso real, deberías almacenar la URL original en una base de datos y generar un ID único
  // para la URL corta.
  // Por ejemplo, podrías usar un contador para generar un ID único
  // y luego almacenar la URL original en un objeto o base de datos con ese ID.
  // En este caso, simplemente devolveremos la URL original como un ejemplo.

  const shortUrl = urls.length + 1; // Generar un ID único para la URL corta
  const newUrl = {
    original_url: original_url,
    short_url: shortUrl
  };
  urls.push(newUrl); // Almacenar la URL original y el ID en un array (o base de datos)
  res.json(newUrl); // Devolver la URL original y el ID en la respuesta

});

app.get('/api/shorturl/:shorturl', function (req, res) {
  const shortUrl = req.params.shorturl;
  const url = urls.find(url => url.short_url == shortUrl);

  //Si no se encuentra la url, se devuelve un error
  if (!url) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  //Redirijo a la url original
  res.redirect(url.original_url);

  
});

