// no game class, just functions

class game{
    turn : number
    wood : number
    food : number
    people : number
    constructor(){
        this.turn = 0;
        this.wood = 0;
        this.food = 0; 
        this.people = 3;
    }
    tick(wood_people : number, food_people : number){
        if(wood_people + food_people > this.people){
            throw "too many people assigned!";
        }
        this.turn++;
        this.wood += wood_people;
        this.food += food_people; 
    }
}

export default game; 