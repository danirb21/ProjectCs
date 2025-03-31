const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const Torneo = require("../models/event.js")
const axios = require("axios");
const cron = require("node-cron");
const bdComponent = require("../database/bdComponent.js");
const { start } = require("repl");

const headers = {
    "accept": "application/json",
    "authorization": "Apikey " + process.env.API_KEY
}


async function getEvents(startdate, endDate, limit) {
    let europeanTournaments
    let eventos = []
    try {
        await axios.get(process.env.API_LIQUIPEDIA_URL_CS + "&conditions=[[startdate::>" + startdate + "]] AND [[enddate::<" + endDate + "]]" + "&limit=" + limit, { headers }).then(resp => {
            const tournaments = resp.data.result;
            // console.log(tournaments)
            europeanTournaments = tournaments.filter(tournament => {
                return tournament.locations.region1 === "Europe" || tournament.locations.region1 === "World"
            }
            )
        });
        let bol;
        europeanTournaments.forEach(element => {
            bol = element.type === "Offline"
            eventos.push(new Torneo(element.pageid, element.name, element.prizepool, bol))
        });
        return eventos;
    } catch (error) {
        console.error("Error obteniendo datos de Liquipedia", error);
        return [];
    }
}
/*
insertEvents("2025-3-31", "2025-4-14", 1000, "localhost")
    .then(() => console.log("PROCESO REALIZADO CON ÉXITO :)"))
    .catch((err) => console.error("Error:", err));
*/

async function insertEvents(startdate, endDate, limit, host) {
    const connection = new bdComponent(host);
    const torneos = await getEvents(startdate, endDate, limit);

    for (const torneo of torneos) {
        try {
            await connection.insert("events", torneo, "");
        } catch (error) {
            console.error("Error actualizando torneo", error);
        }
    }
    await connection.close();
}