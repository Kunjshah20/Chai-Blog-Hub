import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogOutBtn() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const logoutHandler = async () => {
    try {
      setLoading(true)
      await authService.logout()
      dispatch(logout())
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <button
        className="inline-bock px-6 py-2 duration-200 hover:bg-slate-700 rounded-full"
        onClick={logoutHandler}
      >
        Logout
      </button>
    </>
  )
}

export default LogOutBtn
