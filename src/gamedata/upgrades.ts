import { dag } from "./dag";

let v : string[] = [
    "more advertising",
    "faster speed",
    "cheaper helpers",
    "cheaper helpers 2",
]
let e: [string, string][] = [
    ["cheaper helpers", "cheaper helpers 2"],
    
]

let upgrades_dag = new dag(v, e)
export default upgrades_dag;

