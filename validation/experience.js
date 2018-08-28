const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  const { title, company, from } = data;

  if (Validator.isEmpty(title)) errors.title = "Job title field is required";

  if (Validator.isEmpty(company)) errors.company = "Company field is required";

  if (Validator.isEmpty(from)) errors.from = "From date field is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
