import { game_interface, gamedata } from "../interfaces";
import {dist, moveTo} from "../canvasDrawing";
import _ from "lodash";

type point = [number, number]

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
    constructor(x : number,y : number,target_x : number,target_y : number, res : point[], limit : number){
        this.x=x;
        this.y=y;
        this.target_x=target_x;
        this.target_y=target_y;
        this.res = res; 
        this.collect = res.map(x => false); 
        this.limit = limit; 
    }
    tick(){
        //console.log(this.res);
        this.time++; 
        [this.x, this.y]=moveTo([this.x,this.y], [this.target_x,this.target_y], 10); 

        let events : number[] = []; 
        //get drink
        for(let i=0; i<this.res.length; i++){
            if(this.collect[i]) {
                continue;
            }
            let r = this.res[i]; 
            if(dist(r, [this.x, this.y]) < 10){
                events.push(i);
                this.collect[i] = true; 
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


