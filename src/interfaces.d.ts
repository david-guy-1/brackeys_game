import { animation } from "./animations";


type events_type =  any 

interface game_interface{ // just the model
    tick : () => events_type,
}
type make_game_type = () => game_interface; 

type rect = [number, number, number, number]

type display_type = {
    "canvas" : [string, rect][]
    "button" : [string, rect, string, string?][] // third arg is text to display, fourth is image on button
    "image" : [string, number, number][] // images are displayed under all buttons and canvases  
}

type props_to_run = [string, any][]

type draw_fn_type = (g : any, events : events_type[] , canvas : string) => draw_command[];
type anim_fn_type = (g : any, events : events_type[] ) => animation[];
type sound_fn_type = (g : any, events : events_type[] ) => [string | undefined, string[]]; // undefined = do not change, "mute" : nothing 
type prop_commands_type = (g : any) => props_to_run; 
type button_click_type = (g : any, name : string) => props_to_run; 
type reset_fn_type = () => any; 

type add_event_listeners_type = (g : any) => any; 

type gamedata = {g ?: game_interface,draw_fn : draw_fn_type, anim_fn : anim_fn_type, sound_fn : sound_fn_type, add_event_listeners : add_event_listeners_type, button_click : button_click_type, prop_commands : prop_commands_type, display : display_type, reset_fn : reset_fn_type , prop_fns : Record<string, (g : any, s : any) => any > }
/*
 top left, top right, width, height
*/

