import { FieldError } from "react-hook-form"
import { validatePassword, validatePasswordConfirm } from "./fields/password"
import { validateRemember } from "./fields/remember"
import { validateRole } from "./fields/role"
import { validateUsername } from "./fields/username"

export type GenericFormErrors<T> = {
  [P in keyof T]?: FieldError
}

interface NewUserFormData {
  username: string
  password: string
  role: number
}

export const newUserFormResolver = async (values: NewUserFormData) => {
  const errors: {
    username?: FieldError
    password?: FieldError
    role?: FieldError
  } = {}

  validateUsername(values.username, errors)
  validatePassword(values.password, errors)
  validateRole(values.role, errors)

  return { values, errors }
}

interface NewPasswordFormData {
  password: string
  confirmPassword: string
}

export const newPasswordFormResolver = async (values: NewPasswordFormData) => {
  const errors: {
    password?: FieldError
  } = {}

  validatePassword(values.password, errors)
  validatePasswordConfirm(values.password, values.confirmPassword, errors)

  return { values, errors }
}

interface LoginFormData {
  username: string
  password: string
  // session_name: string
  remember: number
}

export const loginFormResolver = async (values: LoginFormData) => {
  const errors: {
    username?: FieldError
    password?: FieldError
    // session_name?: FieldError
    remember?: FieldError
  } = {}

  validateUsername(values.username, errors)
  validatePassword(values.password, errors)
  validateRemember(values.remember, errors)

  return { values, errors }
}

interface AnonymousLoginFormData {
  passphrase: string
}

export const anonymousLoginFormResolver = async (values: AnonymousLoginFormData) => {
  const errors: {
    passphrase?: FieldError
  } = {}

  if (!values.passphrase) {
    errors.passphrase = {
      type: "required",
      message: "Passphrase is required.",
    }
  }

  return { values, errors }
}
