
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  var bcrypt = require('bcrypt');
  const saltRounds = 10;
  const pass = await new Promise((resolve, reject) => {
    bcrypt.hash("admin", saltRounds, function (err, hash) {
      resolve(hash)
      reject(err)
    })
  })
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        { username: "admin", pass: pass, privilage: "admin" },

      ]);
    });
};
