class Match{
    id
    startTime
    event_id
    team1_id
    team2_id
    winning_team_id
    constructor(id, startTime, event_id, team1_id, team2_id, winning_team_id){
        this.id=id;
        this.startTime=startTime;
        this.event_id=event_id;
        this.team1_id=team1_id;
        this.team2_id=team2_id;
        this.winning_team_id=winning_team_id;

    }

}
module.exports=Match;