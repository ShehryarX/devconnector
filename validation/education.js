const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  const { school, degree, fieldofstudy, from } = data;

  if (Validator.isEmpty(school))
    errors.school = "School title field is required";

  if (Validator.isEmpty(degree)) errors.degree = "Degree field is required";

  if (Validator.isEmpty(fieldofstudy))
    errors.fieldofstudy = "Field of study field is required";

  if (Validator.isEmpty(from)) errors.from = "From date field is required";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
