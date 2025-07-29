import React from 'react'
import { Link } from 'react-router-dom'
const Button = ({children, linkto, active}) => {
  return (
    <div>
        <Link to={linkto}>
            <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active ? "bg-yellow-50 text-richblue-900":"bg-richblack-800"} hover:scale-95 transitio duration-200`}>
                {children}
            </div>
         </Link>
    </div>
  )
}

export default Button
