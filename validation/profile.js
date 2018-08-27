const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  const {
    handle,
    status,
    skills,
    website,
    twitter,
    youtube,
    facebook,
    linkedin,
    instagram
  } = data;

  if (!Validator.isLength(handle, 2, 40))
    errors.handle = "Handle needs to be between 2 and 40 characters";
  if (Validator.isEmpty(handle)) errors.handle = "Profile handle is required";

  if (Validator.isEmpty(status)) errors.status = "Status field is required";

  if (Validator.isEmpty(skills)) errors.skills = "Skills field is required";

  if (!isEmpty(website) && !Validator.isURL(website))
    errors.website = "Not a valid URL";

  if (!isEmpty(twitter) && !Validator.isURL(twitter))
    errors.twitter = "Not a valid URL";

  if (!isEmpty(youtube) && !Validator.isURL(youtube))
    errors.youtube = "Not a valid URL";

  if (!isEmpty(facebook) && !Validator.isURL(facebook))
    errors.facebook = "Not a valid URL";

  if (!isEmpty(linkedin) && !Validator.isURL(linkedin))
    errors.linkedin = "Not a valid URL";

  if (!isEmpty(instagram) && !Validator.isURL(instagram))
    errors.instagram = "Not a valid URL";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
