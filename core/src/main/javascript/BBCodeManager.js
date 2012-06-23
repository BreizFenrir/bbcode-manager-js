/*global $: false */
// Building or reusing namespace
var info = info || {};
if (typeof info.fen_code === 'undefined') {
	info.fen_code = {};
}

/** BBCode class */
info.fen_code.BBCodeElem = function(name, param, content) {
	/** Tag name */
	this.name = name;
	/** Tag parameter, i.e. everything after a '=' within the opening tag * */
	this.param = param;
	/** Tag content */
	this.content = content;
	
	/** Provides a string representation of the object */
	this.toString = function() {
		return '[' + this.name + (this.param === '' ? '' : '=' + this.param) + ']' + this.content
		 + '[/' + this.name + ']';
	};
};

/** BBCode manager class */
info.fen_code.BBCodeManager = function() {
	/** List of known BBCodes and associated replacement functions */
	this.bbcodes = {};

	/** Adds a BBCode to the known list */
	this.addBBCode = function(name, replaceFct) {
		if (typeof name === 'string' && typeof replaceFct === 'function') {
			this.bbcodes[name] = replaceFct;
		} else {
			throw new Error('Illegal datatype for addBBCode parameters, expected '
				+ '(string, function) but was (' + typeof name + ', ' + typeof replaceFct + ')');
		}
	};

	/** Applies the BBCode filters to a set of DOM trees */
	this.applyTo = function(domTrees) {
		if (Array.isArray(domTrees)) {
			domTrees.each(function(domTree) {
				if (typeof domTree === 'object') {
					var domTreeStr = $(domTree).get('html'),
					    elems = info.fen_code.BBCodeManager.findBBCodes(domTreeStr);
					elems.each(function(elem) {
						var bbcode = info.fen_code.BBCodeManager.parseBBCode(elem);
						if (bbcode instanceof info.fen_code.BBCodeElem) {
							this.replaceBBCode(bbcode, domTreeStr);
						}
					}, this);
					domTree.set('html', domTreeStr);
				} else {
					throw new Error('Illegal datatype for applyTo parameter, expected the array to '
						+ 'contain objects, but found ' + typeof domTree);
				}
			}, this);
		} else {
			throw new Error('Illegal datatype for applyTo parameter, expected array but was '
				+ typeof domTrees);
		}
	};
	
	this.replaceBBCode = function(bbcode, domTreeStr) {
		if (bbcode instanceof info.fen_code.BBCodeElem && typeof domTreeStr === 'string') {
			if (this.bbcodes[bbcode.name]) {
				var bbcodeRep = this.bbcodes[bbcode.name](bbcode);
				domTreeStr.split(bbcode.toString()).join(bbcodeRep);
			}
		} else {
			throw new Error('Illegal datatype for replaceBBCode, expected '
				+ '(info.fen_code.BBCodeElem, string) but was (' + typeof bbcode + ', '
				+ typeof domTreeStr + ')');
		}
	};
};

/** Provided with a string, returns the BBCode elements contained within */
info.fen_code.BBCodeManager.findBBCodes = function(domTreeStr) {
	if (typeof name === 'string') {
		var tmp = domTreeStr.match(/\[[^\]]+\][^\[]*\[\/[^\]]+\]/g);
		return tmp === null ? [] : tmp; // returns an empty string if no match
	} else {
		throw new Error('Illegal datatype for findBBCode parameter, expected string but was '
			+ typeof domTreeStr);
	}
};

/** Provided with a string describing a BBCode element, returns a structure describing that element */
info.fen_code.BBCodeManager.parseBBCode = function(bbcodeStr) {
	var tmp = bbcodeStr.match(/^\[([^=\]]+)(=[^\]]+)?\](.*)\[\/([^\[\]]+)\]$/i),
	    reg, param;
	if (tmp) {
		// Opening and ending tag must match
		reg = new RegExp('^' + tmp[1] + '$', 'i');
		if (tmp[4].match(reg)) {
			param = (tmp[2] ? tmp[2].substr(1) : '');
			return new info.fen_code.BBCodeElem(tmp[1].toLowerCase(), param, tmp[3]);
		} else {
			return;
		}
	} else {
		return;
	}
};

info.fen_code.BBCodeManager.INSTANCE = new info.fen_code.BBCodeManager();