var fs = require('fs');

var memory = malloc(30000); //30000 bytes is enough for anyone (also standard)
var ptr = 0;
var tokenIndex = -1;
var tokens;
var stack = [];
var debug = false;

function execute() {
	var token;
	while(hasNext()) {
		token = next();
		log(token);
		switch (token) {
			case '<':
				ptr--;
				if (ptr < 0) process.exit(1); //outside memory
				break;
			case '>':
				ptr++;
				break;
			case '+':
				memory[ptr]++;
				break;
			case '-':
				memory[ptr]--;
				break;
			case '.':
				log("output");
				process.stdout.write(String.fromCharCode(memory[ptr]));
				break;
			case ',':
				//Read input
				break;
			case '[':
				log("loop start");
				if (memory[ptr] === 0) {
					log("skipping loop");
					scanForEndLoop();					
				} else {
					log("executing loop");
					stack.push(tokenIndex);
				}
				break;
			case ']':
				log("popping stack");
				tokenIndex = stack.pop() - 1;
				break;
			default:
				break;
		}

	}
}

function log(string) {
	if (debug) console.log(string);
}

function hasNext() {
	return tokens[tokenIndex+1];
}

function next() {
	return tokens[++tokenIndex];
}

function scanForEndLoop() {
	var depth = 0;
	var token;
	while(hasNext()) {
		token = next();
		if (token === '[') depth++;
		if (token === ']') {
			if (depth > 0) {
				depth--;
			} else {
				return;
			}
		} 
	}
}

function malloc(size) {
	var memory = new Array(size);
	for (var i = 0; i < memory.length; i++) {
		memory[i] = 0;
	}
	return memory;
}

function read(file) {
	var str = fs.readFileSync(file, 'utf8');
	return str.split('');
}

tokens = read(process.argv[2]);
execute();
