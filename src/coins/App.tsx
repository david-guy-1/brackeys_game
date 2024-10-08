import { useContext, useState } from 'react'
import GameDisplay from '../GameDisplay'
import { events, set_events } from '../EventManager'
import React from 'react'

// App, game and GameFunctions (and other optional files) are only non-boilerplate code 

function App() {
  const [count, setCount] = useState<string>("game")
  set_events() 
  

  events["keyup pause"] = [function(e : KeyboardEvent) { if(e.key == "p" || e.key == "P"){setCount("paused")} }, undefined]

  return (
    <>
          {function(){ 
            switch(count){
              case "game":
                return <GameDisplay pause={() => setCount("paused")} win={() => setCount("win")} /> ;
              case "paused":
                return <>game is a thing;
                <button onClick={() => setCount("game")}>resume</button></>
              case "win":

                setTimeout(() => setCount("game"), 10);
                return ""; 
            }


          }()}
    </>
  )
}

export default App
