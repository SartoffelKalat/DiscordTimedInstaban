const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const db_key = 'config' 
const default_settings = require("./default-config.json");

module.exports = class DbHandler {
    constructor(){
        db.defaults( {})
            .write();
    }
    getConfig = function(id){
        return db.get(id)
            .value();
    }
    setConfig = function(id, key, value){
        db.set("" + id + "."  + key, value)
            .write();
    }
    setDefaultConfigs = function(id){
        db.set(id, default_settings)
            .write();
    }
}

