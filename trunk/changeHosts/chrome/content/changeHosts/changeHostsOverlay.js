//some variables :
// some example SQL queries:
var myCreateDBQuery = 'CREATE TABLE IF NOT EXISTS mybooks_tbl (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT);';

var myInsertQuery = 'INSERT INTO mybooks_tbl(title) VALUES("book title1");';
var myInsertQueryParameterized = 'INSERT INTO mybooks_tbl(title) VALUES(?1);';

var mySelectQuery = 'SELECT id,title FROM mybooks_tbl';
var mySelectQueryParameterized = 'SELECT id,title FROM mybooks_tbl WHERE id = ?1 AND title = ?2';

// For anything other than SELECT statement, use $sqlite.cmd() :

// creating a DB:
function test_createDB(){
    $sqlite.assync(myCreateDBQuery);
}

// simple add record:
function test_addRecord(){
    $sqlite.doSQL(myInsertQuery);
}

// parameterized add record, add parameters as much as you want:	
function test_addRecordParameterized(){
    // for example, adding 3 records:
    for (var i = 1; i < 4; i++) {
        $sqlite.assync(myInsertQueryParameterized, 'book title' + i + '');
    }
}

// for SELECT, use $sqlite.select() :

// simple select:
function test_Select(){
    var myArray1 = $sqlite.doSQL(mySelectQuery);
    // Now you can loop through the array:
    for (var j = 0; j < myArray1.length; j++) {
        // change this as you wish:
        Log.info(myArray1[j]['title']);
    }
}

// select with bound parameters, add parameters as much as you want:
function test_SelectParameterized(){
    var myArray1 = $sqlite.doSQL(mySelectQueryParameterized, '1', 'book title1');
    // Now you can loop through the array:
    for (var j = 0; j < myArray1.length; j++) {
        // change this as you wish:
        Log.info(myArray1[j]['title']);
    }
}
