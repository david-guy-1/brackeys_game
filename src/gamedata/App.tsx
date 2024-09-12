import { useContext, useState } from 'react'
import GameDisplay from '../GameDisplay'
import { events, set_events } from '../EventManager'
import React from 'react';
import game_data from "./GameFunctions";
import collect_data from "./CollectFunctions";
import { gamedata } from '../interfaces';
import { game, helper, make_game } from './game';
import { game as collect_game, make_game  as make_collect_game} from './collect';

// App, game and GameFunctions (and other optional files) are only non-boilerplate code 

let g : game | undefined = undefined; 
let c : collect_game | undefined = undefined; 

let helpers_val :Record<string, number>= {}

let level = 0; 
let res_count = 0; 
let mode = "plan"
function App() {
  const [count, setCount] = useState<string>(mode)
  const [message, setMessage] = useState<string>("")
  set_events() 

  events["keyup pause"] = [function(e : KeyboardEvent) { if(e.key == "p" || e.key == "P"){setCount("paused")} }, undefined]

  function verify_vals(){
    let count = parseInt((document.getElementById("helper_count") as HTMLInputElement).value ?? " " );
    let speed = parseInt((document.getElementById("helper_speed") as HTMLInputElement).value ?? " ") ;
    if(isNaN(count) || isNaN(speed)){
      setMessage("invalid input");
      return false; 
    }
    setMessage("");
    helpers_val["count"] = count; 
    helpers_val["speed"] = speed; 
    return true; 

  }
  return (
    <>
          {function(){ 
            switch(count){
              case "game":
                
                if(g == undefined){
                  g = make_game();
                  for(let i=0; i < helpers_val["count"]; i++){
                    console.log(helpers_val["speed"]);
                    g.helpers.push(new helper(400, 400, helpers_val["speed"]));
                  }
                  c = undefined;
                } 
              

                {
                  let data2 : gamedata = Object.assign({}, game_data); 
                  data2.g = g;
                  data2.prop_fns["pause"] = () => setCount("paused");
                  data2.prop_fns["win"] = () => {setCount("win")};
                  return <GameDisplay {...data2}/> ;
                }
              case "plan":
                  return <>
                  {res_count}
                    <input type="text" id="helper_count" defaultValue={1}/>Number of helpers<br />
                    <input type="text" id="helper_speed" defaultValue={10}/>Helper speed<br />
                    <button onClick={() =>{verify_vals(); setCount("win")}}> Start</button>
                    {message}
                  </>
              case "collect":
                if(c == undefined){
                  c = make_collect_game();
                  g = undefined;
                } 

                {
                  let data2 : gamedata = Object.assign({}, collect_data); 
                  data2.g = c;
                  data2.prop_fns["pause"] = () => setCount("paused");
                  data2.prop_fns["win"] = () => {setCount("win")};
                  return <GameDisplay {...data2} />
                }
              case "paused":
                return <>game is a thing;
                <button onClick={() => setCount("game")}>resume</button></>

              case "win":
                if(mode == "collect"){
                  if(c){
                    res_count += c.collect.reduce((x, y) => y ? x+1 : x, 0); 
                  }
                  level++; 
                }
                mode = {'game' :'collect', "collect" : 'plan', "plan": "game"}[mode] ?? "";
                setTimeout(() => setCount(mode), 1000);
                return {"collect" : "Time to get resources" ,"game": "Time to serve customers","plan":"time to plan"}[mode]; 
            }


          }()}
    </>
  )
}

export default App
