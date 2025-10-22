import express from "express";   // Usa 'import' en lugar de 'require'
import cors from "cors";         // Lo mismo para 'cors'
import dotenv from "dotenv";
import axios from "axios"
import { getTeamApi } from "./services/teams_service.js"
import { checkRanking } from "./services/valve_Ranking_Europe_Scrap.js";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor Funcionando")


});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
});
app.get("/latest-valve-ranking", async (req, res) => {
  checkRanking("./src/data/lastRankingValve.json").then(data => {
    res.send(data)
  }).catch(err => {
    console.log(err)
  })
});

app.get("/team/:name", async (req, res) => {
  const { name } = req.params;
  const teamData = await getTeamApi(name);

  if (teamData) {
    res.json(teamData);
  } else {
    res.status(500).json({ error: "Error al obtener datos del equipo." });
  }
});

app.get("/image-proxy", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send('URL de imagen es requerida');
  }

  try {
    // Petición a la URL externa con responseType 'stream'
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });

    // Copiar tipo de contenido (image/png, image/jpeg, etc.)
    res.setHeader('Content-Type', imageResponse.headers['content-type']);

    // Pipe de datos (stream) hacia la respuesta del cliente
    imageResponse.data.pipe(res);
  } catch (error) {
    console.error('Error proxy imagen:', error.message);
    res.status(500).send('Error al obtener la imagen');
  }
});

app.get("/estandarizar-nombre")