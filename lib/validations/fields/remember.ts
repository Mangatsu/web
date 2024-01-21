import { FieldError } from "react-hook-form"
import { GenericFormErrors } from "../resolvers"

const minCookieAge = 60 // 1 minute
const maxCookieAge = 60 * 60 * 24 * 365 // 1 year

export function validateRemember(remember: number, errors: GenericFormErrors<{ remember?: FieldError }>) {
  if ((remember && remember < minCookieAge) || remember > maxCookieAge) {
    errors.remember = {
      type: "validate",
      message: "Session length must be between 1 minute and 1 year in seconds.",
    }
  }
}
