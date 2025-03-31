 class Event{
    event_id
    event_name
    prize_pool
    lan //boolean
    constructor(id, name, prize_pool, lan){
        this.event_id=id;
        this.event_name=name;
        this.prize_pool=prize_pool;
        this.lan=lan;
    }
}
module.exports=Event;