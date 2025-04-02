const puppeteer = require("puppeteer");

async function getLatestValveRanking() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    let date = new Date();
    let found = false;
    let rankings = [];
    let maxAttempts = 30;

    while (!found && maxAttempts > 0) {
        let year = date.getFullYear();
        let month = date.toLocaleString("en-us", { month: "long" }).toLowerCase();
        let day = date.getDate();

        const url = "https://www.hltv.org/valve-ranking/teams/" + year + "/" + month + "/" + day + "/region/Europe";
        //console.log("🔍 Probando con la URL: " + url);

        try {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });

            // Verificar si la página tiene contenido (si hay ranking)
            const hasRanking = await page.$(".ranked-team.standard-box");

            if (hasRanking) {
                console.log("✅ Encontrado ranking en: " + url);
                rankings = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll(".ranked-team.standard-box")).map(team => {
                        // Extraemos el texto que contiene los puntos, y luego extraemos el número
                        const pointsText = team.querySelector(".points")?.textContent.trim() || "Unknown";
                        const pointsMatch = pointsText.match(/\d+/); 

                        return {
                            rank: team.querySelector(".position.wide-position")?.textContent.trim(),
                            team: team.querySelector(".name")?.textContent.trim() || "Unknown",
                            points: pointsMatch ? pointsMatch[0] : "Unknown", 
                            region: team.querySelector(".region")?.textContent.trim() || "Unknown"
                        };
                    });
                });

                found = true; 
            } else {
                console.log("❌ No hay ranking en: " + url + ", probando con un día antes...");
                date.setDate(date.getDate() - 1);
                maxAttempts--; 
            }
        } catch (error) {
            console.error("❌ Error al acceder a " + url + ":", error);
            date.setDate(date.getDate() - 1); 
            maxAttempts--; 
        }
    }

    await browser.close();

    if (!found) {
         console.log("🚨 No se encontró un ranking en los últimos 30 días.");
        return [];
    }

    return rankings;
}
// Ejecutar la función
/*
 getLatestValveRanking().then(data => console.log(data))
    //.then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(console.error);
*/

module.exports={getLatestValveRanking};
