'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { button, div } from 'motion/react-client'

const Navbar = () => {
  const pathname = usePathname()
const [open, setOpen] = useState(false)
 
    const [loggedIn, setLoggedIn] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem("access")
    setLoggedIn(!!token)
    setOpen(false)
  }, [pathname])

  const logout = ()=>{
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setLoggedIn(false)
  }
  
  
 

  const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 }
}

  return (
    <>
      <motion.nav initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }} className='bg-gray-900 flex justify-between p-4 text-lg items-center'>

        <div className="logo text-red-300 text-2xl font-bold"><Link href='/'>Seems</Link></div>


        <div className="menu flex gap-2 items-center">
          <div className="">
            <ul variants={container}
      initial="hidden"
      animate="show" className='hidden md:flex gap-4 items-center'>
              <li variants={item}><Link href='/'>Home</Link></li>
              <li variants={item}><Link href='/contact'>Contact us</Link></li>
              <li variants={item}><Link href='/pricing'>Pricing</Link></li>
              <li variants={item}><Link href='/projects'>Project</Link></li>
              <li>{!loggedIn&& <div><button className="px-2 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-gray-700 transition">
                  <Link href={'/login'}>Login</Link>
                </button> <button className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition">
                 <Link href={'/register'}>Register</Link>
                </button></div> }</li>
            </ul>
          </div>
          <div className="hidden md:block ">
            {/* <input
              type="text"
              className='border-black border-2 rounded-2xl w-[170px] text-center mr-2'
              placeholder='Search...'
            />
            <button>🔍</button> */}
             {loggedIn &&(<button className=' border-2 border-red-600 rounded-2xl p-1' onClick={logout}>logout</button>)}
          </div>

<div>
  {/* <button
  className="md:hidden px-2 py-1 flex justify-center items-center mx-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
  aria-label="Search"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-6"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
</button> */}

</div>
          {/* Mobile Toggle Button */}
          <img
            src={open ? '/cross.svg' : '/hambeger.svg'}
            alt="menu toggle"
            onClick={() => setOpen(!open)}
            className="cursor-pointer w-[30px] md:hidden"
          />
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`bg-gray-600 fixed top-0 right-0 h-screen w-1/2
        transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        md:hidden`}
      >
        <div className="relative">

          <img
            src="/cross.svg"
            alt="close"
            onClick={() => setOpen(false)}
            className="cursor-pointer w-[30px] absolute top-2 right-2"
          />

          <ul variants={container}
      initial="hidden"
      animate="show" className='pr-[70] pt-[45] flex flex-col gap-6 items-center text-white border-b-2' >
              <li variants={item}><Link href='/'>Home</Link></li>
              <li variants={item}><Link href='/contact'>Contact us</Link></li>
              <li variants={item}><Link href='/pricing'>Pricing</Link></li>
              <li variants={item}><Link href='/projects'>Project</Link></li>
          </ul>
        {!loggedIn&&(  <div className=' border-b-2 border-b-white'>
            <Link href='/login'> <button className="px-2 py-1 m-1 border border-white text-white rounded-lg hover:bg-white hover:text-gray-700 transition">
              Login
            </button></Link>
            <Link href='/register'> <button className="px-2 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-200 transition">
              Register
            </button></Link>
          </div>)}

        </div>
      </aside>
    </>
  )
}

export default Navbar
