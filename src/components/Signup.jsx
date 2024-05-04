import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Loader, Logo } from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const signup = async (data) => {
    setLoading(true)
    setError('')
    try {
      const userData = await authService.createAccount(data)
      if (userData) {
        const currentUser = await authService.getCurrentUser()

        if (currentUser) dispatch(login(currentUser))
        navigate('/')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="items-center justify-center md:min-h-[80vh] text-sm">
        <div
          className={`mx-auto w-full md:max-w-sm rounded-xl p-5 md:p-8 border-slate-800 border `}
        >
          <div className="mb-4 flex justify-center">
            <span className="inline-block w-full max-w-[80px]">
              <Logo width="100%" />
            </span>
          </div>
          <h2 className="text-center text-lg font-bold leading-tight">
            Sign up to create account
          </h2>
          <p className="mt-2 text-center text-sm text-white/60">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-medium text-white/80 hover:text-white transition-all duration-200 hover:underline"
            >
              Sign In
            </Link>
          </p>
          {error && <p className="text-red-600 mt-6 text-center">{error}</p>}

          <form onSubmit={handleSubmit(signup)} className="mt-5">
            <div className="space-y-4">
              <Input
                label="Full Name: "
                placeholder="Enter your full name"
                className="focus:border-solid focus:border-x-2 focus:border-customPink"
                {...register('name', {
                  required: true,
                })}
              />
              <Input
                label="Email: "
                placeholder="Enter your email"
                className="focus:border-solid focus:border-x-2 focus:border-customPink"
                type="email"
                {...register('email', {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value,
                      ) || 'Email address must be a valid address',
                  },
                })}
              />
              <Input
                label="Password: "
                type="password"
                className="focus:border-solid focus:border-x-2 focus:border-customPink"
                placeholder="Enter your password"
                {...register('password', {
                  required: true,
                })}
              />
              {loading ? (
                <div className="w-full grid place-items-center">
                  {' '}
                  <Loader></Loader>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="my-3 py-2 px-4 w-full text-white bg-customPink button-custom rounded-lg shadow-lg hover:bg-[#EFFF3A] hover:text-black duration-400 hover:cursor-pointer"
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup
