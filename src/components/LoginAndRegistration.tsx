import React, { useState } from 'react';
// import toast from 'react-hot-toast';

interface LoginAndRegistrationProps {
    setAuthState: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginAndRegistration({ setAuthState }: LoginAndRegistrationProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Handle login logic here
        // toast('Login button clicked!', { icon: '🔑' })
        setAuthState(true);
    };

    const handleRegister = () => {
        // Handle registration logic here
        // toast('Register button clicked!', { icon: '📝' })
        setAuthState(true);
    };

    return (
        <div id="datesnavbackground" className="bg-gray-900 ">
            <div className="flex justify-center items-center h-screen">
                <div className="bg-gray-800 p-8 shadow-md rounded-md">
                    {true ? <>
                        <h3 className="text-2xl font-bold mb-4">Welcome to the VM-O Scanner,<br></br>I hope you enjoy this early access build!</h3>
                        <p>Thank you for visiting the public early access!</p>
                        <p className='text-green-200'><br></br>Latest Update 04/22/2025: Made pages automatically advance if you finish listening to the oldest clip on the page.</p>
                        <p><br></br>You may experience bugs or poor performance if you have the time, please report these using the contact us link in the top left menu on the clips page. Enjoy!</p>
                        <form>
                            <button
                                type="button"
                                className="px-4 py-2 my-4 text-sm font-medium text-black bg-green-300 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500"
                                onClick={handleRegister}
                            >
                                I understand, continue.
                            </button>
                        </form>
                    </> : <>
                        <h3 className="text-2xl font-bold mb-4">Welcome to the VM-O Scanner!<br></br>Sign in or Register below.</h3>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="placeholder-gray-500 bg-blue-200 text-black w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                    value={email}
                                    disabled={true}
                                    placeholder='Click login or register to continue. This is non functional.'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="placeholder-gray-500 bg-blue-200 text-black w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                    value={password}
                                    disabled={true}
                                    placeholder='Click login or register to continue. This is non functional.'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500"
                                    onClick={handleRegister}
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </>}
                </div>
            </div>
        </div >
    );
};

export default LoginAndRegistration;