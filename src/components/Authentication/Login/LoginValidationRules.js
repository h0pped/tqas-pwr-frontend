/* eslint-disable max-len */
export default function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'login_validation_email_required';
  }

  if (values.email) {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(String(values.email))
    ) {
      errors.email = 'login_validation_not_email';
    }

    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(String(values.email))
      && !values.email.endsWith('@pwr.edu.pl')
    ) {
      errors.email = 'login_validation_not_university_email';
    }
  }

  if (!values.password) {
    errors.password = 'login_validation_psw_required';
  }

  return errors;
}
