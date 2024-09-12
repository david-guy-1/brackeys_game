import { game_interface, gamedata } from "../interfaces";
import {dist, moveTo} from "../canvasDrawing";
import _ from "lodash";

type point = [number, number]

export class wolf {
    pos:point;
    prev_pos : point; 
    target:point;
    next_change : number
    constructor(pos : point,target : point, next_change : number){
        this.pos=pos;
        this.prev_pos = pos; 
        this.target=target;
        this.next_change = next_change;
    }
}

export class game implements game_interface {
    x:number;
    y:number;
    target_x:number;
    target_y:number;

    res : point[] = []; 
    collect : boolean[] = []; 

    time = 0;
    served = 0; 
    limit = 0;
    wolves : wolf[]; 
    last_hit_time = -99999; 
    constructor(x : number,y : number,target_x : number,target_y : number, res : point[], limit : number){
        this.x=x;
        this.y=y;
        this.target_x=target_x;
        this.target_y=target_y;
        this.res = res; 
        this.collect = res.map(x => false); 
        this.limit = limit; 
        this.wolves= []; 
    }
    tick(){
        console.log([this.time , this.last_hit_time, this.time - this.last_hit_time > 5] );
        this.time++; 
        //if not stunned by wolf
        if(this.time - this.last_hit_time > 30){
            [this.x, this.y]=moveTo([this.x,this.y], [this.target_x,this.target_y], 10); 
        }
        let events : number[] = []; 
        for(let i=0; i<this.res.length; i++){
            if(this.collect[i]) {
                continue;
            }
            let r = this.res[i]; 
            if(dist(r, [this.x, this.y]) < 20){
                events.push(i);
                this.collect[i] = true; 
            }
        }
        // for each wolf , move it towards a random point or the player; 
        let close_exemption = false; 
        for(let wolf of this.wolves){
            let close_to_another_wolf = (p : point ) => this.wolves.map(x => dist(x.pos, p) < 30).reduce((x, y) => y ? x+1 : x, 0);
            
            if(dist(wolf.pos, [this.x,this.y]) < 10 && this.time - this.last_hit_time > 60){
                // hit!
                this.last_hit_time = this.time; 
            }
            let target : point = wolf.target;
            // avoid wolves too close to each other
            if(dist(wolf.pos, [this.x,this.y]) < 200){
                if(close_to_another_wolf(wolf.pos)){
                    if(close_exemption == false){
                        close_exemption = true;
                        target = [this.x, this.y]; 
                    }
                }
            }
            wolf.prev_pos = wolf.pos; 
            wolf.pos = moveTo(wolf.pos, target, 5) as point; 
            // wolf random point change
            if(this.time >= wolf.next_change){
                wolf.next_change = this.time + Math.random() * 6 + 30; 
                wolf.target = [Math.random() * 600,Math.random() * 600]; 
            }

        }
        return events; 
    }
    valid_res(){
        return _.range(this.res.length).filter(x => !this.collect[x]).map(x => this.res[x]);
    }
}

export function make_game(){
    let lst:[number, number][] = [];
    for(let i=0; i < 10; i++){
        lst.push([Math.random() * 500, Math.random() * 500])
    }
    let g = new game(200, 200, 200, 200, lst, 400);
    return g; 
}


