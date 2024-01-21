import { FieldError } from "react-hook-form"
import { Role } from "../../helpers"
import { GenericFormErrors } from "../resolvers"

const minRole = Role.NoRole + 1 // 0 is reserved for no role
const maxRole = Role.Admin

export function validateRole(role: number, errors: GenericFormErrors<{ role?: FieldError }>) {
  if ((role && role < minRole) || role > maxRole) {
    errors.role = {
      type: "validate",
      message: "Role must be between 0 and 100.",
    }
  }
}
