import { game_interface } from "../interfaces";
import {dist, moveTo} from "../canvasDrawing";
import _ from "lodash";

type point = [number, number]

export class game implements game_interface {
    x:number;
    y:number;
    target_x:number;
    target_y:number;
    customers :point[] = []; 
    has_drink = false;
    drink_location : point = [400, 400]; 

    time = 0;
    served = 0; 
    constructor(x : number,y : number,target_x : number,target_y : number){
        this.x=x;
        this.y=y;
        this.target_x=target_x;
        this.target_y=target_y;
       
    }
    tick(){
        this.time++; 
        [this.x, this.y]=moveTo([this.x,this.y], [this.target_x,this.target_y], 10); 
        let events : string[] = []; 
        //get drink
        if(!this.has_drink && dist([this.x,this.y], this.drink_location) < 50){
            this.has_drink = true; 
            events.push('got drink');
        }
        // randomly spawn customers on left side
        if(this.time % 100 == 20){
            this.customers.push([Math.random() * 200+100, Math.random() * 600])
        }
        // if close to customer and has drink, get rid of drink
        if(this.has_drink){
            for(let customer of this.customers){
                if(dist([this.x, this.y], customer) < 20){
                    this.has_drink = false; 
                    customer[0] = -99; 
                    customer[1] = -99;            
                    events.push('served customer');
                    this.served ++; 
                }
            }
        }
        this.customers = this.customers.filter(([x,y]) => x > 0 && y > 0); 
        return events; 
    }

}

export function make_game(){
    let lst:[number, number][] = [];
    for(let i=0; i < 10; i++){
        lst.push([Math.random() * 500, Math.random() * 500])
    }
    let g = new game(200, 200, 200, 200);
    return g; 
}
