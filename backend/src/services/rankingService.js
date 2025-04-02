const { calculateRegionalStandings } = require("../../counter-strike_regional_standings/model/main");
const db = require("../database/bdComponent.js");

async function updateRankings() {
    console.log("Actualizando ranking de Valve...");

    try {
        
        const [teams] = await db.query("SELECT * FROM equipos");

        // Preparar los datos para la función de Valve
        const rankingData = teams.map(team => ({
            team_id: team.id,
            team_name: team.name,
            points: team.points,
            events: [] // Aquí podrías incluir eventos pasados
        }));

        // Calcular el ranking usando el código de Valve
        const updatedRankings = calculateRegionalStandings(rankingData);

        // Guardar el ranking actualizado en la BD
        for (const team of updatedRankings) {
            await db.query(
                "UPDATE equipos SET ranking = ? WHERE id = ?",
                [team.points, team.team_id]
            );
        }

        console.log("Ranking actualizado correctamente.");
    } catch (error) {
        console.error("Error actualizando ranking:", error);
    }
}

module.exports = { updateRankings };
