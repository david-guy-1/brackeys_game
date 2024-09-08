import _ from "lodash";
import { animation } from "../animations";
import {game} from "./game";

import star from "./star_anim";
import { anim_fn_type, draw_fn_type, sound_fn_type } from "../interfaces";
import { events } from "../EventManager";
import { toggleMute } from "../Sound";
import { useContext } from "react";
import { drawCircle, drawText } from "../canvasDrawing";


type event = number[] 

let orig_disp = ` {"canvas" : [["topleft", [0, 0, 50, 50]], ["display",[ 50, 10, 600, 600 ]],["anims",[ 50, 10, 600, 600 ]]],
    "button" : [["pause", [0, 620, 55, 25], "PAUSE"], ["mute", [100, 620, 55, 25], "MUTE"]],
    "image" : [["bg.png", 50, 10]]}`

export let display : display_type = JSON.parse(orig_disp); 


export function reset_fn(){
    display = JSON.parse(orig_disp); 
}

export function add_event_listeners(g : game) {
    events["mousemove mover" ] = [function(e : MouseEvent, g : game){
        g.target_x = e.offsetX;
        g.target_y = e.offsetY; 
    }, g]

    events["keyup mute" ] = [function(e : KeyboardEvent) { if(e.key == "m" || e.key == "M"){toggleMute()} }, undefined];

}


export const  draw_fn : draw_fn_type = function(g :game, e : event[], canvas : string = "") {

    let draws : draw_command[] = [];
    if(canvas == "display"){
        draws.push({type:"drawImage", x : g.x-20, y : g.y-20, img : "player.png"});
        for(let customer of g.customers){
            draws.push({type:"drawImage", x : customer[0]-20, y : customer[1]-20, img : "person.png"});
        }
        if(g.has_drink){
            draws.push({type:"drawImage", x : g.x-20, y : g.y-20, img : "drink.png"});
        }
        draws.push({type:"drawCircle", x : g.drink_location[0],y :g.drink_location[1], r:3, fill:true, color:'red'})
        
    }
    if(canvas == "topleft"){
        draws.push({type:"drawText", x : 10, y : 30, text_ : g.served.toString()})
    }
    return draws; 
}

export const  anim_fn : anim_fn_type = function(g :game, e : event[])  {
    return []; 
}
export const  sound_fn : sound_fn_type = function(g :game, e : event[])  {
    return [undefined, []];
}


// button presses and game's prop_commands function) such as mouse and key presses return a list of pairs of strings ([s1, t1], ..., [sn , tn])

// For each i, if si is not "rerender", then GameDisplay calls props[si], with the game as the first arg,a and ti as the second arg 
// if si is "rerender", then GameDisplay re-renders. This is necessary if you change the display variable 
// if si is "reset", then reset is called, which should clear everything


export function prop_commands(g : game) : [string, string][]{
    return []
}


export function button_click(name : string, g : game): [string, string][]{
    if(name == "mute"){
        toggleMute();
    }
    if(name == "pause"){
        return [["pause",""]] as [string, string][]
    }
    return [];
}
