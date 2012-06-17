// This is a test file
describe('BBCodeManager', function() {
	var clazz = info.fen_code.BBCodeManager;

	it('recognizes the BBCode [a][/a]', function() {
		var exp = {
				name : 'a',
				param : '',
				content : ''
			};
		var parsed = clazz.parseBBCode('[a][/a]');
		expect(parsed).toEqual(exp);
	});
	it('recognizes the BBCode [a]text[/a]', function() {
		var exp = {
				name : 'a',
				param : '',
				content : 'text'
			};
		var parsed = clazz.parseBBCode('[a]text[/a]');
		expect(parsed).toEqual(exp);
	});
	it('recognizes the BBCode [a=url][/a]', function() {
		var exp = {
				name : 'a',
				param : 'url',
				content : ''
			};
		var parsed = clazz.parseBBCode('[a=url][/a]');
		expect(parsed).toEqual(exp);
	});
	it('recognizes the BBCode [a=url]text[/a]', function() {
		var exp = {
				name : 'a',
				param : 'url',
				content : 'text'
			};
		var parsed = clazz.parseBBCode('[a=url]text[/a]');
		expect(parsed).toEqual(exp);
	});

	it('initializes an object instance', function() {
		expect(typeof clazz.INSTANCE).toBeDefined();
	});
});