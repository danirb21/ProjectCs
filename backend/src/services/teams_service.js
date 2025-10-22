import path from "path";
import ComponentBd from "../database/bdComponent.js";
import Team from "../models/team.js";
import { fileURLToPath } from "url";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const headers = {
    accept: "application/json",
    authorization: "Apikey " + process.env.API_KEY,
};

async function getTeamsApi(earning, isDisband, limit) {
    let teams = [];
    let url;

    if (!isDisband) {
        url =
            process.env.API_LIQUIPEDIA_URL_CS +
            "team?wiki=counterstrike&conditions=[[earnings::>" +
            earning +
            "]] AND [[status::active]]&limit=" +
            limit;
    } else {
        url =
            process.env.API_LIQUIPEDIA_URL +
            "&conditions=[[earnings::" +
            earning +
            "]]&limit=" +
            limit;
    }

    try {
        const response = await axios.get(url, { headers });
        const teamsJson = response.data.result;

        if (Array.isArray(teamsJson)) {
            teamsJson.forEach((element) => {
                teams.push(new Team(element.pageid, element.name));
            });
        } else {
            console.warn("Respuesta inesperada de la API:", teamsJson);
        }
    } catch (err) {
        console.log("Error obteniendo equipos de la API:", err.message);
    }

    return teams;
}

export async function getTeamApi(nameTeam) {
    let team;
    let name = nameTeam;
    let url
  /*  if (name.toLowerCase() != estandarizarNombre(nameTeam)) {
        console.log("Equipo que llega: "+name+"  Equipo estandarizado: "+estandarizarNombre(nameTeam))
        url = process.env.API_LIQUIPEDIA_URL_CS + "team?wiki=counterstrike&conditions=[[name::" + estandarizarNombre(nameTeam) + "]]"
    } else {
        console.log(name)
        url = process.env.API_LIQUIPEDIA_URL_CS + "team?wiki=counterstrike&conditions=[[name::" + name + "]]"
    }
     */
    
    url = process.env.API_LIQUIPEDIA_URL_CS + "team?wiki=counterstrike&conditions=[[name::" + name + "]]"
    //console.log(url)
    try {
        console.log(url)
        const response = await axios.get(url, { headers });
        team = response.data.result;
    } catch (err) {
        console.log("Error obteniendo equipos de la API:", err.message);
    }
    return team;
}

//FUNCION DE SI EXISTE ESE EQUIPO EN LA API SI ES ASI COGER SU ID Y ASIGNARLO EN EL UPDATE TEAM

