 class Event{
    id
    name
    prize_pool
    lan //boolean
    constructor(id, name, prize_pool, lan){
        this.id=id;
        this.name=name;
        this.prize_pool=prize_pool;
        this.lan=lan;
    }
}
module.exports=Event;