<?php
date_default_timezone_set('Asia/Singapore');
$output = shell_exec("git status");
if (strpos($output, "modified:") !== false || strpos($output, "Untracked files:") !== false || strpos($output, "Changes not staged for commit") !== false) {
	shell_exec("git add .");
	shell_exec('git commit -m "' . date("nS F Y") . '"');
	shell_exec("git push");
} else {
	echo "Nothing to commit";
}

exit(0);