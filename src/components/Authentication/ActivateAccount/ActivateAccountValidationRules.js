export default function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'login_validation_email_required';
  }

  if (values.email) {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        String(values.email),
      )
    ) {
      errors.email = 'login_validation_not_email';

      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          String(values.email),
        ) &&
        !values.email.endsWith('@pwr.edu.pl')
      ) {
        errors.email = 'login_validation_not_university_email';
      }
    }
  }

  if (!values.password) {
    errors.password = 'login_validation_psw_required';
  }

  if (!values.code) {
    errors.code = 'acc_activation_val_code_empty';
  }

  if (values.password) {
    if (
      String(values.password).length < 8 ||
      String(values.password).length > 16
    ) {
      errors.password = 'login_validation_psw_err_length';
    } else if (!/[!@#$%&*()+-=?]/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_spec_chars';
    } else if (!/\d/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_digits';
    } else if (!/[a-z]/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_lowercase';
    } else if (!/[A-Z]/.test(String(values.password))) {
      errors.password = 'login_validation_psw_err_uppercase';
    }
  }

  return errors;
}
