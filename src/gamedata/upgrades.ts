import { dag } from "./dag";

let v : string[] = [
    "more advertising",
    "faster speed",
    "cheaper helpers",
    "more wood",
    "fewer wolves",
    "survive storm",
    "extra helper",
    "faster helpers"
]
let e: [string, string][] = [
    ["more wood", "fewer wolves"],
    ["more advertising", "extra helper"],
    ["extra helper", "faster helpers"],
    ["extra helper", "survive storm"],
    ["more advertising", "survive storm"],
    ["cheaper helpers", "survive storm"],
]

export let upgrades_dag = new dag(v, e)

export let upgrade_costs : Record<string, [number, number]> = {} ;



upgrade_costs["more advertising"] = [30, 0]; 
upgrade_costs["faster speed"] = [0, 4];
upgrade_costs["cheaper helpers"] = [3, 2];
upgrade_costs["extra helper"] = [5, 1];
upgrade_costs["more wood"] = [10, 10];
upgrade_costs["faster helpers"] = [14, 14];
upgrade_costs["fewer wolves"] = [20, 0];
upgrade_costs["survive storm"] = [20, 20];


