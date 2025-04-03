import express from "express";   // Usa 'import' en lugar de 'require'
import cors from "cors";         // Lo mismo para 'cors'
import dotenv from "dotenv";
import { checkRanking } from "./services/valve_Ranking_Europe_Scrap.js";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req, res) => {
        res.send("Servidor Funcionando")


});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto "+PORT);
});
app.get("/latest-valve-ranking", async (req, res) => {
    checkRanking("./src/data/lastRankingValve.json").then(data =>{
        res.send(data)
    }).catch(err =>{
        console.log(err)
    })
});