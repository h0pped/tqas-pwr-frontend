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

  if (!values.code) {
    errors.code = 'acc_activation_val_code_empty';
  }

  if (!values.password) {
    errors.password = 'login_validation_psw_required';
  } else {
    if (
      String(values.password).length < 8 ||
      String(values.password).length > 16
    ) {
      errors.password = 'login_validation_psw_err_length';
    }

    if (!/[!@#$%&*()+-=?]/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_spec_chars';
    }

    if (!/\d/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_digits';
    }

    if (!/[a-z]/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_lowercase';
    }
    if (!/[A-Z]/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_uppercase';
    }
  }

  return errors;
}
