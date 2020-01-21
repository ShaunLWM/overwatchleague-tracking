<?php
date_default_timezone_set('Asia/Singapore');
shell_exec("node index.js");
$output = shell_exec("git status");
if (strpos($output, "modified:") !== false || strpos($output, "Untracked files:") !== false || strpos($output, "Changes not staged for commit") !== false) {
	shell_exec("git add .");
	shell_exec('git commit -m "' . date("jS F Y", strtotime("now")) . '"');
	shell_exec("git push");
} else {
	echo "Nothing to commit";
}

exit(0);
