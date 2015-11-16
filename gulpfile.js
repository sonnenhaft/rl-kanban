var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./cog1-rl-integrations/gulp/tasks', { recurse: true });
