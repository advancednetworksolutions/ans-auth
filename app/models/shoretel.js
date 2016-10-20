
function Shoretel(host,user,password,db){
  this.host = host;
  this.user = user;
  this.password = password;
  this.db = db;
};

Shoretel.prototype.getHost = function () {
  return this.host;
};

Shoretel.prototype.getUser = function () {
  return this.user;
};

Shoretel.prototype.getDB = function () {
  return this.db;
};

module.exports = Shoretel;