async function insertTeams(earning, isDisband, limit) {
    const connection = new ComponentBd("localhost");

    try {
        const teams = await getTeamsApi(earning, isDisband, limit);

        for (const team of teams) {
            try {
                await connection.insert("teams", team);
            } catch (error) {
                console.log("Error insertando equipo:", error.message);
            }
        }
    } finally {
        await connection.close();
    }
}
async function updateTeams() {
    const connection = new ComponentBd("localhost");

    try {
        const teams = await connection.select("teams"); // devuelve tabla teams
        const rankings = JSON.parse(
            fs.readFileSync("../data/lastRankingValve.json", "utf-8")
        );

        console.log("Tamaño BD: " + teams.length + " | Tamaño API: " + rankings.rankings.length);

        let i = 0;

        for (const team of teams) {
            const nameTeam = estandarizarNombre(team.team_name);

            const match = rankings.rankings.find((equipoRanking) => {
                const nombreRanking = estandarizarNombre(equipoRanking.team);
                if (nombreRanking === nameTeam) {
                    console.log("MATCH!! " + nameTeam + "  " + nombreRanking)
                }
                return nombreRanking === nameTeam;
            });

            if (match) {
                // console.log(`Match: ${team.team_id}  ${match.team}`);
                try {
                    await connection.update(
                        "teams",
                        { ranking: match.rank },
                        { team_id: team.team_id }
                    );
                } catch (error) {
                    console.error(
                        `Error actualizando el equipo ${team.team_name}: ${error.message}`
                    );
                }
            }

            i++;
            if (i === 151) {
                console.log(`Equipo 151: ${team.team_name}`);
            }
        }
    } catch (err) {
        console.error("Error en updateTeams:", err.message);
    } finally {
        await connection.close();
    }
}
//FUNCION VERIFICA EQUIPOS EN EL VRS NO ESTAN EN LA BD Y SI NO ESTAN SE UPDATEA
async function updateTeam() {
    const connection = new ComponentBd("localhost");
    try {
        const teams = await connection.select("teams"); // Tabla de equipos en la BD
        const rankings = JSON.parse(
            fs.readFileSync("../data/lastRankingValve.json", "utf-8")
        );

        console.log("Tamaño BD: " + teams.length + " | Tamaño API: " + rankings.rankings.length);

        let i = 0;

        for (const equipoRanking of rankings.rankings) {
            const nombreRanking = estandarizarNombre(equipoRanking.team);

            const match = teams.find((team) => {
                const nombreTeam = estandarizarNombre(team.team_name);
                return nombreTeam === nombreRanking;
            });

            if (!match) {

                try {
                    await connection.insert("teams", {
                        team_name: equipoRanking.team,
                        team_id: i, //medida temporal
                        ranking: equipoRanking.rank
                        // Aquí puedes agregar más campos si están disponibles en el objeto equipoRanking
                    });
                    console.log(`Insertado: ${equipoRanking.team}`);
                } catch (error) {
                    console.error(`Error insertando el equipo ${equipoRanking.team}: ${error.message}`);
                }
            }

            i++;
            if (i === 151) {
                console.log(`Equipo 151 en API: ${equipoRanking.team}`);
            }
        }
    } catch (err) {
        if (err != null) {
            console.error("Error en updateTeams:", err.message);
        }
    } finally {
        await connection.close();
    }
}


// Helpers
/*function normalizarNombre(nombre) {
  return nombre
    .toLowerCase()
    .replace(/\b(gaming|esports)\b$/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}
*/

function estandarizarNombre(nombreOriginal) {
   const equivalencias = {
  // Básicos
  "Vitality": "Team Vitality",
  "FaZe": "FaZe Clan",
  "Liquid": "Team Liquid",
  "G2": "G2 Esports",
  "NAVI": "Natus Vincere",
  "Ninjas in Pyjamas": "Ninjas in Pyjamas",
  "MOUZ": "MOUZ",
  "Virtus.pro": "Virtus.pro",
  "Astralis": "Astralis",
  "Fnatic": "Fnatic",
  "ENCE": "ENCE",
  "Heroic": "Heroic",
  "FURIA": "FURIA",
  "BIG": "BIG",
  "OG": "OG Esports",
  "9INE": "9INE",
  "Aurora": "Aurora Gaming",
  "SINNERS": "SINNERS Esports",
  "Preasy": "Preasy Esport",

  // Equipos adicionales basados en el Top 50 de HLTV
  "Spirit": "Team Spirit",
  "F3LIA": "F3LIA",
  "Falcons": "Team Falcons",
  "3DMAX": "3DMAX",
  "paiN": "paiN Gaming",
  "Legacy": "Legacy",
  "GamerLegion": "GamerLegion",
  "TyLoo": "TYLOO",
  "Inner Circle": "Inner Circle",
  "SAW": "SAW",
  "MIBR": "MIBR",
  "9z": "9z Team",
  "ECSTATIC": "ECSTATIC",
  "Imperial": "Imperial Esports",
  "Sharks": "Sharks Esports",
  "Partizan": "Partizan",
  "Alliance": "Alliance",
  "Bestia": "Bestia",
  "Sangal": "Sangal",
  "RED Canids": "RED Canids",
  "Gaiming Gladiators": "Gaiming Gladiators",

  // Variaciones y nombres alternativos
  "The MongolZ": "The MongolZ",
  "Falcons Esports": "Team Falcons"
};
return equivalencias[nombreOriginal] || nombreOriginal;
}
/*
updateTeam().then(() => {
    console.log("Finalizado");
});
*/

export default getTeamApi
export {estandarizarNombre}
// Descomentar si querés insertar equipos:
// insertTeams(10000, false, 164);