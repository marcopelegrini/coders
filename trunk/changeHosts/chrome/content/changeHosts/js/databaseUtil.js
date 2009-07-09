/**
 * @author marcotulio
 */
var CTechDatabaseUtil = {
	file: 'changeHosts.sqlite',
	
    mDBConn: null,
    
    init: function(){
        var db = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
        db.append(this.file);
        this.mDBConn = Cc["@mozilla.org/storage/service;1"].getService(Ci.mozIStorageService).openDatabase(db);
    },
    
    getConnection: function(){
        if (this.mDBConn == null) {
            this.init();
        }
        return this.mDBConn;
    },
    
    assync: function(sql, param){
        var conn = this.getConnection();
        var statement = conn.createStatement(sql);
        if (param) {
            for (var m = 1, arg = null; arg = arguments[m]; m++) {
                this.bind(statement, m - 1, arg);
            }
        }
        try {
            statement.executeAsync({
                handleResult: function(aResultSet){
                    CTechLog.info(aResultSet);
                },
                handleError: function(aError){
                    CTechLog.error("Error executing select: " + sql + ". Error: " + aError);
                },
                handleCompletion: function(aReason){
                    if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED) {
                        CTechLog.info("Query stopped unexpectedly: " + aReason);
                    }
                }
            });
        }
        finally {
            statement.reset();
        }
    },
    
    doSQL: function(sql, param){
        var conn = this.getConnection();
        var ourTransaction = false;
        if (conn.transactionInProgress) {
            ourTransaction = true;
            conn.beginTransactionAs(conn.TRANSACTION_DEFERRED);
        }
        var statement = conn.createStatement(sql);
        //Check if has more than one parameter (sql)
        if (arguments.length > 1) {
            //Starts at 1 because first param is sql by youself
            for (var m = 1; m < arguments.length; m++) {
                this.bind(statement, m - 1, arguments[m]);
            }
        }
        try {
            var dataset = [];
            //Execute statement, if it is a UPDATE or something without a result, then nothing gonna happen with dataset
            while (statement.executeStep()) {
                var row = [];
                for (var i = 0, k = statement.columnCount; i < k; i++) {
                    row[statement.getColumnName(i)] = statement.getUTF8String(i);
                }
                dataset.push(row);
            }
        }
        finally {
            statement.reset();
        }
        if (ourTransaction) {
            conn.commitTransaction();
        }
        return dataset;
    },
    
    bind: function(statement, index, value){
        CTechLog.debug("Binding: " + value + " at index: " + index);
        if (value === undefined) 
            throw "Attempted to bind undefined parameter '" + name + "'";
        else 
            if (value === null) 
                statement.bindNullParameter(index);
            else {
                switch (typeof value) {
                    case "string":
                        statement.bindStringParameter(index, value);
                        break;
                    case "number":
                        statement.bindInt32Parameter(index, value);
                        break;
                    case "boolean":
                        statement.bindInt32Parameter(index, value ? 1 : 0);
                        break;
                    default:
                        throw "Unknown value type '" + typeof value + "' for value '" + value + "'";
                }
            }
    },
}
