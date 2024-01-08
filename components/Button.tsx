import Link from "next/link"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  title?: string
  href?: string
  disabled?: boolean
  className?: string
  onClick?: () => void
}

const Button = ({ children, title, href, disabled, className, onClick }: Props) => {
  const classes = `text-white bg-blue-600 ${disabled || "hover:bg-blue-800"}`
  if (!href) {
    return (
      <button disabled={disabled} onClick={onClick} type="button" className={`${classes} ${className}`} title={title}>
        {children}
      </button>
    )
  }

  return (
    <Link href={href} onClick={onClick} passHref className="flex justify-center">
      <button disabled={disabled} type="button" className={`${classes} ${className} w-full`} title={title}>
        {children}
      </button>
    </Link>
  )
}

export default Button
