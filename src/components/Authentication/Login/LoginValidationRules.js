import PasswordResetComponent from '../PasswordReset/PasswordResetComponent';

export default function validate(values) {
  var validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  let errors = {};

  if (!values.email) {
    errors.email = 'login_validation_email_required';
  }

  if (values.email && !String(values.email).toLowerCase().match(validEmail)) {
    errors.email = 'login_validation_not_email';
  }

  if (
    values.email &&
    String(values.email).toLowerCase().match(validEmail) &&
    !values.email.endsWith('@pwr.edu.pl')
  ) {
    errors.email = 'login_validation_not_university_email';
  }

  if (!values.password) {
    errors.password = 'login_validation_psw_required';
  }

  return errors;
}
