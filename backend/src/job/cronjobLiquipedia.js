const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const Torneo=require("../models/event.js")
const axios = require("axios");
const cron = require("node-cron");
const conectarMysql=require("../config/mysqlConnection");
const { get } = require("http");

async function getEvents(startdate) {
    try {
        const json = await axios.get("URL_DE_LA_API_DE_LIQUIPEDIA").then(resp =>{
            const eventsJson=JSON.parse(resp.data);
            let eventos=[];
            eventsJson.array.forEach(element => {
                const torneo=new Torneo(element.pageid, element.name,element.prizepool,element.lan)
                eventos.push(torneo);
            });
        }); // Reemplazar con la URL real
        return eventos;
    } catch (error) {
        console.error("Error obteniendo datos de Liquipedia", error);
        return [];
    }
}

async function actualizarTorneos(startdate) {
    const connection = await conectarMysql();
    const torneos = await getEvents(startdate);
    
    for (const torneo of torneos) {
        const { event_id, event_name, prize_pool, lan } = torneo;
        
        try {
            await connection.execute(
                //"INSERT INTO torneos (event_id, event_name, prize_pool, lan) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE event_name = VALUES(event_name), prize_pool = VALUES(prize_pool), lan = VALUES(lan)",
                [event_id, event_name, prize_pool, lan]
            );
            console.log(`Torneo ${event_name} actualizado.`);
        } catch (error) {
            console.error("Error insertando torneo", error);
        }
    }
    
    await connection.end();
}
/*
// Ejecutar cada 24 horas
cron.schedule("0 0 * * *", () => {
    console.log("Ejecutando cron job para actualizar torneos");
    actualizarTorneos();
});

console.log("Cron job iniciado. Se ejecutará cada 24 horas.");
*/
