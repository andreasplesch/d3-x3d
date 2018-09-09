let d3X3d = require("../");
let tape = require("tape");
let jsdom = require("jsdom");

tape("Test Setup", function(t) {
	let JSDOM = jsdom.JSDOM;
	global.document = new JSDOM().window.document;
	t.end();
});

tape("Test Index", function(t) {
	t.equal(d3X3d.author, "James Saunders", "Returns author");
	t.equal(d3X3d.license, "GPL-2.0", "Returns license");
	t.equal(d3X3d.copyright, "Copyright (C) 2018 James Saunders", "Returns copyright");

	t.end();
});