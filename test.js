const fs = require("fs-extra");
const data = JSON.parse(fs.readFileSync("./data/match/21177/data.json", "utf-8"));
console.log(data["competitors"][0]["players"].sort((a, b) => (a["player"]["id"] > b["player"]["id"]) ? 1 : ((b["player"]["id"] > a["player"]["id"]) ? -1 : 0)));
