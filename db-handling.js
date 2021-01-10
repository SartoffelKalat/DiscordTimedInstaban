const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
const db_key = 'config' 
const default_settings = require("./default-config.json");

module.exports = class DbHandler {
    constructor(){
        db.defaults( {blacklist: []})
            .write();
    }
    isUserInBlackList = function(userId) {
        return !!(db.get('blacklist')
            .find({ id: userId })
            .value())  
    }
    getBlackList = function(userId) {
        return db.get('blacklist')
            .map('id')
            .value()
    }
    addToBlackList = function(userId) {
        if(!this.isUserInBlackList(userId)) {
            db.get('blacklist')
                .push({ id: userId})
                .write()
        }
    }
    removeFromBlackList = function(userId) {
        db.get('blacklist')
            .remove({ id: userId })
            .write()
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
        db.set(id, JSON.parse(JSON.stringify(default_settings)))
            .write();
    }
}

