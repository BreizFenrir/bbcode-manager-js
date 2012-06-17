// Building or reusing namespace
var info = info || {};
if (typeof info.fen_code === 'undefined') {
	info.fen_code = {};
}

/** BBCode manager class */
info.fen_code.BBCodeManager = function() {
	/** List of known BBCodes and associated replacement functions */
	this.bbcodes = {};

	/** Adds a BBCode to the known list */
	this.addBBCode = function(name, replaceFct) {
		if (typeof name === 'string'
				&& typeof replaceFct === 'function') {
			this.bbcodes[name] = replaceFct;
		} else {
			throw new Error('Illegal datatype for addBBCode parameters, expected '
				+ '(string, function) but was (' + typeof name + ', ' + typeof replaceFct + ')');
		}
	};

	/** Applies the BBCode filters to a set of DOM trees */
	this.applyTo = function(domTrees) {
		domTrees.each(function(domTree) {
			var domTreeStr = domTree.get('html');
			var elems = domTreeStr.match(/\[[^\]]+\][^\[]*\[\/[^\]]+\]/g);
			if (elems) {
				elems.each(function(elem) {
					var bbcode = info.fen_code.BBCodeManager.parseBBCode(elem);
					if (typeof bbcode === 'object'
							&& typeof this.bbcodes[bbcode.name] === 'function') {
						var bbcodeRep = this.bbcodes[bbcode.name](bbcode);
						domTreeStr.split(elem).join(bbcodeRep);
					}
				});
			}
		});
	};
};

/** Provided with a string describing a BBCode element, returns a structure describing that element */
info.fen_code.BBCodeManager.parseBBCode = function(bbcodeStr) {
	var tmp = bbcodeStr.match(/^\[([^=]+)(=[^\]]+)?\](.*)\[\/([^\]]+)\]$/i);
	if (tmp) {
		// Opening and ending tag must match
		var reg = new RegExp('^' + tmp[1] + '$', 'i');
		if (tmp[4].match(reg)) {
			var param = (tmp[2] ? tmp[2].substr(1) : '');
			return {
				'name': tmp[1].toLowerCase(),
				'param': param,
				'content': tmp[3]
			};
		} else {
			return;
		}
	} else {
		return;
	}
};

info.fen_code.BBCodeManager.INSTANCE = new info.fen_code.BBCodeManager();