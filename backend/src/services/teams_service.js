import path from "path";
import ComponentBd from "../database/bdComponent.js";
import Team from "../models/team.js";
import { fileURLToPath } from "url";
import axios from "axios"
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const headers = {
    "accept": "application/json",
    "authorization": "Apikey " + process.env.API_KEY
}

async function getTeams(earning, isDisband, limit) {
    let teams = []
    let resApi
    let url
    if (!isDisband) {
        url = process.env.API_LIQUIPEDIA_URL_CS + "team?wiki=counterstrike&conditions=[[earnings::>" + earning + "]] AND [[status::active]]&limit=" + limit
    } else {
        url = process.env.API_LIQUIPEDIA_URL + "&conditions=[[earnings::" + earning + "]]&limit=" + limit
    }
    try {
        await axios.get(url, { headers }).then(response => {
            const teamsJson = response.data.result
            console.log(Array.isArray(teamsJson))
            teamsJson.forEach(element => {
                teams.push(new Team(element.pageid, element.name))

            });
        })
    } catch (err) {
        console.log(err)
    }
    return teams
}

async function insertTeams(earning, isDisband, limit) {
    const connection = new ComponentBd("localhost")
    const teams = await getTeams(earning, false, limit)
    for (const team of teams) {
        try {
            await connection.insert("teams", team)
        } catch (error) {
            console.log(error)
        }
    }
    await connection.close()
}

// updatear ranking segun el nombre. En Proceso
function normalizarNombre(nombre) {
    return nombre
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

const equivalencias = {
    "natus vincere": "NaVi",
    "team vitality": "Vitality",
    "faze clan": "FaZe"
};

insertTeams(10000, false, 164)