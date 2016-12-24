var fs = require('fs');

function execute(source) {
	var textArray = source.split('');
	var memory = new Array(128);
	initalizeMemory(memory);
	var ptr = 0;
	for (var i = 0; i < textArray.length; i++) {
		ptr = interpret(textArray[i], memory, ptr);
	}
	console.log();
}

function interpret(token, memory, ptr) {
	switch (token) {
		case '<':
			return ptr-1;
		case '>':
			return ptr+1;
		case '+':
			memory[ptr]++;
			return ptr;
		case '-':
			memory[ptr]--;
			return ptr;
		case '.':
			process.stdout.write(numToChar(memory[ptr]));
			return ptr;
		case ',':
		case '[':			
		case ']':
		default:
			return ptr;
	}
}

function initalizeMemory(memory) {
	for (var i = 0; i < memory.length; i++) {
		memory[i] = 0;
	}
}

function numToChar(number) {
	var chars = 'abcdefghijklmnopqrstxyzABCDEFGHIJKLMNOPQRSTXYZ';
	return chars[number - 1];
}

function read(file) {
	return fs.readFileSync(file, 'utf8');
}

//execute('+>++>+++>++++>+++++'); //outputs 'abcde'
execute('+++++ +++++ +++++ +++++ +++++ +++++ + . > +++++ . > +++++ +++++ ++ . > +++++ +++++ ++ . > +++++ +++++ +++++ .'); //Outputs 'Hello'

execute(read(process.argv[2]));
