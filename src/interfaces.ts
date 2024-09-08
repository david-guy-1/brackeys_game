import { animation } from "./animations";

export type events_type =  any 

export interface game_interface{ // just the model
    tick : () => events_type,
}



export type draw_fn_type = (g : any, events : events_type[] , canvas : string) => draw_command[];
export type anim_fn_type = (g : any, events : events_type[] ) => animation[];
export type sound_fn_type = (g : any, events : events_type[] ) => [string | undefined, string[]]; // undefined = do not change, "mute" : nothing 


