import { useContext, useState } from 'react'
import GameDisplay from '../GameDisplay'
import { events, set_events } from '../EventManager'
import React from 'react';
import game_data from "./GameFunctions";
import collect_data from "./CollectFunctions";
import { gamedata } from '../interfaces';
import { game, make_game } from './game';
import { game as collect_game, make_game  as make_collect_game} from './collect';

// App, game and GameFunctions (and other optional files) are only non-boilerplate code 

let g : game | undefined = undefined; 
let c : collect_game | undefined = undefined; 

let level = 0; 
let mode = "collect"
function App() {
  const [count, setCount] = useState<string>(mode)
  set_events() 

  events["keyup pause"] = [function(e : KeyboardEvent) { if(e.key == "p" || e.key == "P"){setCount("paused")} }, undefined]


  return (
    <>
          {function(){ 
            switch(count){
              case "game":
                
                if(g == undefined){
                  g = make_game();
                  c = undefined;
                } 
              

                {
                  let data2 : gamedata = Object.assign({}, game_data); 
                  data2.g = g;
                  data2.prop_fns["pause"] = () => setCount("paused");
                  data2.prop_fns["win"] = () => {setCount("win")};
                  return <GameDisplay {...data2}/> ;
                }

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
                  level++; 
                }
                mode = (mode == 'game' ? 'collect' : 'game');
                setTimeout(() => setCount(mode), 1000);
                return mode == "collect" ? "Time to get resources" : "Time to serve customers"; 
            }


          }()}
    </>
  )
}

export default App
