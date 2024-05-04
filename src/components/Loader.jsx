import React from 'react'

function Loader() {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-customPink animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-customPink animate-bounce [animation-delay:-.1s]"></div>
      <div className="w-4 h-4 rounded-full bg-customPink animate-bounce [animation-delay:-.2s]"></div>
    </div>
  )
}

export default Loader
