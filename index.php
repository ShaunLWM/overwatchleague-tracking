<?php

$base = "https://api.overwatchleague.com/";

@mkdir("./data", 0755, true);
writeToFile("./data/about.json", get("about"));
$schedule = get("schedule");
writeToFile("./data/schedule.json", $schedule);
$schedule = json_decode($schedule, true);
$stages = [];
foreach ($schedule["data"]["stages"] as $s) {
    foreach ($s["matches"] as $p) {
        array_push($stages, $p["id"]);
    }
}

echo "Stages: " . sizeof($stages) . "\n";
@mkdir("./data/match", 0755, true);
foreach ($stages as $id) {
    echo "Stage: " . $id . "\n";
    @mkdir("./data/match/" . $id, 0755, true);
    writeToFile("./data/match/" . $id . "/data.json", get("match/" . $id));
    humanSleep();
}

$games = [];
$stages = $schedule["data"]["stages"];
foreach ($stages as $i) {
    foreach ($i["matches"] as $p) {
        $mid = $p["id"];
        $c = 1;
        foreach ($p["games"] as $o) {
            $tel = get("stats/matches/" . $mid . "/maps/" . $c);
			echo "stats/matches/" . $mid . "/maps/" . $c . "\n";
			if (!$tel) {
				echo "failed to fetch content\n";
			} else {
				$dec = json_decode($tel, true);
				writeToFile("./data/match/" . $mid . "/map-" . $c . ".json", $tel);
			}
			
            humanSleep();
            $c++;
        }
    }
}

writeToFile("./data/streams.json", get("streams"));
humanSleep();
$teams = get("teams?expand=team.content&locale=en_US");
$decT = json_decode($teams, true);
writeToFile("./data/teams.json", $teams);
humanSleep();
@mkdir("./data/teams", 0755, true);
foreach ($decT["competitors"] as $team) {
    echo "Team: " . $team["competitor"]["id"] . "\n";
    writeToFile("./data/teams/" . $team["competitor"]["id"] . ".json", get("team/" . $team["competitor"]["id"]));
}

humanSleep();

writeToFile("./data/news.json", get("news"));
humanSleep();

writeToFile("./data/ranking.json", get("ranking"));
humanSleep();

writeToFile("./data/standings.json", get("standings"));
humanSleep();

writeToFile("./data/vods.json", get("vods"));
humanSleep();

writeToFile("./data/stats.json", get("stats/players?allPlayers=true"));
humanSleep();

writeToFile("./data/upcoming.json", get("live-match?expand=team.content&locale=en-us"));
humanSleep();

writeToFile("./data/maps.json", get("maps"));
humanSleep();
@mkdir("./data/players", 0755, true);

$players = get("players");
writeToFile("./data/players.json", $players);
humanSleep();

$playersJson = json_decode($players, true);
// print($players);
foreach ($playersJson["content"] as $player) {
	echo "Player: " . $player["name"] . "\n";
	writeToFile("./data/players/" . $player["id"] . ".json", get("players/" . $player["id"] . "?expand=stats,stats.ranks"));
}

echo "Done.\n";

function get($url)
{
    global $base;
    return @file_get_contents($base . $url);
}

function writeToFile($dir, $data)
{
    $myfile = @fopen($dir, "w") or die("Unable to open file!");
    fwrite($myfile, json_encode(json_decode($data, true), JSON_PRETTY_PRINT));
    fclose($myfile);
	echo "Done " . $dir . "\n";
}

function humanSleep()
{
    // sleep(mt_rand(1, 3));
}
