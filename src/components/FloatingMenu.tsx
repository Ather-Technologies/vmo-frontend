// ---- Lets talk about this later shall we?




import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";

export function FloatingMenu() {
    const [open, setOpen] = useState(false);
    const toggleSideBar = () => setOpen(!open);

    // If the url param m is set, open the menu on load
    useEffect(() => {
        if (window.location.search.includes('m=1')) {
            setOpen(true);
        }

        if (window.location.search.includes('p=1')) {
            // removeCookie('plays_remaining');

            toast('Thank you for your subscription!', {
                icon: '❤️',
            });
        }

        // Remove url params
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    const handleRedirect = (link: string) => {
        window.location.href = link;
    }

    return (
        <div className='w-8 h-8'>
            <button onClick={toggleSideBar}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='m-1 h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6h16M4 12h16M4 18h16'
                    />
                </svg>
            </button>
            <div className={`transition-all duration-500 h-screen fixed z-10 ${open ? 'left-0 w-80' : '-left-80 w-80'}`}>
                {
                    <div className='text-lg bg-gray-900 text-gray-700 dark:text-gray-400 p-4'>
                        <h1 className='text-xl border-b border-gray-700'>Menu</h1>
                        <p>{`Welcome, {name}!`}</p>

                        <div className='mt-4'>
                            <button className='p-4 w-full text-white bg-emerald-800' onClick={() => handleRedirect(`/api/user/{email}/subscription/access`)}>Manage your subscription</button>
                            <button className='p-4 mt-2 w-full text-white bg-emerald-500' onClick={() => handleRedirect('https://athr.dev/#contact')}>Contact Us</button>
                            <button className='p-4 mt-2 w-full text-white bg-blue-500' onClick={() => handleRedirect('/api/auth/signout')}>Logout</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default FloatingMenu;