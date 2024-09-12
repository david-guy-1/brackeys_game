import { useContext, useState } from 'react'
import GameDisplay from '../GameDisplay'
import { events, set_events } from '../EventManager'
import React from 'react';
import game_data from "./GameFunctions";
import collect_data from "./CollectFunctions";
import { gamedata } from '../interfaces';
import { game, helper, make_game } from './game';
import { game as collect_game, make_game  as make_collect_game, wolf} from './collect';
import upgrades_dag from './upgrades';


// App, game and GameFunctions (and other optional files) are only non-boilerplate code 

let g : game | undefined = undefined; 
let c : collect_game | undefined = undefined; 


let level = 0; 
let upgrades : Record<string, boolean> = {}; 
let res_count = 0; //amount of wood
let money =1110; // amount of money; 

// plans
let helpers = 0;
let helper_speed = 0;
let cost_per_drink = 0;
let screen_trans = true; 



let mode = "plan"
function App() {
  
  const [count, setCount] = useState<string>(mode)
  const [message, setMessage] = useState<string>("")
  set_events() 

  events["keyup pause"] = [function(e : KeyboardEvent) { if(e.key == "p" || e.key == "P"){setCount("paused")} }, undefined]


  
  function finish_plan(){
    let ids : string[] = ["helper count", "helper speed", "cost"];
    let vals : number[] = []; 
    for(let item of ids){
      if(document.getElementById(item) == null ){
        setMessage("invalid input for " + item)
        return false;
      }
      let v = parseInt((document.getElementById(item)  as HTMLInputElement).value);
      if(isNaN(v)){
        setMessage("invalid input for " + item)
        return false;
      }
      if(v < 0){
        setMessage("invalid input for " + item)
        return false; 
      }
      vals.push(v); 
    }
    //cost per drink limit
    if(vals[2] > 30){
      setMessage("cost per drink is limited at 30")
      return false; 
    }
    [helpers, helper_speed, cost_per_drink]  = vals; 
    // charge money for helpers 
    let helper_cost = compute_helper_cost(helpers, helper_speed, upgrades, level); 
    if(helper_cost > money){
      setMessage("not enough money");
      return false; 
    }
    money -= helper_cost; 
    setMessage("");
    
    return true; 
  
  }

  function compute_serve_delay(upgrades : Record<string, boolean>, price : number, level : number){
    // smaller is better
    let base =  30 + 2*level;
    if(upgrades["more advertising"]){
      base -= 10; 
    }
    let price_factor = Math.pow(2, price/5) ;
    if(price_factor < 1){
      price_factor = 1; 
    }
    return base*price_factor;
  }
  function compute_helper_cost(helpers : number,  speed : number , upgrades : Record<string, boolean> , level : number){
    let cost = 10 + speed/10;
    if(upgrades["cheaper helpers"]){
        cost -= 1;   
    }
    if(upgrades["cheaper helpers 2"]){
        cost -= 1;   
    }
    return cost * helpers; 
}


  console.log(mode);
  return (
    <>
          {function(){ 
            switch(count){
              case "game":
                
                if(g == undefined){
                  g = make_game();
                  g.limit = 10; 
                  g.serve_delay = compute_serve_delay(upgrades, cost_per_drink,level );
                  for(let i=0; i < helpers; i++){
                    g.helpers.push(new helper(400, 400, helper_speed));
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
                  ${money} , {res_count} wood<br />
                    <input type="text" id="helper count" defaultValue={1}/>Number of helpers<br />
                    <input type="text" id="helper speed" defaultValue={10}/>Helper speed<br />
                    <input type="text" id="cost" defaultValue={10}/>Cost per drink (max 30)<br />
                    <button onClick={() =>{if(finish_plan()){  setCount("win")}}}> Start</button>
                    {message}
                  </>
              case "collect":
                if(c == undefined){
                  c = make_collect_game();
                  c.limit = 10;
                  for(let i=0; i<5; i++){
                    let p : [number, number] = [Math.random( ) * 600, Math.random( ) * 600];
                    let q : [number, number] = [Math.random( ) * 600, Math.random( ) * 600];

                    c.wolves.push(new wolf(p, q, 20 + Math.random() * 6)); 
                  }
                  g = undefined;
                } 

                {
                  
                  let data2 : gamedata = Object.assign({}, collect_data); 
                  data2.g = c;
                  data2.prop_fns["pause"] = () => setCount("paused");
                  data2.prop_fns["win"] = () => {setCount("win")};
                  return <GameDisplay {...data2} />
                }
              case "upgrade":
                console.log(upgrades_dag);
                let available_upgrades = upgrades_dag.get_exposed_vertices(new Set(Object.keys(upgrades).filter(x => upgrades[x])));
                console.log(available_upgrades);
                return <>
                  Upgrade something; <br />
                  {
                    [...available_upgrades].map(x => <>{x} <button onClick={function(this:string){upgrades[this] = true;setMessage(this + " : upgrade gotten")}.bind(x)}>Get</button><br /></>)
                  }
                  <br /><button onClick={() => setCount("win")}>Continue</button><br />
                  {message}
                </>
              case "paused":
                return <>game is a thing;
                <button onClick={() =>{ setMessage("");setCount("game")}}>resume</button></>

              case "win":
                if(screen_trans){
                  screen_trans = false; 
                  if(mode == "game" && g){
                    let extra_money =  g.served * cost_per_drink;
                    money += extra_money; 
                    setMessage("you earned $" + extra_money + ", you now have $" + money);
                  }
                  if(mode == "collect"&& c){
                      let extra_res = c.collect.reduce((x, y) => y ? x+1 : x, 0); 
                      res_count += extra_res; 
                      setMessage(`you colelcted ${extra_res} wood, you now have ${res_count} wood`); 
                    level++; 
                  }
                  
                  mode = {'game' :'collect', "collect" : 'upgrade', 'upgrade': 'plan', "plan": "game"}[mode] ?? "";
                  
                }
                setTimeout(() => {setMessage(""); setCount(mode); screen_trans = true; }, 1000);
                return <>{{"collect" : "Time to get resources" ,"game": "Time to serve customers","plan":"time to plan", "upgrade":"time to get upgrades"}[mode]}<br />{message}</>; 
            }


          }()}
    </>
  )
}

export default App
