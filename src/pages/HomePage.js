import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className='w-full '>
        {/* navigation bar */}
        <nav className='p-4 w-full flex items-center justify-between'>
            <div>
                <h1 className='text-3xl font-bold'>
                    Task Manager
                </h1>
            </div>
            <div className='flex items-center gap-2'>
                <Link className='bg-gray-100 p-1 px-2 border-gray-400 border-[1px] border-solid rounded-md shadow-lg font-semibold' to={"/login"}>Log in as admin</Link>
                <Link className=' p-1 px-2 bg-blue-500 text-white border-gray-400 border-[1px] border-solid rounded-md shadow-lg font-semibold' to={"/user-login"}>Log in as user</Link>
            </div>
        </nav>

        <main className='w-[80%] mx-auto mt-48 flex flex-col gap-4'>
            <h1 className='text-7xl flex flex-col font-bold'>
                <span>Create, Manage</span>
                <span>Tasks at</span>
                <span className='text-blue-500'>TaskManager</span>
            </h1>
            <h2 className='text-[1.2rem] font-semibold text-gray-500 capitalize ml-3'>register/login to unlock the features of task manager</h2>
        </main>
    </div>
  )
}

export default HomePage