// Jasmine test file
var clazz = info.fen_code.BBCodeManager,
    testTag = 'a',
    testReplaceFct = function(bbcode) {
		return bbcode.name + ' : ' + bbcode.param + ' -> ' + bbcode.content;
	};

describe('The BBCodeManager constructor', function() {
	it('builds an instance of BBCodeManager', function() {
		var instance = new info.fen_code.BBCodeManager();
		expect(typeof instance).toEqual('object');
		expect(typeof instance.addBBCode).toEqual('function');
		expect(typeof instance.applyTo).toEqual('function');
	});
});

describe('The BBCodeManager.addBBCode method', function() {
	var instance;
	
	beforeEach(function() {
		instance = new info.fen_code.BBCodeManager();
	});

	it('fails if the first parameter is not a string', function() {
		var oneNotString = function() {
			instance.addBBCode(3, testReplaceFct);
		};
		expect(oneNotString).toThrow();
	});

	it('fails if the second parameter is not a function', function() {
		var twoNotFunction = function() {
			instance.addBBCode(testTag, 3);
		};
		expect(twoNotFunction).toThrow();
	});

	it('does not complain if everything fits', function() {
		var isOk = function() {
			instance.addBBCode(testTag, testReplaceFct);
		};
		expect(isOk).not.toThrow();
	});
});

describe('The BBCodeManager.applyTo method', function() {
	// TODO Test thoroughly
});

describe('The BBCodeManager.parseBBCode class method', function() {
	it('recognizes the BBCode "[a][/a]"', function() {
		var exp = {
			name : 'a',
			param : '',
			content : ''
		},
		    parsed = clazz.parseBBCode('[a][/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes the BBCode "[a]text[/a]"', function() {
		var exp = {
		name : 'a',
		param : '',
			content : 'text'
		},
		    parsed = clazz.parseBBCode('[a]text[/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes the BBCode "[a=url][/a]"', function() {
		var exp = {
			name : 'a',
			param : 'url',
			content : ''
		},
		    parsed = clazz.parseBBCode('[a=url][/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes the BBCode "[a=url]text[/a]"', function() {
		var exp = {
			name : 'a',
			param : 'url',
			content : 'text'
		},
		    parsed = clazz.parseBBCode('[a=url]text[/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes BBCode "[a]test with ][/a]"', function() {
		var exp = {
			name : 'a',
			param : '',
			content : 'test with ]'
		},
		    parsed = clazz.parseBBCode('[a]test with ][/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes BBCode "[a=url with [][/a]"', function() {
		var exp = {
			name : 'a',
			param : 'url with [',
			content : ''
		},
		    parsed = clazz.parseBBCode('[a=url with [][/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes BBCode "[a][b][/a]"', function() {
		var exp = {
			name : 'a',
			param : '',
			content : '[b]'
		},
		    parsed = clazz.parseBBCode('[a][b][/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes BBCode "[a]=b][/a]"', function() {
		var exp = {
			name : 'a',
			param : '',
			content : '=b]'
		},
		    parsed = clazz.parseBBCode('[a]=b][/a]');
		expect(parsed).toEqual(exp);
	});

	it('badly recognizes BBCode "[a][a][/a]"', function() {
		var exp = {
			name : 'a',
			param : '',
			content : '[a]'
		},
		    parsed = clazz.parseBBCode('[a][a][/a]');
		expect(parsed).toEqual(exp);
	});

	it('recognizes one of the possibilities in confusing BBCode "[a=url with []][/a]"', function() {
		var exp = {
			name : 'a',
			param : 'url with [',
			content : ']'
		},
		    parsed = clazz.parseBBCode('[a=url with []][/a]');
		expect(parsed).toEqual(exp);
	});

	it('does not recognize BBCode with no end tag "[a]"', function() {
		var parsed = clazz.parseBBCode('[a]');
		expect(parsed).not.toBeDefined();
	});

	it('does not recognize BBCode with unmatched tags "[a]text[/b]"', function() {
		var parsed = clazz.parseBBCode('[a]text[/b]');
		expect(parsed).not.toBeDefined();
	});

	it('does not recognize non-isolated BBCode " [a][/a]"', function() {
		var parsed = clazz.parseBBCode(' [a][/a]');
		expect(parsed).not.toBeDefined();
	});

	it('does not recognize non-isolated BBCode "[a][/a] "', function() {
		var parsed = clazz.parseBBCode('[a][/a] ');
		expect(parsed).not.toBeDefined();
	});

	it('does not recognize bad BBCode "[[a][/[a] "', function() {
		var parsed = clazz.parseBBCode('[[a][/[a] ');
		expect(parsed).not.toBeDefined();
	});
});

describe('The BBCodeManager.INSTANCE pseudo-singleton', function() {
	it('exists', function() {
		expect(typeof clazz.INSTANCE).toEqual('object');
		expect(typeof clazz.INSTANCE.addBBCode).toEqual('function');
		expect(typeof clazz.INSTANCE.applyTo).toEqual('function');
	});
});