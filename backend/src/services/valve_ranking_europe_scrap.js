import puppeteer from "puppeteer"
import fs from "fs/promises"
import fs1 from "fs"
export async function getLatestValveRanking(year, day) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const date = new Date()
    const lettermonth = date.toLocaleString("en-us", { month: "long" }).toLowerCase()

    let rankings = [];

    // Construir la URL con la fecha proporcionada
    const url = `https://www.hltv.org/valve-ranking/teams/${year}/${lettermonth}/${day}/region/Europe`;

    try {
        // Ir a la URL correspondiente
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

        // Verificar si la página contiene el ranking
        const hasRanking = await page.$(".ranked-team.standard-box");

        if (hasRanking) {
            // Obtener los datos del ranking si existe
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
        } else {
            // Si no se encuentra el ranking, lanzar un error
            throw new Error(`No se encontró el ranking en la fecha: ${year}-${month}-${day}`);
        }
    } catch (error) {
        // Manejo de errores
        console.error("Error:", error.message);
        await browser.close();
        return []; // Devuelve un arreglo vacío si no hay datos
    }

    await browser.close();

    // Devuelve los datos del ranking y la fecha consultada
    return { rankings, date: { year: year, month: date.getMonth() + 1, day: day } };
}

export async function checkRanking(path) {
    let latestData = null;
    const date = new Date()
    let itsToday = false;
    try {
        const stat = await fs.lstat(path);
        if (stat.isFile()) {
            const data = await fs.readFile(path, 'utf8'); // Lee la fecha del archivo
            const jsonDateFile = JSON.parse(data); //fecha fichero
            //console.log("Dia Fichero: " + jsonDateFile.date.day + " Mes Fichero: " + jsonDateFile.date.month + " Anio fichero: " + jsonDateFile.date.year)
            //console.log("Dia Actual: " + (date.getDay() - 1) + " Mes Actual: " + (date.getMonth() + 1) + " Anio Actual: " + date.getFullYear())
            if (jsonDateFile.date.day === (date.getDay()-1) && jsonDateFile.date.year === date.getFullYear() && jsonDateFile.date.month === (date.getMonth() + 1)) {
                itsToday = true;
            }
            console.log("ES HOY: " + itsToday)

            if (!itsToday) {
                // Sino es hoy, obtiene el ranking más reciente scrap
                latestData = await getLatestValveRanking(date.getFullYear(), date.getMonth(), date.getDay() - 1);

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
