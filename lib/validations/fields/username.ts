import { FieldError } from "react-hook-form"
import { GenericFormErrors } from "../resolvers"

const minUsernameLength = 2
const maxUsernameLength = 32

// The username can contain alphanumeric characters (first character must be a letter), dashes and underscores.
const usernameRe = new RegExp(`^[a-zA-Z][a-zA-Z0-9_-]{1,31}$`)

export function validateUsername(username: string, errors: GenericFormErrors<{ username?: FieldError }>) {
  if (!username) {
    errors.username = {
      type: "required",
      message: "Username is required.",
    }
  } else if (username.length < minUsernameLength || username.length > maxUsernameLength) {
    errors.username = {
      type: "validate",
      message: "Username must be 2-32 characters long.",
    }
  } else if (!usernameRe.test(username)) {
    errors.username = {
      type: "validate",
      message: "Username can only contain A-Z, a-z, 0-9, -, and _.",
    }
  }
}
