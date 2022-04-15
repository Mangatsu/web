import path from "path"

export const Base64Placeholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk5pZ/CgABWgEUxJ+HIQAAAABJRU5ErkJggg=="

export function changeExtension(file: string, extension: string) {
  const basename = path.basename(file, path.extname(file))
  return path.join(path.dirname(file), `${basename}${extension}`)
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

export enum Role {
  Admin = 100,
  Member = 20,
  Viewer = 10,
  NoRole = 0,
}

export function getRole(role: number) {
  switch (role) {
    case Role.Admin:
      return "Admin"
    case Role.Member:
      return "Member"
    case Role.Viewer:
      return "Viewer"
    default:
      return "No role"
  }
}

interface JWTPayload {
  ID: string
  Subject: string
  Roles: number
}

export function decodeJWT(token: string) {
  const buffer = Buffer.from(token.split(".")[1], "base64")
  const payload: JWTPayload = JSON.parse(buffer.toString())
  return payload
}
