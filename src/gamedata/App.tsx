import { useContext, useState } from 'react'
import GameDisplay from '../GameDisplay'
import { events, set_events } from '../EventManager'
import React from 'react';
import game_data from "./GameFunctions";
import collect_data from "./CollectFunctions";
import { gamedata } from '../interfaces';
import { game, helper, make_game } from './game';
import { game as collect_game, make_game  as make_collect_game, wolf} from './collect';
import {upgrades_dag, upgrade_costs} from './upgrades';


// App, game and GameFunctions (and other optional files) are only non-boilerplate code 

let g : game | undefined = undefined; 
let c : collect_game | undefined = undefined; 


let level = 0; 
let day_limit = 10; 
let upgrades : Record<string, boolean> = {}; 
let res_count = 0; //amount of wood
let money =0; // amount of money; 

// plans
let helpers = 0;
let cost_per_drink = 0;
let screen_trans = true; 


let serve_duration = 500;
let collect_duration = 250; 

let mode = "plan"
function App() {
  
  const [count, setCount] = useState<string>(mode)
  const [message, setMessage] = useState<string>("")
  set_events() 

  events["keyup pause"] = [function(e : KeyboardEvent) { if(e.key == "p" || e.key == "P"){setCount("paused")} }, undefined]


  
  function check_cost() : string | [number, number]{
    let ids : string[] = ["helper count", "cost"];
    let vals : number[] = []; 
    for(let item of ids){
      if(document.getElementById(item) == null ){
        return "invalid input for " + item
      }
      let v = parseInt((document.getElementById(item)  as HTMLInputElement).value);
      if(isNaN(v)){
        return "invalid input for " + item;
      }
      if(v < 0){
        return "invalid input for " + item; 
      }
      vals.push(v); 
    }
    //cost per drink limit
    if(vals[1] > 30){
      return "cost per drink is limited at 30"; 
    }
    if(vals[0] > compute_helper_count(upgrades)){
      return "Too many helpers"
    }
    [helpers, cost_per_drink]  = vals; 
    // charge money for helpers 
    let helper_cost = compute_helper_cost(helpers, upgrades, level); 
    
    return [Math.round(helper_cost), compute_serve_delay(upgrades, vals[1], level ) ]; 
  
  }

  function compute_serve_delay(upgrades : Record<string, boolean>, price : number, level : number){
    // smaller is better
    let base =  10 - 0.8*level;
    if(upgrades["more advertising"]){
      base *= 0.8; 
    }
    let price_factor = Math.pow(2, price/5) ;
    if(price_factor < 1){
      price_factor = 1; 
    }
    return Math.floor(base*price_factor);
  }
  function compute_helper_cost(helpers : number, upgrades : Record<string, boolean> , level : number){
    let cost = 10 ;
    if(upgrades["cheaper helpers"]){
        cost -= 1;   
    }
    if(upgrades["cheaper helpers 2"]){
        cost -= 1;   
    }
    return cost * helpers; 
}

function compute_log_count(upgrades : Record<string, boolean>, level : number){
  let x =  10 - Math.floor(level/2); 
  if(upgrades["more wood"]){
    x += 3;
  }
  if(upgrades["more wood 2"]){
    x += 4;
  }
  return x;
}
function compute_wolves_count(upgrades : Record<string, boolean>, level : number){
  let x =  5 + Math.floor(level/5);  
  if(upgrades["fewer wolves"]){
    x -= 1; 
  }
  return x;
}

function compute_helper_count(upgrades : Record<string, boolean>){
  let x = 0;
  if(upgrades["extra helper"]){
    x++;
  }
  return x;
}

function compute_helper_speed(upgrades : Record<string, boolean>){
  let x = 6;
  if(upgrades["faster helpers"]){
    x += 4; 
  }
  return x;
}

function make_upgrade(name : string){
  let [x,y] = upgrade_costs[name];
  if(money < x || res_count < y){
    return false; 
  }
  money -= x;
  res_count -= y;
  upgrades[name] = true;
  return true;
}


  return (
    <>
          {function(){ 
            switch(count){
              case "game":
                
                if(g == undefined){
                  g = make_game();
                  g.limit = serve_duration; 
                  g.serve_delay = compute_serve_delay(upgrades, cost_per_drink,level );
                  console.log(g.serve_delay);
                  let helper_speed = compute_helper_speed(upgrades); 
                  for(let i=0; i < helpers; i++){
                    g.helpers.push(new helper(400, 400, helper_speed));
                  }
                  if(upgrades["faster speed"]){
                    g.player_speed += 2;
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
                function display_cost(){
                  console.log("got here");
                  let data = check_cost();
                  if(typeof(data) == "string"){
                    // do nothing
                    setMessage(data);
                  } else {
                    setMessage("Cost : " + data[0] + ", Estimated customers : " + Math.floor(serve_duration/data[1])); 
                  }
                }
                function start_clicked(){
                  let data = check_cost();
                  if(typeof(data) == "object"){
                    if(money >= data[0]){
                      money -= data[0];
                      setCount("win");
                    }
                    else {
                      setMessage("not enough money");
                    }
                  }
                }
                if(message == ""){
                  setTimeout(display_cost, 10);
                }
                let helpers_limit = compute_helper_count(upgrades); 
                  return <>
                  ${money} , {res_count} wood<br />
                    <input type="text" onChange={display_cost} id="helper count" defaultValue={compute_helper_count(upgrades)}/>Number of helpers (limit {helpers_limit}) <br />

                    <input type="text" onChange={display_cost}id="cost" defaultValue={10}/>Cost per drink (max 30)<br />
                    <button onClick={start_clicked}> Start</button>
                    {message}
                  </>
              case "collect":
                if(c == undefined){
                  c = make_collect_game(compute_log_count(upgrades, level));
                  c.limit = collect_duration;
                  for(let i=0; i<compute_wolves_count(upgrades, level); i++){
                    let p : [number, number] = [Math.random( ) * 600, Math.random( ) * 600];
                    let q : [number, number] = [Math.random( ) * 600, Math.random( ) * 600];

                    c.wolves.push(new wolf(p, q, 20 + Math.random() * 6)); 
                  }

                  if(upgrades["faster speed"]){
                    c.player_speed += 2;
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
                  Upgrade something; ${money}, {res_count} wood <br />
                  {
                    [...available_upgrades].map(function(upgrade){
                      let [x,y] = upgrade_costs[upgrade]; 

                      return <div key={upgrade}>{upgrade} : Cost ${x}, {y} wood. <button onClick={function(this:string){make_upgrade(this) ? setMessage(this + " : upgrade gotten") : setMessage("not enough money and/or wood")}.bind(upgrade)}>Get</button><br /></div>
                    } )
                  }
                  <br /><button onClick={() => setCount("win")}>Continue</button><br />
                  {message}
                </>
              case "paused":
                return <>game is a thing;
                <button onClick={() =>{ setMessage("");setCount("game")}}>resume</button></>

              case "win":
                if(screen_trans){
                  //result of previous round 
                  screen_trans = false; 
                  if(mode == "game" && g){
                    let extra_money =  g.served * cost_per_drink;
                    money += extra_money; 
                    setMessage("you earned $" + extra_money + ", you now have $" + money);
                  }
                  else if(mode == "collect"&& c){
                      let extra_res = c.collect.reduce((x, y) => y ? x+1 : x, 0); 
                      res_count += extra_res; 
                      setMessage(`you collected ${extra_res} wood, you now have ${res_count} wood`); 
                  } else {
                    setMessage("");
                  } 
                  // progress level
                  if(mode == "upgrade"){
                    level++; 
                    if(level == day_limit){
                      mode = "storm"; 
                    }
                  }
                  mode = {'game' :'collect', "collect" : 'upgrade', 'upgrade': 'plan', "plan": "game"}[mode] ?? mode;
                  
                }
                setTimeout(() => {setMessage(""); setCount(mode); screen_trans = true; }, 1000);
                return <>{day_limit-level} days until the storm comes <br /> {{"collect" : "Time to get resources" ,"game": "Time to serve customers","plan":"time to plan", "upgrade":"time to get upgrades"}[mode]}<br />{message}</>; 

                case "storm":
                  if(upgrades["survive storm"]){
                    return <>You survived the storm</>
                  } else {
                    return <>You did not survive the storm</>
                  }
            }


          }()}
    </>
  )
}

export default App
