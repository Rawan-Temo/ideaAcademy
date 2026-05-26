"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
exports.validateQuery = validateQuery;
const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body); // throws if invalid
      next();
    } catch (err) {
      res.status(400).json({ message: err.errors || err.message });
    }
  };
};
exports.validateBody = validateBody;
function validateQuery(fieldschema) {
  return (req, res, next) => {
    try {
      const queryFields = req.query;
      if (queryFields.sort) {
        const sortFields = queryFields.sort.split(",");
        if (!checkTwoMatchingArrays(sortFields, fieldschema)) {
          res.status(400).json({ message: `Invalid sort  query parameter` });
          return;
        }
      }
      if (queryFields.fields) {
        const fields = queryFields.fields.split(",");
        if (!checkTwoMatchingArrays(fields, fieldschema)) {
          res.status(400).json({ message: `Invalid fields  query parameter` });
          return;
        }
      }
      const filterFields = { ...queryFields };
      const excludedFields = ["page", "sort", "limit", "fields", "search"];
      excludedFields.forEach((el) => delete filterFields[el]);
      if (!checkTwoMatchingArrays(Object.keys(filterFields), fieldschema)) {
        res.status(400).json({ message: `Invalid filtering query parameter` });
        return;
      }
      next();
    } catch (err) {
      next();
      res.status(400).json({ message: err.errors || err.message });
    }
  };
}
const checkTwoMatchingArrays = (keys, arr) => {
  for (const key of keys) {
    if (!arr.includes(key)) {
      return false;
    }
  }
  return true;
};
//# sourceMappingURL=validate.js.map
