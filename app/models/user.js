/**
 * Constructor, with class name
 */
function User(username, email) {
  // Public properties, assigned to the instance ('this')
  this.username = username;
  this.email = email;
};

User.prototype.log = function () {
  console.log(this.email);
};

module.exports = User;
