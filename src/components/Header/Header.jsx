import React, { useState } from 'react'
import { Container, Logo, LogOutBtn } from '../index.js'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import hamburger from '/hamburger.svg'
import closeIcon from '/close.svg'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

  const [navOpen, setNavOpen] = useState(false)

  const closeNavbar = () => {
    setNavOpen(false)
  }

  const toggleNavbar = () => {
    setNavOpen(!navOpen)
  }

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
    },
    // {
    //   name: 'Signup',
    //   slug: '/signup',
    //   active: !authStatus,
    // },
    {
      name: 'All Posts',
      slug: '/all-posts',
      active: authStatus,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      active: authStatus,
    },
  ]

  return (
    <>
      <header className="py-5 md:py-5 my-5 sticky top-0 z-50 px-0 md:px-10 bg-clip-padding">
        <Container>
          <nav className="flex justify-between flex-wrap items-center">
            <div className="">
              <Link to="/" onClick={closeNavbar}>
                {' '}
                <Logo width="70px" />{' '}
              </Link>
            </div>

            <div className="md:hidden mr-4">
              <button onClick={toggleNavbar}>
                <img src={navOpen ? closeIcon : hamburger} alt="" />
              </button>
            </div>

            <ul
              className={` ml-auto md:w-auto md:items-center md:flex-row  md:flex border-red-600 ${
                navOpen ? 'w-full flex flex-col items-center' : 'hidden'
              }`}
            >
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name} className="my-2 md:my-0">
                    <NavLink
                      to={item.slug}
                      onClick={closeNavbar}
                      className="inline-bock px-6 py-2 duration-200 hover:bg-slate-700  hover:text-gray-200 rounded-full"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ) : null,
              )}

              {authStatus ? (
                <li onClick={closeNavbar}>
                  {' '}
                  <LogOutBtn />{' '}
                </li>
              ) : (
                <li className="my-4 md:my-0">
                  {' '}
                  <NavLink
                    onClick={closeNavbar}
                    to={'/signup'}
                    className="md:ml-4 py-2 px-5 text-white button-custom rounded-xl shadow-sm hover:scale-105 duration-200 hover:cursor-pointer bg-customPink hover:bg-white hover:text-black"
                  >
                    {' '}
                    Signup{' '}
                  </NavLink>{' '}
                </li>
              )}
              <li className="inline-bock px-6 py-2 duration-200 hover:text-white">
                <a
                  href="https://github.com/Kunjshah20/Chai-Blog-Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:fill-gray-200 duration-300"
                >
                  <svg
                    width="30"
                    height="30"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    className="github-icon"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                      fill="#fff"
                      className="duration-300 hover:fill-gray-200"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </Container>
      </header>
    </>
  )
}

export default Header
