function getTableName(t) {
	while((t = t.previousElementSibling) != null) {
		if(t.tagName == 'H2') {
			return getText(t);
		}
	}
	return 'NoName';
}

function getText(node) {
	return node.firstChild ?
		node.firstChild.innerText ? node.firstChild.innerText
			: node.firstChild.data
		: node.innerText ? node.innerText
			: node.data;
}

function getHeadRow(t) {
	var headrow;
	var thead = t.getElementsByTagName('thead')[0];
	if(thead) {
		headrow = thead.getElementsByTagName('tr')[0];
	} else {
		headrow = t.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0];
	}
	return headrow;
}

function getColumns(row) {
	var result = [];
	var columns = row.getElementsByTagName('th');
	for(var i = 0; i < columns.length; i++) {
		result.push(columns[i]);
	}
	columns = row.getElementsByTagName('td');
	for(var i = 0; i < columns.length; i++) {
		result.push(columns[i]);
	}
	return result;
}

function getDataRows(t) {
	var thead = t.getElementsByTagName('thead')[0];
	var result = [];
	var rows = t.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
	for(var i = thead ? 0 : 1; i < rows.length; i++) {
		result.push(rows[i]);
	}
	return result;
}

function getRows(t) {
	var data = getDataRows(t);
	var colnames = getColumnNames(t);
	var rows = [];
	for(var i = 0; i < data.length; i++) {
		var r = {};
		var columns = getColumns(data[i]);
		for(var j = 0; j < columns.length; j++) {
			r[colnames[j]] = getText(columns[j]);
		}
		rows.push(r);
	}
	return rows;
}

function getColumnNames(t) {
	var colnames = [];
	var columns = getColumns(getHeadRow(t));
	for(var i = 0; i < columns.length; i++) {
		colnames.push(getText(columns[i]));
	}
	return colnames;
}

Array.prototype.innerJoin = function(right,predicate) {
	var result = [];
	if(!this.length && this.rows) {
		that = this.rows;
	} else {
		that = this;
	}
	if(!right.length && right.rows) right = right.rows;
	for(var i = 0; i < that.length; i++) {
		for(var j = 0; j < right.length; j++) {
			if(predicate(that[i], right[j])) {
				var r = {};
				for(var k in that[i]) {
					r[k] = that[i][k];
				}
				for(var k in right[j]) {
					r[k] = right[j][k];
				}
				result.push(r);
			}
		}
	}
	return result;
}

function getTables() {
	var tables = document.getElementsByClassName('wikitable')
	var db = {};
	for(var i = 0; i < tables.length; i++) {
		var t = {};
		t.innerJoin = Array.prototype.innerJoin;
		t.html = tables[i];
		t.name = getTableName(tables[i]);
		t.columns = getColumnNames(tables[i]);
		t.rows = getRows(tables[i]);
		db[t.name] = t;
	}
	return db;
}

if(chrome) {
	Array.prototype.table = function() {
		console.table(this);
	}
}
