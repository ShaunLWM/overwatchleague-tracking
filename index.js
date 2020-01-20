const fetch = require('node-fetch');
const fs = require("fs-extra");

const API_BASE = "https://api.overwatchleague.com/";

(async () => {
    fs.ensureDirSync("./data");
    writeToFile("./data/about.json", await get("about"));
    const schedule = await get("schedule");
    writeToFile("./data/schedule.json", schedule);
    let stages = [];
    for (const s of schedule["data"]["stages"]) {
        for (const p of s["matches"]) {
            stages.push(p["id"]);
        }
    }

    fs.ensureDirSync("./data/match");
    for (const id of stages) {
        console.log(`Stage: ${id}`);
        fs.ensureDirSync(`./data/match/${id}`);
        let sresult = await get(`match/${id}`);
        if (typeof sresult["competitors"] !== "undefined" && sresult["competitors"].length > 0) {
            for (let i = 0; i < sresult["competitors"].length; i += 1)
                sresult["competitors"][i]["players"] = sresult["competitors"][i]["players"].sort((a, b) => (a["player"]["id"] > b["player"]["id"]) ? 1 : ((b["player"]["id"] > a["player"]["id"]) ? -1 : 0));
            writeToFile(`./data/match/${id}/data.json`, sresult);
            await sleep();
        }
    }

    stages = schedule["data"]["stages"];
    for (const i of stages) {
        for (const p of i["matches"]) {
            let mid = p["id"];
            let c = 1;
            for (const o of p["games"]) {
                let tel = await get(`stats/matches/${mid}/maps/${c}`);
                console.log(`stats/matches/${mid}/maps/${c}`);
                if (!tel)
                    console.log("failed to fetch content", `stats/matches/${mid}/maps/${c}`);
                else
                    writeToFile(`./data/match/${mid}/map-${c}.json`, tel);
                await sleep();
                c += 1;
            }
        }
    }

    writeToFile(`./data/streams.json`, await get("streams"));
    await sleep();
    const teams = await get("teams?expand=team.content&locale=en_US");
    writeToFile(`./data/teams.json`, teams);
    await sleep();
    fs.ensureDirSync("./data/teams");
    for (const team of teams["competitors"]) {
        console.log(`Team: ${team["competitor"]["id"]}`);
        const sresult = await get(`team/${team["competitor"]["id"]}`);
        sresult["players"] = sresult["players"].sort((a, b) => (a["id"] > b["id"]) ? 1 : ((b["id"] > a["id"]) ? -1 : 0));
        for (let i = 0; i < sresult["schedule"].length; i += 1) {
            for (const p = 0; p < sresult["schedule"][i]["competitors"]; p += 1)
                sresult["schedule"][i]["competitors"][p]["players"] = sresult["schedule"][i]["competitors"][p]["players"].sort((a, b) => (a["player"]["id"] > b["player"]["id"]) ? 1 : ((b["player"]["id"] > a["player"]["id"]) ? -1 : 0));
        }

        writeToFile(`./data/teams/${team["competitor"]["id"]}.json`, await get(`team/${team["competitor"]["id"]}`));
    }

    await sleep();

    writeToFile("./data/news.json", await get("news"));
    await sleep();

    writeToFile("./data/ranking.json", await get("ranking"));
    await sleep();

    writeToFile("./data/standings.json", await get("standings"));
    await sleep();

    writeToFile("./data/vods.json", await get("vods"));
    await sleep();

    writeToFile("./data/stats.json", await get("stats/players?allPlayers=true"));
    await sleep();

    writeToFile("./data/upcoming.json", await get("live-match?expand=team.content&locale=en-us"));
    await sleep();

    writeToFile("./data/maps.json", await get("maps"));
    await sleep();

    fs.ensureDirSync("./data/players");

    const players = await get("players");
    writeToFile("./data/players.json", players);
    await sleep();

    const playersJson = Object.assign({}, players);
    for (const player of $playersJson["content"]) {
        console.log(`Player: ${player["name"]}`);
        writeToFile(`./data/players/${player["id"]}.json`, await get(`players/${player["id"]}?expand=stats,stats.ranks`));
    }

    console.log("Done!");
})();


async function get(key) {
    try {
        const results = await fetch(`${API_BASE}${key}`);
        return await results.json();
    } catch (error) {
        return false;
    }
}

function writeToFile(dir, data) {
    if (data === null || data.length < 1) return;
    fs.writeFileSync(dir, JSON.stringify(data, null, 2));
}

async function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
