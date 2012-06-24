/*global info: false, it: false, describe: false, beforeEach: false, expect: false, jasmine: false, Element: false */
// Jasmine test file
var Clazz = info.fen_code.BBCodeManager,
    testTag = 'a',
    testReplaceFct = function(bbcode) {
		return bbcode.name + ' : ' + bbcode.param + ' -> ' + bbcode.content;
	};

describe('BBCodeElem class', function() {
	describe('constructor', function() {
		it('fails if the first parameter is not a string', function() {
			var oneNotString = function() {
				var instance = new info.fen_code.BBCodeElem(3, 'param', 'content');
			};
			expect(oneNotString).toThrow();
		});

		it('fails if the second parameter is not a string', function() {
			var twoNotString = function() {
				var instance = new info.fen_code.BBCodeElem('tag', 3, 'content');
			};
			expect(twoNotString).toThrow();
		});

		it('fails if the third parameter is not a string', function() {
			var threeNotString = function() {
				var instance = new info.fen_code.BBCodeElem('tag', 'param', 3);
			};
			expect(threeNotString).toThrow();
		});
	});
	
	describe('toString method', function() {
		it('correctly builds the BBCode when all the parameters are defined', function() {
			var instance = new info.fen_code.BBCodeElem('tag', 'param', 'content');
			expect(instance.toString()).toEqual('[tag=param]content[/tag]');
		});

		it('correctly builds the BBCode when param is an empty string', function() {
			var instance = new info.fen_code.BBCodeElem('tag', '', 'content');
			expect(instance.toString()).toEqual('[tag]content[/tag]');
		});
	});
});
describe('BBCodeManager class', function() {
	describe('findBBCodes class method', function() {
		it('fails if not provided with a string', function() {
			var notAString = function() {
				Clazz.findBBCode(3);
			};
			expect(notAString).toThrow();
		});

		it('returns an empty array when no BBCode is found', function() {
			var exp = [],
			    found = Clazz.findBBCodes('Lorem ipsum dolor sit amet.');
			expect(found).toEqual(exp);
		});

		it('returns the existing BBCode', function() {
			var found = Clazz.findBBCodes('Lorem ipsum [a][/a]dolor sit amet.');
			expect(found).toContain('[a][/a]');
		});

		it('returns the existing BBCodes', function() {
			var found = Clazz.findBBCodes('[b=aaa]Lorem ipsum[/b] [a][/a]dolor sit [c]amet[/c].');
			expect(found).toContain('[b=aaa]Lorem ipsum[/b]');
			expect(found).toContain('[a][/a]');
			expect(found).toContain('[c]amet[/c]');
		});
	});

	describe('parseBBCode class method', function() {
		it('fails if not provided with a string', function() {
			var notAString = function() {
				Clazz.parseBBCode(3);
			};
			expect(notAString).toThrow();
		});

		it('recognizes the BBCode "[a][/a]"', function() {
			var exp = {
				name : 'a',
				param : '',
				content : ''
			},
			    parsed = Clazz.parseBBCode('[a][/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes the BBCode "[a]text[/a]"', function() {
			var exp = {
				name : 'a',
				param : '',
				content : 'text'
			},
			    parsed = Clazz.parseBBCode('[a]text[/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes the BBCode "[a=url][/a]"', function() {
			var exp = {
				name : 'a',
				param : 'url',
				content : ''
			},
			    parsed = Clazz.parseBBCode('[a=url][/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes the BBCode "[a=url]text[/a]"', function() {
			var exp = {
				name : 'a',
				param : 'url',
				content : 'text'
			},
			    parsed = Clazz.parseBBCode('[a=url]text[/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes BBCode "[a]test with ][/a]"', function() {
			var exp = {
				name : 'a',
				param : '',
				content : 'test with ]'
			},
			    parsed = Clazz.parseBBCode('[a]test with ][/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes BBCode "[a=url with [][/a]"', function() {
			var exp = {
				name : 'a',
				param : 'url with [',
				content : ''
			},
			    parsed = Clazz.parseBBCode('[a=url with [][/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes BBCode "[a][b][/a]"', function() {
			var exp = {
				name : 'a',
				param : '',
				content : '[b]'
			},
			    parsed = Clazz.parseBBCode('[a][b][/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes BBCode "[a]=b][/a]"', function() {
			var exp = {
				name : 'a',
				param : '',
				content : '=b]'
			},
			    parsed = Clazz.parseBBCode('[a]=b][/a]');
			expect(parsed).toEqual(exp);
		});

		it('badly recognizes BBCode "[a][a][/a]"', function() {
			var exp = {
				name : 'a',
				param : '',
				content : '[a]'
			},
			    parsed = Clazz.parseBBCode('[a][a][/a]');
			expect(parsed).toEqual(exp);
		});

		it('recognizes one of the possibilities in confusing BBCode "[a=url with []][/a]"', function() {
			var exp = {
				name : 'a',
				param : 'url with [',
				content : ']'
			},
			    parsed = Clazz.parseBBCode('[a=url with []][/a]');
			expect(parsed).toEqual(exp);
		});

		it('does not recognize BBCode with no end tag "[a]"', function() {
			var parsed = Clazz.parseBBCode('[a]');
			expect(parsed).not.toBeDefined();
		});

		it('does not recognize BBCode with unmatched tags "[a]text[/b]"', function() {
			var parsed = Clazz.parseBBCode('[a]text[/b]');
			expect(parsed).not.toBeDefined();
		});

		it('does not recognize non-isolated BBCode " [a][/a]"', function() {
			var parsed = Clazz.parseBBCode(' [a][/a]');
			expect(parsed).not.toBeDefined();
		});

		it('does not recognize non-isolated BBCode "[a][/a] "', function() {
			var parsed = Clazz.parseBBCode('[a][/a] ');
			expect(parsed).not.toBeDefined();
		});

		it('does not recognize bad BBCode "[[a][/[a] "', function() {
			var parsed = Clazz.parseBBCode('[[a][/[a] ');
			expect(parsed).not.toBeDefined();
		});
	});

	describe('INSTANCE pseudo-singleton', function() {
		it('exists', function() {
			expect(Clazz.INSTANCE).toEqual(jasmine.any(Clazz));
		});
	});

	describe('addBBCode method', function() {
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
		
		it('stores the BBCode processing in the internal map', function() {
			instance.addBBCode(testTag, testReplaceFct);
			expect(instance.bbcodes[testTag]).toEqual(testReplaceFct);
		});
	});

	describe('replaceBBCode method', function() {
		var instance,
		    elem1 = new info.fen_code.BBCodeElem('a', 'aaa', 'amet.'),
		    elem2 = new info.fen_code.BBCodeElem('b', '', 'dolor sit'),
		    elem3 = new info.fen_code.BBCodeElem('c', '', 'value'),
		    initialStr = 'Lorem [a=aaa]amet.[/a] Ipsum [b]dolor sit[/b] [a=aaa]amet.[/a] Consectetur...';

		beforeEach(function() {
			instance = new info.fen_code.BBCodeManager();
			instance.addBBCode(testTag, testReplaceFct);
			instance.addBBCode('b', function(bbcode) {
				return bbcode.content;
			});
		});

		it('fails if the first parameter is not a BBCodeElem instance', function() {
			var oneNotBBCodeElem = function() {
				instance.replaceBBCode(3, initialStr);
			};
			expect(oneNotBBCodeElem).toThrow();
		});

		it('fails if the second parameter is not a string', function() {
			var twoNotString = function() {
				instance.replaceBBCode(elem1, 3);
			};
			expect(twoNotString).toThrow();
		});

		it('replaces nothing if the BBCode has not been declared', function() {
			var result = instance.replaceBBCode(elem3, initialStr);
			expect(result).toEqual(initialStr);
		});

		it('replaces a single matching instance', function() {
			var result = instance.replaceBBCode(elem2, initialStr);
			expect(result).toEqual('Lorem [a=aaa]amet.[/a] Ipsum dolor sit [a=aaa]amet.[/a] Consectetur...');
		});

		it('replaces several matching instances', function() {
			var result = instance.replaceBBCode(elem1, initialStr);
			expect(result).toEqual('Lorem a : aaa -> amet. Ipsum [b]dolor sit[/b] a : aaa -> amet. Consectetur...');
		});
	});

	describe('applyTo method', function() {
		var instance;

		beforeEach(function() {
			instance = new info.fen_code.BBCodeManager();
			instance.addBBCode(testTag, testReplaceFct);
			instance.addBBCode('b', function(bbcode) {
				return bbcode.content;
			});
		});

		it('fails if the parameter is not an array', function() {
			var notAnArray = function() {
				instance.applyTo(3);
			};
			expect(notAnArray).toThrow();
		});

		it('fails if the parameter is not an array of objects', function() {
			var notAnArrayOfObjects = function() {
				instance.applyTo([3, 4]);
			};
			expect(notAnArrayOfObjects).toThrow();
		});

		it('leaves untouched content with no tag inside', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur adipiscing elit.</p>' }) ],
			    expDomTreeStr = '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur adipiscing elit.</p>';

			instance.applyTo(domTrees);
			expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
		});
	
		it('leaves untouched unrecognized (i.e. bad) BBCode', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [a]text[/b] adipiscing elit.</p>' }) ],
			    expDomTreeStr = '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [a]text[/b] adipiscing elit.</p>';

			instance.applyTo(domTrees);
			expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
		});
	
		it('leaves untouched unknown (i.e. undeclared) BBCode', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [c=aaa]text[/c] adipiscing elit.</p>' }) ],
			    expDomTreeStr = '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [c=aaa]text[/c] adipiscing elit.</p>';

			instance.applyTo(domTrees);
			expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
		});
	
		it('changes a single-use BBCode found in a simple DOM tree', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur [a=c]text[/a] adipiscing elit.</p>' }) ],
			    expDomTreeStr = '<p>Lorem ipsum dolor sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p>';

			instance.applyTo(domTrees);
			expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
		});
	
		it('changes several instances of a BBCode found in a simple DOM tree', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem ipsum [a=dolor]sit[/a] amet.</p><p>Consectetur [a=c]text[/a] adipiscing elit.</p>' }) ],
			    expDomTreeStr = '<p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p>';

			instance.applyTo(domTrees);
			expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
		});
	
		it('changes several instances of several BBCodes found in a more complex DOM tree', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem [b]ipsum[/b] [a=dolor]sit[/a] amet.</p><p>Consectetur [a=c]text[/a] [b]adipiscing elit[/b].</p>' }) ],
			    expDomTreeStr = '<p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p>';

			instance.applyTo(domTrees);
			expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
		});
	
		it('works as well when several DOM trees are provided', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem ipsum [a=dolor]sit[/a] amet.</p><p>Consectetur [a=c]text[/a] adipiscing elit.</p>' }),
			                 new Element('div', { html : '<p>Lorem [b]ipsum[/b] [a=dolor]sit[/a] amet.</p><p>Consectetur [a=c]text[/a] [b]adipiscing elit[/b].</p>' }) ],
			    expDomTreesStr = [ '<p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p>',
			                       '<p>Lorem ipsum a : dolor -&gt; sit amet.</p><p>Consectetur a : c -&gt; text adipiscing elit.</p>' ],
			    i = 0;

			instance.applyTo(domTrees);
			while (i < domTrees.length) {
				expect(domTrees[i].get('html')).toEqual(expDomTreesStr[i]);
				i++;
			}
		});
	
		it('only changes the inner BBCode when provided with a BBCode inside a BBCode', function() {
			var domTrees = [ new Element('div', { html : '<p>Lorem ipsum dolor sit amet.</p><p>[b]Consectetur [a=c]text[/a][/b] adipiscing elit.</p>' }) ],
			    expDomTreeStr = '<p>Lorem ipsum dolor sit amet.</p><p>[b]Consectetur a : c -&gt; text[/b] adipiscing elit.</p>';

			instance.applyTo(domTrees);
			expect(domTrees[0].get('html')).toEqual(expDomTreeStr);
		});
	});
});