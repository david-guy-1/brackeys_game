import _ from "lodash";
import { animation } from "../animations";
import {game} from "./collect";

import star from "./star_anim";
import { anim_fn_type, display_type, draw_fn_type, gamedata, sound_fn_type } from "../interfaces";
import { events } from "../EventManager";
import { toggleMute } from "../Sound";
import { useContext } from "react";
import { drawCircle, drawRectangle, drawText } from "../canvasDrawing";


type event = number[] 

let orig_disp = ` {"canvas" : [["topleft", [0, 0, 50, 50]], ["display",[ 50, 10, 600, 600 ]],["anims",[ 50, 10, 600, 600 ]]],
    "button" : [["pause", [0, 620, 55, 25], "PAUSE"], ["mute", [100, 620, 55, 25], "MUTE"]],
    "image" : [["bg.png", 50, 10]]}`

 let display : display_type = JSON.parse(orig_disp); 


 function reset_fn(){
    display = JSON.parse(orig_disp); 
}

 function add_event_listeners(g : game) {
    events["mousemove mover" ] = [function(e : MouseEvent, g : game){
        g.target_x = e.offsetX;
        g.target_y = e.offsetY; 
    }, g]

    events["keyup mute" ] = [function(e : KeyboardEvent) { if(e.key == "m" || e.key == "M"){toggleMute()} }, undefined];

}


 const  draw_fn : draw_fn_type = function(g :game, e : event[], canvas : string = "") {
    let draws : draw_command[] = [];
    if(canvas == "display"){
        draws.push({type:"drawImage", "x":0, "y":0, "img" : "bssets/tileSet.png"})
        //player
    
        draws.push({type:"drawImage", x : g.x-20, y : g.y-20, img : "player.png"});
        // res
        for(let res of g.valid_res()){
            draws.push({type:"drawImage", x : res[0]-20, y : res[1]-20, img : "res.png"});
        }       
        //timer
        draws.push({type:"drawRectangle", tlx:0, tly:0, brx : 600 * (g.time/g.limit), bry:10, fill:true,color:"red"}) ;
        //wolves
        for(let wolf of g.wolves){
            let [x,y] = wolf.pos;
            draws.push({type:"drawImage", x : x-20, y : y-20, img:"wolf.png"});

        }
    }
    if(canvas == "topleft"){
        draws.push({type:"drawText", x : 10, y : 30, text_ : g.served.toString()})
    }
    return draws; 
}

 const  anim_fn : anim_fn_type = function(g :game, e : event[])  {
    return [] as animation[]; 
}
 const  sound_fn : sound_fn_type = function(g :game, e : event[])  {
    return [undefined, []];
}


// button presses and game's prop_commands function) such as mouse and key presses return a list of pairs of strings ([s1, t1], ..., [sn , tn])

// For each i, if si is not "rerender", then GameDisplay calls props[si], with the game as the first arg,a and ti as the second arg 
// if si is "rerender", then GameDisplay re-renders. This is necessary if you change the display variable 
// if si is "reset", then reset is called, which should clear everything



 function prop_commands(g : game) : [string, any][]{
    if(g.time > g.limit){
        return [["win", []]]
    }
    if(_.every(g.collect)){
        return [["win", []]]; 
    }
    return []
}


 function button_click( g : game, name : string): [string, string][]{
    if(name == "mute"){
        toggleMute();
    }
    if(name == "pause"){
        return [["pause",""]] as [string, string][]
    }
    return [];
}
let x : gamedata = {
    draw_fn:draw_fn,
    anim_fn:anim_fn,
    sound_fn:sound_fn,
    add_event_listeners:add_event_listeners,
    button_click:button_click,
    prop_commands:prop_commands,
    display:display,
    reset_fn:reset_fn,
    prop_fns:{}
}

export default x