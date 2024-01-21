import { FieldError } from "react-hook-form"
import { GenericFormErrors } from "../resolvers"

const maxSessionNameLength = 128

// Alphanumeric characters of any language, dashes, underscores, spaces, and special characters in the session name.
const wideRe = new RegExp(`^[\\p{L}\\p{N}\\p{Pd}\\p{Pc}\\p{Zs}\\p{Sc}\\p{Sk}!?@#$%^&*+\\(\\)\{\\}\[\\]]+$`, "u")

export function validateUsername(session_name: string, errors: GenericFormErrors<{ session_name?: FieldError }>) {
  if (session_name && session_name.length > maxSessionNameLength) {
    errors.session_name = {
      type: "validate",
      message: "Session name must be less than 128 characters long.",
    }
  } else if (session_name && !wideRe.test(session_name)) {
    errors.session_name = {
      type: "validate",
      message: "Session name contains invalid characters.",
    }
  }
}
