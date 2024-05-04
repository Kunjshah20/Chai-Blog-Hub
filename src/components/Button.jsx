import React from 'react'

function Button({
  children, // basically buttonText
  type = 'button',
  bgColor = 'bg-blue-600',
  textcolor = 'text-white',
  className = '',
  ...props
}) {
  return (
    <button
      className={`px-2 py-1 rounded-lg ${bgColor} ${textcolor} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
