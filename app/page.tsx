"use client"
import Image from "next/image";
import Card from './components/Card'
import Link from "next/link";
// import { useEffect ,useState} from "react";
import Skill from './components/skill'
import { motion } from "motion/react";
export default function Home() {

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
    <motion.section initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }} className="text-white ">
     <main className="bg-[url(/bg2.jpg)] bg-center bg-cover flex items-center justify-center flex-col w-full h-screen overflow-x-hidden">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-bold text-center p-4 text-3xl md:text-8xl"
      >
        Welcome To Portfolio
      </motion.h1>


      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, rotate: 10, y: 40 }}
        animate={{ opacity: 1, rotate: 0, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="font-bold text-2xl md:text-4xl text-center"
      >
        Take yourself online with us
      </motion.div>


      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-9 flex gap-4"
      >

        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 border-2 border-gray-500 rounded-2xl hover:text-black hover:bg-white w-[150px] cursor-pointer"
        >
          <Link href="/contact">Contact</Link>
        </motion.button>


        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 border-2 border-gray-500 rounded-2xl bg-white text-black cursor-pointer w-[150px]"
        >
          <Link href="/projects">Projects</Link>
        </motion.button>

      </motion.div>

    </main>
    </motion.section>
    <motion.section initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}>
      <h1 className=" text-2xl text-center font-bold text-red-300">Some Projects</h1>
      <Card/>
    </motion.section>
    <motion.section initial={{ opacity: 0 ,x:-100 }}
  whileInView={{ opacity: 1 , x:0 }}
  transition={{ duration: 0.8 }}>
      <div className="p-2 pl-4"><h1 className="font-bold text-red-300 text-2xl p-2 text-center">About the Developer</h1>
      <h2 className="font-bold  text-[20px]"> Hey I am Seems</h2>
      <h2 className="text-[15px] font-bold">Take your self and your bussisness online with me</h2>
      <motion.p  initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur necessitatibus magni rerum labore, alias excepturi sunt ea maiores voluptates cum, a sed voluptas dolores ipsum modi distinctio? Blanditiis, fugiat porro.</motion.p>
      <h2 className="text-2xl text-red-300 text-center">Coding Skills
      </h2>
<div>
  <Skill/>
</div>
      </div>
    </motion.section>
    </>
  );
}
