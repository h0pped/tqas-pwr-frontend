/* eslint-disable max-len */
export default function validate(values) {
  const errors = {};

  const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!values.email) {
    errors.email = 'login_validation_email_required';
  } else {
    if (!validEmail.test(String(values.email))) {
      errors.email = 'login_validation_not_email';
    }

    if (
      validEmail.test(String(values.email)) &&
      !values.email.endsWith('@pwr.edu.pl')
    ) {
      errors.email = 'login_validation_not_university_email';
    }
  }

  if (!values.password) {
    errors.password = 'login_validation_psw_required';
  }

  return errors;
}
