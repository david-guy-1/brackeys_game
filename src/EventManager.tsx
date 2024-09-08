type eventCall = [(e : any, lst : any ) => any , any]

// register events by putting things in this :
// strings must have mousemove, click, keydown, or keyup in them. 
export let events : Record<string, eventCall> = {};


export let globalStore : Record<string, any> = {};

export function call_mousemove(e : MouseEvent){
    for(let item of Object.keys(events)){
        if(item.indexOf("mousemove") != -1){
            let [fn, params] = events[item];
            fn(e, params); 
        }
    }
}

export function call_click(e : MouseEvent){
    for(let item of Object.keys(events)){
        if(item.indexOf("click") != -1){
            let [fn, params] = events[item];
            fn(e, params); 
        }
    }
}
export function call_keydown(e : KeyboardEvent){
    for(let item of Object.keys(events)){
        if(item.indexOf("keydown") != -1){
            let [fn, params] = events[item];
            fn(e, params); 
        }
    }
}
export function call_keyup(e : KeyboardEvent){
    for(let item of Object.keys(events)){
        if(item.indexOf("keyup") != -1){
            let [fn, params] = events[item];
            fn(e, params); 
        }
    }
}

// call this once
let added = false; 
export function set_events() {
    if(added == false){
        document.addEventListener("mousemove", (e) => call_mousemove(e));
        document.addEventListener("click", (e) => call_click(e));
        document.addEventListener("keydown", (e) => call_keydown(e));
        document.addEventListener("keyup", (e) => call_keyup(e));
    } 
    added = true;
}