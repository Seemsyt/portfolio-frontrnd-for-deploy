"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const API_BASE =
    (process.env.NEXT_PUBLIC_API_URL ||
      "https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/").replace(/\/+$/, "") +
    "/";

  useEffect(() => {
    const syncNavAuthState = async () => {
      const token = localStorage.getItem("access");
      setLoggedIn(!!token);
      setOpen(false);

      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.ok ? await res.json() : null;
        setIsAdmin(!!(data?.is_superuser || data?.is_staff));
      } catch {
        setIsAdmin(false);
      }
    };

    void syncNavAuthState();
    const handleAuthChange = () => {
      void syncNavAuthState();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [pathname, API_BASE]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("dashboard_secret");
    setLoggedIn(false);
    setIsAdmin(false);
    setOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  };

  const mobileMenu = {
    hidden: { x: "100%", opacity: 0.9 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut", when: "beforeChildren" },
    },
    exit: {
      x: "100%",
      opacity: 0.9,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  const mobileItem = {
    hidden: { opacity: 0, x: 24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex justify-between p-4 text-lg items-center w-[92vw] max-w-6xl mx-auto z-50 rounded-2xl border border-white/20 bg-black/30 backdrop-blur-md shadow-lg opacity-0"
      >
        <div className="logo text-red-300 text-2xl font-bold">
          <Link href="/">
            <Image src="/logo.png" alt="Seems" width={100} height={200}></Image>
          </Link>
        </div>

        <div className="menu flex gap-2 items-center">
          <div className="">
            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="hidden md:flex gap-4 items-center"
            >
              <motion.li variants={item}>
                <Link href="/">Home</Link>
              </motion.li>
              <motion.li variants={item}>
                <Link href="/contact">Contact us</Link>
              </motion.li>
              <motion.li variants={item}>
                <Link href="/pricing">Pricing</Link>
              </motion.li>
              <motion.li variants={item}>
                <Link href="/projects">Project</Link>
              </motion.li>
              {loggedIn && isAdmin && (
                <motion.li variants={item}>
                  <Link href="/xyzseemsxyz/projects_admin">CMS Dashboard</Link>
                </motion.li>
              )}
              
              <li>
                {!loggedIn && (
                  <div>
                    <button className="px-2 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-gray-700 transition">
                      <Link href={"/login"}>Login</Link>
                    </button>{" "}
                    <button className="px-2 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition">
                      <Link href={"/register"}>Register</Link>
                    </button>
                  </div>
                )}
              </li>
            </motion.ul>
          </div>
          <div className="hidden md:block ">
            {/* <input
              type="text"
              className='border-black border-2 rounded-2xl w-[170px] text-center mr-2'
              placeholder='Search...'
            />
            <button>🔍</button> */}
            {loggedIn && (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  aria-label="Open profile"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition hover:bg-white hover:text-slate-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="8" r="4" />
                  </svg>
                </Link>
                <button
                  className=" border-2 border-red-600 rounded-2xl p-1"
                  onClick={logout}
                >
                  logout
                </button>
              </div>
            )}
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
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-full border border-white/30 bg-white/10 p-2 backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Toggle menu"
          >
            <img
              src={open ? "/cross.svg" : "/hambeger.svg"}
              alt="menu toggle"
              className="w-6"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] md:hidden z-40"
              onClick={() => setOpen(false)}
            />

            <motion.aside
              variants={mobileMenu}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed top-0 right-0 z-50 h-screen w-[78%] max-w-xs md:hidden rounded-l-3xl border-l border-white/20 bg-slate-900/90 p-6 text-white shadow-2xl backdrop-blur-lg"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 rounded-full border border-white/30 bg-white/10 p-2 transition hover:bg-white/20"
                aria-label="Close menu"
              >
                <img src="/cross.svg" alt="close" className="w-5" />
              </button>

              <motion.ul
                variants={container}
                initial="hidden"
                animate="show"
                className="mt-14 flex flex-col gap-4 text-lg"
              >
                <motion.li variants={mobileItem}>
                  <Link
                    href="/"
                    className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
                  >
                    Home
                  </Link>
                </motion.li>
                <motion.li variants={mobileItem}>
                  <Link
                    href="/contact"
                    className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
                  >
                    Contact us
                  </Link>
                </motion.li>
                <motion.li variants={mobileItem}>
                  <Link
                    href="/pricing"
                    className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
                  >
                    Pricing
                  </Link>
                </motion.li>
                <motion.li variants={mobileItem}>
                  <Link
                    href="/projects"
                    className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
                  >
                    Project
                  </Link>
                </motion.li>
                {loggedIn && isAdmin && (
                  <motion.li variants={mobileItem}>
                    <Link
                      href="/xyzseemsxyz/projects_admin"
                      className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
                    >
                      CMS Dashboard
                    </Link>
                  </motion.li>
                )}
                {loggedIn && (
                  <motion.li variants={mobileItem}>
                    <Link
                      href="/profile"
                      className="block rounded-xl px-4 py-3 transition hover:bg-white/10"
                    >
                      Profile
                    </Link>
                  </motion.li>
                )}
              </motion.ul>

              {!loggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.25 }}
                  className="mt-8 flex gap-2 border-t border-white/20 pt-5"
                >
                  <Link href="/login" className="w-1/2">
                    <button className="w-full rounded-xl border border-white/30 bg-transparent px-3 py-2 font-medium text-white transition hover:bg-white hover:text-slate-900">
                      Login
                    </button>
                  </Link>
                  <Link href="/register" className="w-1/2">
                    <button className="w-full rounded-xl bg-cyan-300 px-3 py-2 font-medium text-slate-900 transition hover:bg-cyan-200">
                      Register
                    </button>
                  </Link>
                </motion.div>
              )}

              {loggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.25 }}
                  className="mt-8 border-t border-white/20 pt-5"
                >
                  <button
                    onClick={logout}
                    className="w-full rounded-xl border border-red-400/70 bg-red-500/10 px-3 py-2 font-medium text-red-200 transition hover:bg-red-500/20"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
