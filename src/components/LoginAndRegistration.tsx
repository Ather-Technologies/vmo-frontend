import React, { useState } from 'react';
import { motion } from 'framer-motion'; // You may need to install this package

interface LoginAndRegistrationProps {
    setAuthState: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginAndRegistration({ setAuthState }: LoginAndRegistrationProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        // Simulate loading for better UX
        setTimeout(() => {
            setIsLoading(false);
            setAuthState(true);
        }, 800);
    };

    const handleRegister = () => {
        setIsLoading(true);
        // Simulate loading for better UX
        setTimeout(() => {
            setIsLoading(false);
            setAuthState(true);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        {true ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-3xl font-bold mb-2 text-white">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                                        VM-O Scanner
                                    </span>
                                </h2>
                                <h3 className="text-xl font-medium mb-4 text-gray-200">
                                    Early Access Build
                                </h3>

                                <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
                                    <p className="text-gray-300 mb-3">Thank you for checking out our public early access!</p>
                                    <div className="flex items-start space-x-2 mb-4">
                                        <div className="min-w-[24px] h-6 flex items-center justify-center">
                                            <span className="text-green-400 text-lg">✦</span>
                                        </div>
                                        <p className="text-green-200">
                                            <span className="font-bold">Latest Updates:</span>
                                            <br></br>
                                            <span className="font-semibold">05/03/2025:</span> Added agency tone detection that will show if ambulance or fire were paged in the clips visually.
                                            <br></br>
                                            <span className="font-semibold">04/23/2025:</span> Massive UI overhaul, performance fixes, mobile improvements, and more!
                                            <br></br>
                                            <span className="font-semibold">04/22/2025:</span> Pages now automatically advance when you finish listening to the oldest clip.
                                        </p>
                                    </div>
                                    <p className="text-gray-300">You may experience bugs or poor performance. To help this project grow, please report issues to help@athr.dev.</p>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 
                                    ${isLoading
                                            ? 'bg-green-700 cursor-wait'
                                            : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg hover:shadow-green-500/20'} 
                                    text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading...
                                        </span>
                                    ) : (
                                        "I understand, continue"
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-3xl font-bold mb-2 text-white">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                        Welcome Back
                                    </span>
                                </h2>
                                <p className="text-gray-400 mb-6">Sign in to your VM-O Scanner account or create a new one</p>

                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            disabled={true}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Click login or register to continue. This is non-functional.</p>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="Enter your password"
                                            disabled={true}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex space-x-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleLogin}
                                            disabled={isLoading}
                                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition duration-200 
                                            ${isLoading
                                                    ? 'bg-blue-700 cursor-wait'
                                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/20'} 
                                            text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                                        >
                                            {isLoading ? 'Loading...' : 'Login'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRegister}
                                            disabled={isLoading}
                                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition duration-200 
                                            ${isLoading
                                                    ? 'bg-green-700 cursor-wait'
                                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/20'} 
                                            text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                                        >
                                            {isLoading ? 'Loading...' : 'Register'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginAndRegistration;