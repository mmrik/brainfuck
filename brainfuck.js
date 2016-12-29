const fs = require('fs');
const readlineSync = require('readline-sync');

var memory = malloc(30000); //30000 bytes is enough for anyone (also standard)
var memPtr = 0;
var cursor = -1;
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
				memPtr--;
				if (memPtr < 0) process.exit(1); //outside memory
				break;
			case '>':
				memPtr++;
				break;
			case '+':
				memory[memPtr]++;
				break;
			case '-':
				memory[memPtr]--;
				break;
			case '.':
				log("output");
				process.stdout.write(String.fromCharCode(memory[memPtr]));
				break;
			case ',':
				log('input');
				var input = readlineSync.promptCL();
				memory[memPtr] = input[0].charCodeAt(0);
				break;
			case '[':
				log("loop start");
				if (memory[memPtr] === 0) {
					log("skipping loop");
					scanForEndLoop();					
				} else {
					log("executing loop");
					stack.push(cursor);
				}
				break;
			case ']':
				log("popping stack");
				cursor = stack.pop() - 1;
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
	return tokens[cursor+1];
}

function next() {
	return tokens[++cursor];
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
