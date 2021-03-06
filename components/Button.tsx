import Link from "next/link"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  title?: string
  href?: string
  onClick?: () => void
  className?: string
}

const Button = ({ children, title, href, onClick, className }: Props) => {
  const classes = "text-white bg-blue-600 hover:bg-blue-800"
  if (!href) {
    return (
      <button onClick={onClick} type="button" className={`${classes} ${className}`} title={title}>
        {children}
      </button>
    )
  }

  return (
    <Link href={href} passHref>
      <button type="button" onClick={onClick} className={`${classes} ${className}`} title={title}>
        {children}
      </button>
    </Link>
  )
}

export default Button
