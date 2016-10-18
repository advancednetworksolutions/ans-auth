/**
 * Constructor, with class name
 */
function User(firstName, lastName, email, role, permissions) {
  // Public properties, assigned to the instance ('this')
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.role = role;
  this.permissions = permissions;
};

User.prototype.log = function () {
  console.log(this.email);
};

module.exports = User;
