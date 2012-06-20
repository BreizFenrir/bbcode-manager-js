// Jasmine test file
var clazz = info.fen_code.BBCodeManager,
    testTag = 'a',
    testReplaceFct = function(bbcode) {
		return bbcode.name + ' : ' + bbcode.param + ' -> ' + bbcode.content;
	};

describe('The BBCodeManager constructor', function() {
	it('builds an instance of BBCodeManager', function() {
		var instance = new info.fen_code.BBCodeManager();
		expect(instance).toEqual(jasmine.any(Object));
		expect(instance.addBBCode).toEqual(jasmine.any(Function));
		expect(instance.applyTo).toEqual(jasmine.any(Function));
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
	var instance;

	beforeEach(function() {
		instance = new info.fen_code.BBCodeManager();
		instance.addBBCode(testTag, testReplaceFct);
		instance.addBBCode('b', function(bbcode) {
			return bbcode.content;
		});
	});

	it('leaves untouched content with no tag inside', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur adipiscing elit.</p>' }) ],
		    expDomTreeStr = '<div><p>Lorem ipsum dolor sit amet.</p><p>Consectetur adipiscing elit.</p></div>';

		instance.applyTo(domTrees);
		expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
	});
	
	it('leaves untouched unrecognized (i.e. bad) BBCode', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [a]text[/b] adipiscing elit.</p>' }) ],
		    expDomTreeStr = '<div><p>Lorem ipsum dolor sit amet.</p><p>Consectetur [a]text[/b] adipiscing elit.</p></div>';

		instance.applyTo(domTrees);
		expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
	});
	
	it('leaves untouched unknown (i.e. undeclared) BBCode', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [c=aaa]text[/c] adipiscing elit.</p>' }) ],
		    expDomTreeStr = '<div><p>Lorem ipsum dolor sit amet.</p><p>Consectetur [c=aaa]text[/c] adipiscing elit.</p></div>';

		instance.applyTo(domTrees);
		expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
	});
	
	it('changes a single-use BBCode found in a simple DOM tree', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [a=c]text[/a] adipiscing elit.</p>' }) ],
		    expDomTreeStr = '<div><p>Lorem ipsum dolor sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p></div>';

		instance.applyTo(domTrees);
		expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
	});
	
	it('changes several instances of a BBCode found in a simple DOM tree', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem ipsum [a=dolor]sit[/a] amet.</p><p>Consectetur [a=c]text[/a] adipiscing elit.</p>' }) ],
		    expDomTreeStr = '<div><p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p></div>';

		instance.applyTo(domTrees);
		expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
	});
	
	it('changes several instances of several BBCodes found in a more complex DOM tree', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem [b]ipsum[/b] [a=dolor]sit[/a] amet.</p><p>Consectetur [a=c]text[/a] [b]adipiscing elit[/b].</p>' }) ],
		    expDomTreeStr = '<div><p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p></div>';

		instance.applyTo(domTrees);
		expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
	});
	
	it('works as well when several DOM trees are provided', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem ipsum [a=dolor]sit[/a] amet, consectetur [a=c]text[/a] adipiscing elit.</p>' }),
		                 new Element('div', { html : '<p>Lorem [b]ipsum[/b] [a=dolor]sit[/a] amet, consectetur [a=c]text[/a] [b]adipiscing elit[/b].</p>' }) ],
		    expDomTreesStr = [ '<div><p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p></div>',
		                       '<div><p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p></div>' ],
		    i = 0;

		instance.applyTo(domTrees);
		while (i < domTrees.length) {
			expect(domTrees[i].get('html')).toEqual(expDomTreesStr[i]);
			i++;
		}
	});
	
	it('only changes the inner BBCode when provided with a BBCode inside a BBCode', function() {
		var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>[b]Consectetur [a=c]text[/a][/b] adipiscing elit.</p>' }) ],
		    expDomTreeStr = '<div><p>Lorem ipsum dolor sit amet.</p><p>[b]Consectetur a : c -&gt; text[/b] adipiscing elit.</p></div>';

		instance.applyTo(domTrees);
		expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
	});
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
		expect(clazz.INSTANCE).toEqual(jasmine.any(Object));
		expect(clazz.INSTANCE.addBBCode).toEqual(jasmine.any(Function));
		expect(clazz.INSTANCE.applyTo).toEqual(jasmine.any(Function));
	});
});