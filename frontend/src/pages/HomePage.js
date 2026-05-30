import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Arrow icon SVG used in buttons
const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.00033 17.3334C13.6027 17.3334 17.3337 13.6025 17.3337 9.00008C17.3337 4.39771 13.6027 0.666748 9.00033 0.666748C4.39795 0.666748 0.666992 4.39771 0.666992 9.00008C0.666992 13.6025 4.39795 17.3334 9.00033 17.3334Z" stroke="currentColor" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.9502 11.9419L10.8835 9.00026L7.9502 6.05859" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownArrowIcon = ({ color = 'white' }) => (
  <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.852539 9.75858L9.50003 1.11572L18.1475 9.75858" stroke={color} strokeWidth="1.57447"/>
  </svg>
);

export default function HomePage() {
  const { user } = useAuth();
  const loginPath = user ? '/dashboard' : '/login';
  const registerPath = user ? '/dashboard' : '/login?tab=register';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  // Lock body scroll when menu open
  if (typeof document !== 'undefined') {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }
  

  return (
    <div className="w-full relative overflow-x-hidden font-urbanist bg-[#eff6ff]">

      {/* Header */}
      <header className={`w-screen min-[1420px]:w-[1430px] min-[1420px]:mx-auto min-[1420px]:rounded-[100px] min-[1420px]:px-10 transition-all duration-500 text-white fixed min-[1420px]:top-7 min-[1420px]:left-1/2 min-[1420px]:-translate-x-1/2 h-[70px] sm:h-[80px] lg:h-[90px] z-[5001] shadow-[0px_4px_10px_1px_rgba(0,0,0,0.1)] bg-white backdrop-blur-sm ${scrolled ? 'bg-opacity-90' : 'bg-opacity-10'}`}>
        <div className="mx-auto w-[1450px] px-5 max-w-full h-full">
          <div className="flex flex-row items-center justify-between h-full -mx-3">
            <div className="px-3">
              <Link to="/" className="flex flex-row items-center no-underline">
                <span className="mr-2">
                  <img src="images/logo.svg" alt="WanderLog" className="w-auto h-[9vw] min-[480px]:h-[45px]" />
                </span>
                <span className="text-[3.5vw] min-[480px]:text-base lg:text-[20px] leading-none font-bold text-[#636bab]">Wanderlog</span>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="px-3 lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                aria-label="Toggle menu"
              >
                <span className={`block w-9 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-9 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-9 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>

            {/* Desktop nav */}
            <div className="px-3 hidden lg:block">
              <div className="flex flex-row flex-wrap items-center -mx-5">
                {[['#how-it-works','How it works'],['#features','Features'],['#destinations','Destinations']].map(([href, label]) => (
                  <div key={href} className="px-5">
                    <a href={href} className="text-slate-800 text-base uppercase relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-[#636bab] hover:before:w-full before:transition-all before:duration-300">{label}</a>
                  </div>
                ))}
                <div className="px-5">
                  <div className="flex items-center gap-2">
                    <Link to={loginPath} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-gray-800 bg-white border border-slate-200 cursor-pointer transition-shadow hover:shadow-md uppercase">Log in</Link>
                    <Link to={registerPath} className="inline-block min-h-[38px] bg-[#636BAB] border border-[#636BAB] text-white rounded-[42px] px-5 py-2 transition-all duration-300 hover:bg-[#636BAB]/70 text-base font-medium uppercase">Get started</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[4999] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 right-0 z-[5000] h-full w-72 bg-white flex flex-col shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer header — just close button, no logo */}
        <div className="flex items-center justify-end px-4 py-4 border-b border-slate-100">
            <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors text-sm font-bold"
            aria-label="Close menu"
            >
            ✕
            </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {[['#how-it-works','How it works'],['#features','Features'],['#destinations','Destinations']].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-slate-600 font-medium hover:bg-[#DEE2FF]/40 hover:text-[#636BAB] transition-all duration-200 uppercase text-sm tracking-wide"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="px-4 py-6 border-t border-slate-100 flex flex-col gap-3">
          <Link
            to={loginPath}
            onClick={() => setMenuOpen(false)}
            className="w-full text-center py-3 rounded-full border border-[#636BAB] text-[#636BAB] font-semibold text-sm hover:bg-[#636BAB]/5 transition-colors"
          >
            Log in
          </Link>
          <Link
            to={loginPath}
            onClick={() => setMenuOpen(false)}
            className="w-full text-center py-3 rounded-full bg-[#636BAB] text-white font-semibold text-sm hover:bg-[#636BAB]/80 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="w-full sm:h-dvh relative block pb-10 sm:pb-16 md:pb-20 overflow-hidden pt-[130px] sm:pt-[180px] lg:pt-[200px]">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-200/50 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <svg width="2929" height="1565" viewBox="0 0 2929 1565" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full hidden sm:block"> 
                <path opacity="0.1" d="M12.5118 336.888C264.057 319.08 765.189 348.573 933.039 91.3485C1096.99 -159.897 69.3965 242.529 373.895 552.073C729.834 913.909 2315.4 134.646 1791.14 137.367C1497.84 138.89 741.3 752.288 1163.65 879.862C1700.94 1042.15 2791.82 439.628 2618.32 329.253C2312.25 134.535 1258.46 983.05 1688.35 1172.21C2200.98 1397.77 3040.25 906.749 2875.42 718.147C2743.55 567.264 2142.62 1207.37 2915.94 1552.5" stroke="#0E7490" stroke-width="25" stroke-linecap="round"/>
            </svg>
        </div>

        <div className="max-w-[1420px] h-full mx-auto px-5 relative z-20">
          <div className="flex flex-row flex-wrap items-center justify-center h-full -mx-5">
            <div className="px-5 w-full text-center">
              <div className="relative inline-block mb-6">
                <span className="text-xs uppercase tracking-widest text-[#636BAB] font-semibold bg-[#DEE2FF] px-4 py-1.5 rounded-full">Your travel companion</span>
              </div>
              <h1 className="font-black text-3xl sm:text-4xl min-[1440px]:text-6xl text-center px-5 leading-[115%] xl:tracking-[0.72px] mb-5 uppercase relative text-slate-800">
                Log your journeys, <span className="relative inline-block text-[#636BAB]">explore</span> the world
              </h1>
              <p className="text-base sm:text-lg min-[1440px]:text-xl leading-tight tracking-normal text-neutral-400 max-w-xl mx-auto relative mb-8">
                Plan trips, track visited countries, log memories, and discover your next destination — all in one beautiful place.
              </p>
              <div className="flex flex-row flex-wrap items-center justify-center gap-3 -mx-2">
                <div className="px-2">
                  <Link to={registerPath} className="inline-flex items-center gap-2 min-h-[38px] bg-[#636BAB] border border-[#636BAB] text-white rounded-[42px] px-5 py-2 transition-all duration-300 hover:bg-[#636BAB]/70 text-base font-medium">
                    Start now <ArrowIcon />
                  </Link>
                </div>
                <div className="px-2">
                  <a href="#how-it-works" className="inline-flex items-center gap-2 min-h-[38px] bg-transparent border border-[#636BAB] text-[#636BAB] rounded-[42px] px-5 py-2 transition-all duration-300 hover:bg-[#636BAB] hover:text-white text-base font-medium">
                    See how it works <ArrowIcon />
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-row flex-wrap items-center justify-center pt-14 -mx-4">
                {[
                  ['1,200+', 'Travellers'],
                  ['250', 'Countries'],
                  ['4,800+', 'Trips Logged'],
                  ['9,300+', 'Reviews Written'],
                ].map(([val, label], i) => (
                  <div key={label} className={`px-6 mt-6 text-center tracking-normal ${i > 0 ? 'border-l border-[#636BAB]/30' : ''}`}>
                    <div className="text-4xl font-black text-[#636BAB]">{val}</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="w-full relative block py-10 sm:py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1420px] mx-auto px-5 relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl mb-10 md:mb-14 xl:mb-16 text-center text-stone-800 leading-[120%] font-black w-full">
            <span className="relative pr-6">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block absolute right-0 -top-2 max-w-[18px] md:max-w-[23px] fill-[#636bab]">
                <path d="M40 19.9857C32.1541 20.6985 27.6462 21.3542 24.8787 23.521C21.6262 26.0584 20.8559 30.7056 20 40C19.1155 30.3635 18.3167 25.7448 14.7504 23.2644C11.9829 21.3257 7.50357 20.6985 0 20.0143C7.8174 19.3015 12.3538 18.6458 15.0927 16.5075C18.3738 13.9416 19.1441 9.32288 20 0C20.7989 8.58161 21.5121 13.1718 24.1655 15.8232C26.8188 18.4747 31.4408 19.216 40 19.9857Z"/>
              </svg>
              How it works
            </span>
          </h2>

          <div className="flex flex-row flex-wrap justify-center -mx-4">
            {[
                { img: '/images/screenshots/explore-countries.jpg', title: 'Explore Countries', desc: 'Browse 250 countries with real-time weather, local info, currency, timezone, and more. Powered by REST Countries and OpenWeatherMap APIs.', overlay: '#636BAB' },
                { img: '/images/screenshots/trips.jpg', title: 'Log Your Trips', desc: 'Log every trip — add dates, destinations, a description, and your personal status. Keep your travel history in one place and easily switch between planned, ongoing, and completed trips.', overlay: '#E4C2C6' },
                { img: '/images/screenshots/reviews.png', title: 'Review & Remember', desc: 'Rate and review every trip. Share your highlights, tips, and memories. Look back on every adventure with the detail it deserves.', overlay: '#CBC0D3' },
                ].map(({ img, title, desc, overlay }) => (
                <div key={title} className="w-full md:w-1/2 min-[1200px]:w-1/3 p-4">
                    <div className="w-full md:h-full block rounded-[20px] lg:rounded-[30px] shadow-lg relative overflow-hidden transition-all">

                    {/* Image — always visible, fills the top */}
                    <div className="w-full h-[200px] min-[575px]:h-[280px] relative">
                        <img src={img} alt={title} className="object-cover object-top w-full h-full" />
                    </div>

                    {/* Hover overlay — slides up from bottom on desktop */}
                    <div
                        className="group hidden min-[575px]:flex flex-col absolute bottom-0 h-[30%] hover:h-[80%] left-0 w-full px-5 py-6 z-20 items-center justify-center rounded-[20px] lg:rounded-[30px] font-semibold text-2xl lg:text-3xl leading-[120%] transition-all duration-[950ms]"
                        style={{ backgroundColor: `${overlay}E6` }}
                    >
                        <div className="opacity-0 group-hover:opacity-100 text-sm text-white transition-all duration-[950ms] ease-in-out absolute top-auto right-auto z-20 px-5 py-6 font-normal">{desc}</div>
                        <div className="opacity-100 group-hover:opacity-0 transition-all duration-[950ms] text-white ease-in-out relative z-10">{title}</div>
                        <svg
                        className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%_-_1px)] w-auto max-w-[70%] sm:max-w-[180px] h-auto"
                        style={{ fill: overlay, opacity: 0.9 }}
                        width="317" height="39" viewBox="0 0 317 39" fill="none" xmlns="http://www.w3.org/2000/svg"
                        >
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 38.6407C0 38.6407 51.41 33.6807 87.5 14.9507C123.59 -3.77927 180.12 -3.89927 213.5 8.96073C246.88 21.8207 286.84 38.6507 316.5 38.6507H0V38.6407Z"/>
                        </svg>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-10 group-hover:rotate-180 transition-all duration-[950ms]">
                        <DownArrowIcon />
                        </div>
                    </div>

                    {/* Mobile — static bottom bar */}
                    <div
                        className="flex flex-col min-[575px]:hidden px-5 py-6 justify-center rounded-b-[20px] font-semibold leading-[120%]"
                        style={{ backgroundColor: overlay }}
                    >
                        <div className="text-white text-left mb-2 text-lg">{title}</div>
                        <div className="text-sm text-white font-normal">{desc}</div>
                    </div>

                    </div>
                </div>
                ))}
          </div>
        </div>
      </section>

      {/* Your travels deserve section */}
      <section className="w-full h-auto relative block py-[50px] md:py-[70px] lg:py-[100px] overflow-hidden">
        <div className="max-w-[1420px] h-full mx-auto px-5 relative">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl text-center font-medium leading-[120%] text-stone-800 mb-10 md:mb-14 lg:mb-24">Your travels deserve more than scattered notes, faded memories and forgotten details</h2>
          <div className="w-full min-[1100px]:w-[1060px] lg:mx-auto">
            <div className="flex flex-col">

              {/* Item 1 — left */}
              <div className="w-full md:w-[630px] min-[865px]:w-[705px] lg:w-[755px] pb-[55px] lg:pb-[90px] relative">
                <div className="rounded-[20px] border-[2.5px] border-[#636BAB] p-4 md:p-6 lg:py-8 lg:px-7 flex items-center">
                  <div className="pl-[60px] md:pl-[80px] lg:pl-[102px] relative flex flex-row items-center">
                    <div className="absolute size-[50px] md:size-[60px] lg:size-[80px] top-0 left-0 flex items-center justify-center rounded-full bg-[#636BAB]/5 border border-[#636BAB]/5">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-[25px] md:max-w-[30px] lg:max-w-[40px] fill-[#636BAB]">
                        <path d="M37.5 28H25.5C24.68 28 24 27.32 24 26.5C24 25.68 24.68 25 25.5 25H37.5C38.32 25 39 25.68 39 26.5C39 27.32 38.32 28 37.5 28Z"/>
                        <path d="M37.5 36H25.5C24.68 36 24 35.32 24 34.5C24 33.68 24.68 33 25.5 33H37.5C38.32 33 39 33.68 39 34.5C39 35.32 38.32 36 37.5 36Z"/>
                        <path opacity="0.4" d="M40 13.0552V3.9646C40 1.14133 38.72 0 35.54 0H27.46C24.28 0 23 1.14133 23 3.9646V13.0351C23 15.8784 24.28 16.9997 27.46 16.9997H35.54C38.72 17.0198 40 15.8784 40 13.0552Z"/>
                        <path d="M17 13.0552V3.9646C17 1.14133 15.72 0 12.54 0H4.46C1.28 0 0 1.14133 0 3.9646V13.0351C0 15.8784 1.28 16.9997 4.46 16.9997H12.54C15.72 17.0198 17 15.8784 17 13.0552Z"/>
                        <path opacity="0.4" d="M17 35.54V27.46C17 24.28 15.72 23 12.54 23H4.46C1.28 23 0 24.28 0 27.46V35.54C0 38.72 1.28 40 4.46 40H12.54C15.72 40 17 38.72 17 35.54Z"/>
                      </svg>
                    </div>
                    <div className="text-left text-slate-800 leading-tight">
                      <p className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl mb-1.5 md:mb-3 xl:mb-5 font-medium">One Place for Everything</p>
                      <p className="text-sm md:text-base leading-[140%] text-neutral-500 font-light">No more jumping between apps, notes, and photos. Every trip, every country, every memory — organised and accessible whenever you need it.</p>
                    </div>
                  </div>
                </div>
                <div className="w-[80px] lg:w-[110px] h-[35px] md:h-[50px] lg:h-[80px] absolute bottom-2.5 lg:bottom-7 right-1/2 md:-right-[90px] lg:-right-[150px] md:translate-x-0 border-[3px] border-dashed border-l-transparent border-b-transparent border-r-[#CBC0D3] md:border-t-[#CBC0D3] border-t-transparent md:rounded-tr-[20px]" />
              </div>

              {/* Item 2 — right */}
              <div className="flex flex-col items-end">
                <div className="w-full md:w-[630px] min-[865px]:w-[705px] lg:w-[755px] pb-[55px] lg:pb-[90px] relative">
                  <div className="rounded-[20px] border-[2.5px] border-[#636BAB] p-4 md:p-6 lg:py-8 lg:px-7 flex items-center">
                    <div className="pl-[60px] md:pl-[80px] lg:pl-[102px] relative flex flex-row items-center">
                      <div className="absolute size-[50px] md:size-[60px] lg:size-[80px] top-0 left-0 flex items-center justify-center rounded-full bg-[#636BAB]/5 border border-[#636BAB]/5">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-[25px] md:max-w-[30px] lg:max-w-[40px]">
                          <path d="M36.6663 37.9166H8.33301C4.88301 37.9166 2.08301 35.1166 2.08301 31.6666V3.33325C2.08301 2.64992 2.64967 2.08325 3.33301 2.08325C4.01634 2.08325 4.58301 2.64992 4.58301 3.33325V31.6666C4.58301 33.7333 6.26634 35.4166 8.33301 35.4166H36.6663C37.3497 35.4166 37.9163 35.9833 37.9163 36.6666C37.9163 37.3499 37.3497 37.9166 36.6663 37.9166Z" fill="#636BAB"/>
                          <path opacity="0.4" d="M8.33369 29.5834C8.05035 29.5834 7.75035 29.4834 7.51702 29.2834C7.00035 28.8334 6.93369 28.05 7.38369 27.5167L15.0337 18.5834C15.867 17.6167 17.067 17.0334 18.3337 16.9834C19.6004 16.95 20.8504 17.4167 21.7504 18.3167L23.3337 19.9C23.7504 20.3167 24.2837 20.5167 24.8837 20.5167C25.467 20.5 26.0004 20.2334 26.3837 19.7834L34.0337 10.85C34.4837 10.3334 35.267 10.2667 35.8004 10.7167C36.317 11.1667 36.3837 11.95 35.9337 12.4833L28.2837 21.4167C27.4504 22.3834 26.2504 22.9667 24.9837 23.0167C23.7004 23.05 22.467 22.5834 21.567 21.6834L20.0004 20.1C19.5837 19.6834 19.0337 19.4667 18.4504 19.4834C17.867 19.5 17.3337 19.7667 16.9504 20.2167L9.30035 29.15C9.03369 29.4333 8.68369 29.5834 8.33369 29.5834Z" fill="#636BAB"/>
                        </svg>
                      </div>
                      <div className="text-left text-slate-800 leading-tight">
                        <p className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl mb-1.5 md:mb-3 xl:mb-5 font-medium">Always Up to Date</p>
                        <p className="text-sm md:text-base leading-[140%] text-neutral-500 font-light">Live weather, real country data, and current travel information pulled automatically. You focus on the journey, WanderLog handles the details.</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-[80px] lg:w-[110px] h-[35px] md:h-[50px] lg:h-[80px] absolute bottom-2.5 lg:bottom-7 left-1/2 md:-left-[90px] lg:-left-[150px] md:translate-x-0 border-[3px] border-dashed border-r-transparent border-b-transparent border-l-[#CBC0D3] md:border-t-[#CBC0D3] border-t-transparent md:rounded-tl-[20px]" />
                </div>
              </div>

              {/* Item 3 — left */}
              <div className="w-full md:w-[630px] min-[865px]:w-[705px] lg:w-[755px] pb-[55px] lg:pb-[90px] relative">
                <div className="rounded-[20px] border-[2.5px] border-[#636BAB] p-4 md:p-6 lg:py-8 lg:px-7 flex items-center">
                  <div className="pl-[60px] md:pl-[80px] lg:pl-[102px] relative flex flex-row items-center">
                    <div className="absolute size-[50px] md:size-[60px] lg:size-[80px] top-0 left-0 flex items-center justify-center rounded-full bg-[#636BAB]/5 border border-[#636BAB]/5">
                      <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-[25px] md:max-w-[30px] lg:max-w-[40px] fill-[#636BAB]">
                        <path d="M38.5 4H24.5C23.68 4 23 3.32 23 2.5C23 1.68 23.68 1 24.5 1H38.5C39.32 1 40 1.68 40 2.5C40 3.32 39.32 4 38.5 4Z"/>
                        <path opacity="0.4" d="M38.5 15H24.5C23.68 15 23 14.32 23 13.5C23 12.68 23.68 12 24.5 12H38.5C39.32 12 40 12.68 40 13.5C40 14.32 39.32 15 38.5 15Z"/>
                        <path d="M38.4615 26H1.53846C0.697436 26 0 25.32 0 24.5C0 23.68 0.697436 23 1.53846 23H38.4615C39.3026 23 40 23.68 40 24.5C40 25.32 39.3026 26 38.4615 26Z"/>
                        <path opacity="0.4" d="M38.4615 36H1.53846C0.697436 36 0 35.32 0 34.5C0 33.68 0.697436 33 1.53846 33H38.4615C39.3026 33 40 33.68 40 34.5C40 35.32 39.3026 36 38.4615 36Z"/>
                        <path opacity="0.4" d="M12.2297 0H5.7475C2.55207 0 1 1.64907 1 5.04422V11.9558C1 15.3509 2.55207 17 5.7475 17H12.2525C15.4479 17 17 15.3509 17 11.9558V5.04422C16.9772 1.64907 15.4251 0 12.2297 0Z"/>
                      </svg>
                    </div>
                    <div className="text-left text-slate-800 leading-tight">
                      <p className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl mb-1.5 md:mb-3 xl:mb-5 font-medium">Your Story, Your Way</p>
                      <p className="text-sm md:text-base leading-[140%] text-neutral-500 font-light">Rate your experiences, write personal reviews, and build a travel journal that's uniquely yours. Look back on every adventure with the detail it deserves.</p>
                    </div>
                  </div>
                </div>
                <div className="w-[80px] lg:w-[110px] h-[35px] md:h-[50px] lg:h-[80px] absolute bottom-2.5 lg:bottom-7 right-1/2 md:-right-[90px] lg:-right-[150px]  md:translate-x-0 border-[3px] border-dashed border-l-transparent border-b-transparent border-r-[#CBC0D3] md:border-t-[#CBC0D3] border-t-transparent md:rounded-tr-[20px]" />
              </div>

              {/* Item 4 — right */}
              <div className="flex flex-col items-end">
                <div className="w-full md:w-[630px] min-[865px]:w-[705px] lg:w-[755px] relative">
                  <div className="rounded-[20px] border-[2.5px] border-[#636BAB] p-4 md:p-6 lg:py-8 lg:px-7 flex items-center">
                    <div className="pl-[60px] md:pl-[80px] lg:pl-[102px] relative flex flex-row items-center">
                      <div className="absolute size-[50px] md:size-[60px] lg:size-[80px] top-0 left-0 flex items-center justify-center rounded-full bg-[#636BAB]/5 border border-[#636BAB]/5">
                        <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-[25px] md:max-w-[30px] lg:max-w-[40px]">
                          <path opacity="0.4" d="M26.2167 9.9499C26.1001 9.9333 25.9834 9.9333 25.8667 9.9499C23.2834 9.8666 21.2334 7.7499 21.2334 5.14992C21.2334 2.49992 23.3834 0.333252 26.0501 0.333252C28.7001 0.333252 30.8667 2.48325 30.8667 5.14992C30.8501 7.7499 28.8001 9.8666 26.2167 9.9499Z" fill="#636BAB"/>
                          <path opacity="0.4" d="M31.6494 21.4999C29.7827 22.7499 27.166 23.2166 24.7494 22.8999C25.3827 21.5333 25.716 20.0166 25.7327 18.4166C25.7327 16.7499 25.366 15.1666 24.666 13.7833C27.1327 13.4499 29.7493 13.9166 31.6327 15.1666C34.266 16.8999 34.266 19.7499 31.6494 21.4999Z" fill="#636BAB"/>
                          <path opacity="0.4" d="M7.734 9.9499C7.8506 9.9333 7.9673 9.9333 8.084 9.9499C10.6673 9.8666 12.7173 7.7499 12.7173 5.14992C12.7173 2.49992 10.5673 0.333252 7.9007 0.333252C5.25065 0.333252 3.08398 2.48325 3.08398 5.14992C3.10065 7.7499 5.15065 9.8666 7.734 9.9499Z" fill="#636BAB"/>
                          <path opacity="0.4" d="M7.9169 18.4167C7.9169 20.0333 8.2669 21.5667 8.9002 22.95C6.55019 23.2 4.1002 22.7 2.3002 21.5167C-0.33314 19.7667 -0.33314 16.9167 2.3002 15.1667C4.08353 13.9667 6.6002 13.4833 8.9669 13.75C8.2835 15.15 7.9169 16.7334 7.9169 18.4167Z" fill="#636BAB"/>
                          <path d="M17.2 23.45C17.0667 23.4333 16.9167 23.4333 16.7667 23.45C13.7 23.35 11.25 20.8333 11.25 17.7333C11.25 14.5667 13.8 12 16.9833 12C20.15 12 22.7167 14.5667 22.7167 17.7333C22.7167 20.8333 20.2833 23.35 17.2 23.45Z" fill="#636BAB"/>
                          <path d="M11.783 26.8999C9.26633 28.5832 9.26633 31.3499 11.783 33.0166C14.6497 34.9332 19.3497 34.9332 22.2163 33.0166C24.733 31.3332 24.733 28.5666 22.2163 26.8999C19.3663 24.9832 14.6663 24.9832 11.783 26.8999Z" fill="#636BAB"/>
                        </svg>
                      </div>
                      <div className="text-left text-slate-800 leading-tight">
                        <p className="text-lg md:text-xl xl:text-2xl 2xl:text-3xl mb-1.5 md:mb-3 xl:mb-5 font-medium">Track Your Progress</p>
                        <p className="text-sm md:text-base leading-[140%] text-neutral-500 font-light">Watch your travel stats grow with every trip. See which regions you've explored, discover gaps on your map, and find inspiration for where to go next.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full relative block py-10 sm:py-16 md:py-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#DEE2FF]/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#EFD3D7]/50 rounded-full blur-3xl" />
        <div className="max-w-[1420px] mx-auto px-5 relative z-10">
          <div className="flex flex-row flex-wrap justify-center lg:justify-normal items-center -mx-5">
            <div className="px-5 w-full lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left">
              <span className="text-xs uppercase tracking-widest text-[#636BAB] font-semibold bg-[#DEE2FF]/60 px-4 py-1.5 rounded-full inline-block mb-5">Everything you need</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 leading-[115%] mb-6">
                Your trips.<span className="block min-[480px]:inline lg:block">Your memories.</span><span className="block min-[480px]:inline lg:block text-[#636BAB]">Your world.</span>
              </h2>
              <p className="text-base text-slate-500 leading-relaxed md-3 lg:mb-8 lg:max-w-md">
                WanderLog brings together everything a traveller needs — real country data, live weather, a personal trip journal, and a clean dashboard to track it all.
              </p>
            </div>
            <div className="px-5 w-full lg:w-1/2">
                <div className="flex flex-col -mt-4">
                    {[
                    {
                        bg: 'from-[#DEE2FF] to-[#636BAB]/30',
                        title: 'Live Weather per Country',
                        desc: 'Check real-time weather for any destination before you plan. Powered by OpenWeatherMap.',
                        icon: (
                        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.4" d="M18.6 7.03748C17.83 6.11748 16.84 5.51748 15.69 5.25748C15.43 4.09748 14.98 3.09748 14.32 2.26748C14.3 2.23748 14.28 2.20748 14.26 2.18748C12.06 -0.472518 8.46 -0.462518 6.03 0.917482C3.95 2.10748 2.18 4.61748 3.11 8.19748C0.98 8.71748 0 10.5775 0 12.2575C0 14.1375 1.23 16.2475 3.97 16.4475H14.31C14.32 16.4475 14.34 16.4475 14.35 16.4475C15.77 16.4475 17.13 15.9175 18.18 14.9575C20.69 12.7375 20.36 9.11748 18.6 7.03748Z" fill="#292D32"/>
                            <path d="M19.7492 4.94875C19.7492 5.84875 19.4292 6.70875 18.8492 7.36875C18.7792 7.25875 18.6892 7.14875 18.5992 7.03875C17.8392 6.12875 16.8392 5.50875 15.6892 5.25875C15.4392 4.09875 14.9792 3.10875 14.3192 2.27875C14.3092 2.24875 14.2792 2.21875 14.2592 2.19875C14.1592 2.07875 14.0492 1.96875 13.9492 1.85875C14.5592 1.43875 15.2592 1.21875 16.0192 1.21875C18.0792 1.21875 19.7492 2.88875 19.7492 4.94875Z" fill="#292D32"/>
                        </svg>
                        ),
                    },
                    {
                        bg: 'from-[#EFD3D7] to-[#CBC0D3]',
                        title: '195 Countries to Explore',
                        desc: 'Rich country profiles with capitals, languages, currencies, timezones and borders.',
                        icon: (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.6" d="M8.10999 2C8.02999 2.3 8 2.63 8 3V6H3V4C3 2.9 3.9 2 5 2H8.10999Z" fill="#292D32"/>
                            <path d="M8 17V6H3C1 6 0 7 0 9V17C0 19 1 20 3 20H11C9 20 8 19 8 17ZM4.75 15C4.75 15.41 4.41 15.75 4 15.75C3.59 15.75 3.25 15.41 3.25 15V11C3.25 10.59 3.59 10.25 4 10.25C4.41 10.25 4.75 10.59 4.75 11V15Z" fill="#292D32"/>
                            <path opacity="0.4" d="M12 20H11C9 20 8 19 8 17V3C8 1 9 0 11 0H17C19 0 20 1 20 3V17C20 19 19 20 17 20H16" fill="#292D32"/>
                            <path d="M16 16V20H12V16C12 15.45 12.45 15 13 15H15C15.55 15 16 15.45 16 16Z" fill="#292D32"/>
                            <path d="M12 11.75C11.59 11.75 11.25 11.41 11.25 11V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V11C12.75 11.41 12.41 11.75 12 11.75Z" fill="#292D32"/>
                            <path d="M16 11.75C15.59 11.75 15.25 11.41 15.25 11V6C15.25 5.59 15.59 5.25 16 5.25C16.41 5.25 16.75 5.59 16.75 6V11C16.75 11.41 16.41 11.75 16 11.75Z" fill="#292D32"/>
                        </svg>
                        ),
                    },
                    {
                        bg: 'from-[#CBC0D3] to-[#DEE2FF]',
                        title: 'Personal Travel Dashboard',
                        desc: 'Visualise your travel history with charts showing regions visited, trips per year, and more.',
                        icon: (
                        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-slate-800">
                            <path d="M6.02 0H4.98C3.39 0 2.75 0.6 2.75 2.12V14H8.25V2.12C8.24 0.6 7.6 0 6.02 0Z"/>
                            <path opacity="0.4" d="M14.52 5H13.48C11.89 5 11.25 5.61 11.25 7.12V14H16.75V7.12C16.75 5.61 16.1 5 14.52 5Z"/>
                            <path d="M0.75 13.2578H19.25C19.66 13.2578 20 13.5978 20 14.0078C20 14.4178 19.66 14.7578 19.25 14.7578H0.75C0.34 14.7578 0 14.4178 0 13.9978C0 13.5778 0.34 13.2578 0.75 13.2578Z"/>
                        </svg>
                        ),
                    },
                    ].map(({ bg, title, desc, icon }) => (
                    <div key={title} className="mt-4 flex flex-row flex-wrap items-start -mx-3 p-5 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-sm">
                        <div className="px-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center`}>
                            {icon}
                        </div>
                        </div>
                        <div className="px-3 flex-1">
                        <div className="font-bold text-slate-800 mb-1">{title}</div>
                        <div className="text-sm text-slate-500 leading-relaxed">{desc}</div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section id="destinations" className="w-full relative block py-10 sm:py-16 md:py-20 overflow-hidden">
        <div className="max-w-[1420px] mx-auto px-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-10 md:mb-14 text-center text-stone-800 leading-[120%] font-bold">Popular destinations</h2>
          <div className="flex flex-row flex-wrap justify-center -mx-3 -mt-6">
            {[
              { img: '/images/destinations/japan', name: 'Japan'},
              { img: '/images/destinations/italy', name: 'Italy'},
              { img: '/images/destinations/greece', name: 'Greece'},
              { img: '/images/destinations/thailand', name: 'Thailand'},
            ].map(({ img, name }) => (
              <div key={name} className="px-3 mt-6 w-full min-[480px]:w-1/2 lg:w-1/4">
                <div className="block rounded-[24px] overflow-hidden relative h-[220px] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <picture>
                    <source srcSet={`${img}.webp`} type="image/webp" />
                    <img src={`${img}.jpg`} alt={name} className="object-cover object-center w-full h-full" />
                  </picture>
                  <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-white font-bold text-lg">{name}</div>
                  </div>
                  <Link to="/login" className="absolute inset-0 z-50" aria-label={`Explore ${name}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to={loginPath} className="inline-flex items-center gap-2 min-h-[38px] bg-transparent border border-[#636BAB] text-[#636BAB] rounded-[42px] px-5 py-2 transition-all duration-300 hover:bg-[#636BAB] hover:text-white text-base font-medium">
              Explore all countries <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA + Footer */}
      <div className="relative block w-full md:mt-10">
        <div className="w-full relative overflow-hidden before:bottom-0 before:absolute before:left-0 before:h-[150px] before:w-full before:bg-slate-800 before:content-['']">
          <div className="w-[1080px] px-5 md:px-0 max-w-full mx-auto bg-[#636BAB] lg:rounded-b-3xl min-[1080px]:rounded-[32px] h-auto py-10 md:py-0 md:h-[400px] relative z-20 flex items-center justify-center">
            <svg className="absolute z-10 w-auto h-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" width="1121" height="501" viewBox="0 0 1121 501" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.2" d="M12.5922 103.333C125.391 83.7243 322.904 94.1766 500.9 -105.895C674.758 -301.317 75.9235 30.0528 73.8309 258.664C71.3848 525.896 1061.67 -106.07 840.986 -91.4149C717.52 -83.2158 143.859 402.441 267.314 489.537C424.364 600.333 1133.49 114.939 1107.05 34.98C1060.4 -106.079 263.811 565.906 364.638 699.757C484.868 859.365 1041.93 464.994 1051.88 325.206C1059.83 213.375 540.153 715.656 719.493 960.136" stroke="white" strokeWidth="25" strokeLinecap="round"/>
            </svg>
            <div className="bg-white mx-auto rounded-xl w-[520px] max-w-full text-center relative z-30 px-6 py-10 sm:py-12">
              <div className="max-w-full w-[470px] mx-auto">
                <h3 className="font-urbanist font-extrabold text-3xl sm:text-[38px] leading-tight -tracking-tight mb-4 text-slate-800">Start your travel journal today</h3>
                <p className="text-slate-500 mb-8 text-base">Still have doubts? Don't hesitate to contact us — we'll walk you through everything WanderLog has to offer.</p>
                <a href="mailto:info.wanderlog@gmail.com" className="inline-flex items-center gap-2 min-h-[38px] bg-[#636BAB] border border-[#636BAB] text-white rounded-[42px] px-5 py-2 transition-all duration-300 hover:bg-[#636BAB]/70 text-base font-medium">
                  Get in touch <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pb-8 pt-11 bg-slate-800">
          <div className="mx-auto w-[1450px] px-5 max-w-full text-white">
            <p className="mb-16 text-center">
              <Link to="/" className="flex flex-row items-center justify-center no-underline">
                <img src="/images/logo-white.svg" alt="WanderLog" className="w-auto h-[9vw] min-[480px]:h-[45px] mr-2" />
                <span className="text-[3.5vw] min-[480px]:text-base lg:text-[20px] leading-none font-bold text-white">Wanderlog</span>
              </Link>
            </p>
            <div className="flex flex-row flex-wrap items-center justify-center -mx-5 -mt-10">
              {[
                { title: 'Navigation', links: [['#how-it-works','How it works'],['#features','Features'],['#destinations','Destinations']] },
                { title: 'Account', links: [['/login','Log in'],['/login','Register'],['/dashboard','Dashboard']] },
                { title: 'Legal', links:[['#','Privacy Policy'],['#','Terms of Use'],['#','Cookies']] },
              ].map(({ title, links }) => (
                <div key={title} className="px-10 mt-10 w-full min-[420px]:w-1/2 sm:w-1/3 lg:w-[250px] text-center lg:text-left">
                  <div className="font-bold mb-4">{title}</div>
                  {links.map(([href, label]) => (
                    <div key={label} className="mb-4">
                      {href.startsWith('/') ? (
                        <Link to={href} className="text-white hover:underline">{label}</Link>
                      ) : (
                        <a href={href} className="text-white hover:underline">{label}</a>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-wrap items-center justify-center pt-16 lg:flex-row lg:justify-between">
              <div className="text-sm mt-6 order-last lg:order-first">© 2026 WanderLog. All rights reserved.</div>
              <div className="flex gap-6 mt-6 order-first lg:order-last text-sm">
                {['Terms','Privacy','Cookies'].map(t => <a key={t} href="#" className="text-white underline hover:no-underline">{t}</a>)}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
