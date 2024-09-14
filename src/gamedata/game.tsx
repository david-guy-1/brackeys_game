import { game_interface, gamedata } from "../interfaces";
import {choice, dist, moveTo} from "../canvasDrawing";
import _ from "lodash";

type point = [number, number]

class customer {
    x:number;
    y:number;
    t : number
    active : boolean = true; 
    constructor(x : number,y : number,t : number){
        this.x=x;
        this.y=y;
        this.t = t; 
    }
    
}

export class helper {
    x:number;
    y:number;
    target:customer | undefined;
    speed:number;  
    has_drink : boolean; 

    constructor(x : number,y : number,speed : number,target ?: customer){
        this.x=x;
        this.y=y;
        this.target=target;
        this.speed=speed;
        this.has_drink = false; 
    }
}

export class game implements game_interface {
    x:number;
    y:number;
    target_x:number;
    target_y:number;
    serve_delay : number = 100; 
    customers :customer[] = []; 
    helpers : helper[] = []; 
    has_drink = false;
    drink_location : point = [400, 400]; 
    limit : number; 
    time = 0;
    served = 0; 
    player_speed = 10;
    skip_customers = 0; 
    constructor(x : number,y : number,target_x : number,target_y : number, limit : number){
        this.x=x;
        this.y=y;
        this.target_x=target_x;
        this.target_y=target_y;
        this.limit = limit;
    }
    tick(){
        this.time++; 
        [this.x, this.y]=moveTo([this.x,this.y], [this.target_x,this.target_y], this.player_speed); 
        let events : string[] = []; 
        //get drink
        if(!this.has_drink && dist([this.x,this.y], this.drink_location) < 50){
            this.has_drink = true; 
            events.push('got drink');
        }
        // randomly spawn customers on left side
        if(this.time % this.serve_delay == 0){
            if(this.skip_customers > 0){
                this.skip_customers -= 1; 
            } else { 
                this.customers.push(new customer(Math.random() * 200+100, Math.random() * 600, this.time))
            }
        }
        // if close to customer and has drink, get rid of drink
        if(this.has_drink){
            for(let customer of this.customers){
                if(dist([this.x, this.y], [customer.x, customer.y]) < 20){
                    this.has_drink = false; 
                    customer.active = false;          
                    events.push('served customer');
                    this.served ++; 
                }
            }
        }
        // helpers logic
        for(let helper of this.helpers){
            let target : point = [helper.x, helper.y]
            if(!helper.has_drink){
                target = this.drink_location;
            } else {
                // choose a customer
                if(helper.target && helper.target.active){
                    target =[ helper.target.x, helper.target.y];
                } else  { // no current target, choose one
                    if(this.customers.length > 0){
                        helper.target = choice(this.customers); 
                    }
                }
            }

            // close to drink
            if(!helper.has_drink && dist([helper.x, helper.y], this.drink_location) < 10){
                helper.has_drink = true;
            }
            if(helper.has_drink && helper.target && helper.target.active && dist([helper.x, helper.y], [helper.target.x, helper.target.y]) < 10 ){
                events.push("helper served customer");
                helper.has_drink = false; 
                helper.target.active = false;          
                this.served ++; 
            } 
            // move towards target
            [helper.x, helper.y] = moveTo([helper.x, helper.y], target, helper.speed); 
        }
        // customer waited for too long
        for(let c of this.customers){
            let waiting_time = this.time - c.t;
            if(waiting_time > 200){
                c.active = false; 
                this.skip_customers ++; 
            }
        }
        this.customers = this.customers.filter(c => c.active ); 
        return events; 
    }

}

export function make_game(){
    let lst:[number, number][] = [];
    for(let i=0; i < 10; i++){
        lst.push([Math.random() * 500, Math.random() * 500])
    }
    let g = new game(200, 200, 200, 200, 0);
    return g; 
}


