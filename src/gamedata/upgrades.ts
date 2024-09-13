import { dag } from "./dag";

let v : string[] = [
    "more advertising",
    "faster speed",
    "cheaper helpers",
    "cheaper helpers 2",
    "more wood",
    "more wood 2",
    "fewer wolves",
    "survive storm"
]
let e: [string, string][] = [
    ["cheaper helpers", "cheaper helpers 2"],
    ["more wood", "more wood 2"],
    ["more wood 2", "survive storm"],
    ["cheaper helpers 2", "survive storm"],
    
]

export let upgrades_dag = new dag(v, e)

export let upgrade_costs : Record<string, [number, number]> = {} ;

upgrade_costs["more advertising"] = [30, 0]; 
upgrade_costs["faster speed"] = [0, 4];
upgrade_costs["cheaper helpers"] = [3, 2];
upgrade_costs["cheaper helpers 2"] = [5, 1];
upgrade_costs["more wood"] = [10, 10];
upgrade_costs["more wood 2"] = [14, 14];
upgrade_costs["fewer wolves"] = [20, 0];
upgrade_costs["survive storm"] = [20, 20];


