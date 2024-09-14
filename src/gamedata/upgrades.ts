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
    ["extra helper", "cheaper helpers"],
    ["more advertising", "survive storm"],
    ["cheaper helpers", "survive storm"],
    ["faster helpers", "survive storm"],
]

export let upgrades_dag = new dag(v, e)

export let upgrade_costs : Record<string, [number, number]> = {} ;



upgrade_costs["more advertising"] = [50, 3]; 
upgrade_costs["faster speed"] = [60, 4];
upgrade_costs["cheaper helpers"] = [50, 2];
upgrade_costs["extra helper"] = [85, 1];
upgrade_costs["more wood"] = [70, 7];
upgrade_costs["faster helpers"] = [30, 4];
upgrade_costs["fewer wolves"] = [20, 6];
upgrade_costs["survive storm"] = [120, 20];


