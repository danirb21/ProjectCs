import puppeteer from "puppeteer"
import fs from "fs/promises"
import fs1 from "fs"
import axios from 'axios';
import moment from 'moment';

export async function getLatestValveRanking() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let date = new Date();
    let found = false;
    let rankings = [];
    let maxAttempts = 30;
    let year
    let month
    let day
    while (!found && maxAttempts > 0) {
        year = date.getFullYear();
        month = date.toLocaleString("en-us", { month: "long" }).toLowerCase();
        day = date.getDate();

        const url = "https://www.hltv.org/valve-ranking/teams/" + year + "/" + month + "/" + day + "/region/Europe";

        try {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

            // Verifica si la página tiene contenido (si hay ranking)
            const hasRanking = await page.$(".ranked-team.standard-box");
            let bool;

            if (hasRanking) {
                rankings = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll(".ranked-team.standard-box")).map(team => {

                        const pointsText = team.querySelector(".points")?.textContent.trim() || "Unknown";
                        const pointsMatch = pointsText.match(/\d+/);
                        const ranking = team.querySelector(".position.wide-position")?.textContent.trim() || "Unknown";
                        const ranking1 = ranking.substring(1);

                        return {
                            rank: ranking1,
                            team: team.querySelector(".name")?.textContent.trim() || "Unknown",
                            points: pointsMatch ? pointsMatch[0] : "Unknown",
                            region: team.querySelector(".region")?.textContent.trim() || "Unknown"
                        };
                    });
                });

                found = true;
            } else {
                console.log(" No hay ranking en: " + url + ", probando con un día antes...");
                date.setDate(date.getDate() - 1);
                maxAttempts--;
            }
        } catch (error) {
            console.error(" Error al acceder a " + url + ":", error);
            date.setDate(date.getDate() - 1);
            maxAttempts--;
        }
    }

    await browser.close();

    if (!found) {
        console.log(" No se encontró un ranking en los últimos 30 días.");
        return [];
    }

    return { rankings, date: { year: year, month: month, day: day } };
}


async function isHltvHaveRanking(year, day, month) {
    const date = new Date();
    //sino es el mismo dia
    if (day - 1 !== date.getDay() - 1) {
        try {

            const url = `https://www.hltv.org/valve-ranking/teams/${year}/${month}/${day}/region/Europe`;

            const browser = await puppeteer.launch({ headless: false });

            const page = await browser.newPage();


            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 60000,
            });

            const rankingExists = await page.$('div.ranking') !== null;

            if (!rankingExists) {
                await browser.close();
                return false;
            }

            await browser.close();
            return true;

        } catch (error) {
            console.error("Error al intentar obtener el ranking:", error);
            return false;
        }
    } else {
        return false;
    }
}


export async function checkRanking(path) {
    let latestData = null;
    try {
        const stat = await fs.lstat(path);
        if (stat.isFile()) {
            const data = await fs.readFile(path, 'utf8'); // Lee la fecha del archivo
            const jsonData = JSON.parse(data); //fecha fichero

            const rankingExists = await isHltvHaveRanking(jsonData.date.year, (jsonData.date.day) + 1, jsonData.date.month);
            console.log("EXISTE: " + rankingExists)

            if (rankingExists) {
                // Si el ranking existe, obtiene el ranking más reciente scrap
                latestData = await getLatestValveRanking();
                
                // Escribe el nuevo ranking en el archivo
                await printLatestRankingValveJson(latestData, path);
            } else {
                latestData = JSON.parse(fs1.readFileSync(path));
            }
        }
    } catch (err) {
        console.log("Error al procesar el ranking:", err);
    }
    return latestData;
}

async function printLatestRankingValveJson(data, path) {
    try {
        await fs.writeFile(path, JSON.stringify(data));
        console.log('Ranking actualizado correctamente.');
    } catch (err) {
        console.log("Error al escribir el archivo:", err);
    }
}



export default checkRanking
export { printLatestRankingValveJson }
