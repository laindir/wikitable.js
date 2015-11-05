#wikitable.js

Relational joins of Wikipedia comparison tables

This was a quick hack I threw together when searching for an IRCd with specific
features. I was tired of importing Wikipedia tables into a database in order to
be able to filter them in a sane way. I hope you find it useful.

##Usage

1. Browse to a Wikipedia page with tables
2. Open the javascript console and paste in the contents of wikitable.js
3. Enter a query. e.g.:

		//on https://en.wikipedia.org/wiki/Comparison_of_lightweight_web_browsers
		var db = getTables();
		var result = db["Overview"]
			.innerJoin(db["Operating system support"], function(a,b) {
			return (/gpl/i).test(a["Software license"])
				&& a["Browser"] == b.["Browser"]
				&& (/yes/i).test(b["Windows"]);
		});
		result.table();

##API

###var db = getTables()

Returns an object with each table on the page as a property named with the table's title.

###var table = db["Table name"]

An object with the following properties:

- html: the table DOM element
- name: the heading immediately preceding the table
- columns: array of strings holding the column names
- rows: array of objects with the table cells' text content as properties, named by the elements of columns.

###var result = table.innerJoin(otherTable, predicate)

Returns an array of merged row objects matching the supplied predicate function, of the form `function(a,b)`, where `a` is a row from table and `b` is a row from `otherTable`.

###result.table()

Renders the array to the console in a tabular layout.

##Compatibility

Currently only works in Chrome

##TODO

* Improve reliability/predictability of getText
* Handle the Wikipedia splits wide tables
* Make it generally less awful
* Don't pollute the global namespace
* Render to HTML table?
* Make it work on tables outside of Wikipedia
