import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-slate-950 to-black">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-5 py-10 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold text-cyan-200">Seems Portfolio</h2>
          <p className="mt-3 max-w-sm text-sm text-slate-300">
            Professional portfolio and business websites with modern frontend,
            reliable backend integration, and production-ready delivery.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Quick Links
          </h3>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/" className="transition hover:text-cyan-200">
              Home
            </Link>
            <Link href="/projects" className="transition hover:text-cyan-200">
              Projects
            </Link>
            <Link href="/pricing" className="transition hover:text-cyan-200">
              Pricing
            </Link>
            <Link href="/contact" className="transition hover:text-cyan-200">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Contact
          </h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p>India</p>
            <a
              href="mailto:seems.developer@gmail.com"
              className="block transition hover:text-cyan-200"
            >
              seems.developer@gmail.com
            </a>
            <p>(+91) 9685-8227-21</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-slate-400">
        Copyright {year} Seems Portfolio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
