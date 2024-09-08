import { useEffect, useReducer, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import game from './Game'; 

function App() {
  const [game_inst, setGame] = useState<game | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
  
  const foodRef = useRef<HTMLInputElement>(null); 
  const woodRef = useRef<HTMLInputElement>(null); 
  useEffect(function(){
    //componentDidMount
    if(!game_inst){
      setGame(new game()); 
    }
    return function(){
      //componentWillUnmount
    }
  }, [])
  if(!game_inst){
    return "loading!"
  }
  function validate_input(){
    let x = foodRef.current?.value; 
    let y = woodRef.current?.value; 
    if(x == undefined || y == undefined){
      return false; 
    }
    let food = parseInt(x);
    let wood = parseInt(y);
    if(isNaN(food) || isNaN(wood) || food < 0 || wood < 0 || food + wood > (game_inst?.people ?? -1 ) ){
      return false; 
    }
    return true; 
  }
  return (
    <>
      Turn {game_inst.turn} : {game_inst.food} food, {game_inst.wood} wood, {game_inst.people} people <br/>
      <input type="text" ref={foodRef} /><input type="text" ref={woodRef} /><button onClick={() => { if(validate_input()){game_inst.tick(parseInt(foodRef.current?.value ?? "0"), parseInt(woodRef.current?.value  ?? "0" )); setMessage(""); forceUpdate()} else { setMessage("invalid input")} }}>Next turn</button><br />
      {message}
    </>
  )
}

export default App
