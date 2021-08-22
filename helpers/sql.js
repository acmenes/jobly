const { BadRequestError } = require("../expressError");

// This helper is for making partial updates to the database. It takes the keys
// of the objects users wish to update. This helper makes it so that users do not
// have to enter data that they are not updating.

// if a user does not enter any keys to update, it will return an error, checking
// the length of the keys passed in

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
