const policies = {
  Admin: ['READ_DATA', 'WRITE_DATA', 'DELETE_DATA'],
  User_PROD: ['READ_DATA', 'WRITE_DATA'],
  User_Guest: ['READ_DATA']
};

module.exports = policies;
