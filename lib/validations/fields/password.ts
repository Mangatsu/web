import { FieldError } from "react-hook-form"
import { GenericFormErrors } from "../resolvers"

const minPasswordLength = 8
const maxPasswordLength = 512

// The password can contain almost all characters except control characters, whitespace and quotes.
const passwordRe = new RegExp(`^[^\\x00-\\x1F\\x7F\\s'"]+$`)

export function validatePassword(password: string, errors: GenericFormErrors<{ password?: FieldError }>) {
  if (!password) {
    errors.password = {
      type: "required",
      message: "Password is required.",
    }
  } else if (password.length < minPasswordLength || password.length > maxPasswordLength) {
    errors.password = {
      type: "validate",
      message: "Password must be 8-512 characters long.",
    }
  } else if (!passwordRe.test(password)) {
    errors.password = {
      type: "validate",
      message:
        "The password can contain almost all characters except control characters, whitespace and quotes (', \").",
    }
  }
}

export function validatePasswordConfirm(
  password: string,
  confirmPassword: string,
  errors: GenericFormErrors<{ password?: FieldError; confirmPassword?: FieldError }>,
) {
  validatePassword(password, errors)

  if (password !== confirmPassword) {
    errors.confirmPassword = {
      type: "validate",
      message: "Passwords must match.",
    }
  }
}
