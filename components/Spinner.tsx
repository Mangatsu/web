import { useEffect, useRef, useState } from "react"
// import useRouteChange from "../lib/hooks/useRouteChange"

const Spinner = () => {
  // const { routeChanging } = useRouteChange()
  const [shouldShowSpinner, setShouldShowSpinner] = useState(false)

  const timer = useRef<NodeJS.Timer>()

  useEffect(() => {
    /*    if (routeChanging) {
      timer.current = setTimeout(() => setShouldShowSpinner(true), 150)
    } else {
      setShouldShowSpinner(false)
      if (timer.current) {
        clearTimeout(timer.current)
      }
    } */
  }, [])

  if (!shouldShowSpinner) {
    return <div />
  }

  return (
    <svg className="spinner" viewBox="25 25 50 50">
      <circle className="spinner-path" cx="50" cy="50" r="20" fill="none" stroke="#fff" strokeWidth="3" />
    </svg>
  )
}

export default Spinner
