var fs = require('fs');

var memory = malloc(30000); //30000 bytes is enough for anyone (also standard)
var ptr = 0;
var tokenIndex = -1;
var tokens;

function execute() {
	var token;
	while(hasNext()) {
		token = next();
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
				process.stdout.write(String.fromCharCode(memory[ptr]));
				break;
			case ',':
				//Read input
				break;
			case '[':
				if (memory[ptr] === 0) {
					scan();					
				}
				break;
			case ']':
				rewind();
			default:
				break;
		}

	}
}

function hasNext() {
	return tokens[tokenIndex+1];
}

function hasPrev() {
	return tokens[tokenIndex-1];
}

function next() {
	return tokens[++tokenIndex];
}

function prev() {
	return tokens[--tokenIndex];
}

function scan() {
	while(hasNext() && next() != ']');
}

function rewind() {
	while(hasPrev() && prev() != '[');
	prev(); // Make sure to start before the loop, otherwise we'll never evaluate the loop condition
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
console.log(); // Always clear
