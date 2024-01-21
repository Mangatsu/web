import { FieldError } from "react-hook-form"

interface Props {
  error?: FieldError
}

const InputError = ({ error }: Props) => {
  return <p className="text-red-500">{error?.message ? error.message : "\u00A0"}</p>
}

export default InputError
