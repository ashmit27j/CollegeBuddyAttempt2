// Import necessary libraries and components.
// `useEffect`, `useRef`, and `useState` are React hooks for managing side effects, DOM references, and local state.
// `useAuthStore` is a Zustand store for managing authentication-related state and actions.
// `Link` is from `react-router-dom` for navigation.
// `User`, `LogOut`, and `Menu` are icons from the `lucide-react` library.
// `Logo` is the application logo.
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { User, LogOut, Menu } from "lucide-react";
import Logo from "../assets/CollegeBuddy.png";

export const Header = () => {
    // Access the authenticated user's data and the logout action from `useAuthStore`.
    const { authUser, logout } = useAuthStore();

    // State variables:
    // `dropdownOpen`: Tracks whether the user dropdown menu is open.
    // `mobileMenuOpen`: Tracks whether the mobile menu is open.
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Reference for the dropdown menu to detect clicks outside of it.
    const dropdownRef = useRef(null);

    // Effect to handle clicks outside the dropdown menu.
    // Closes the dropdown menu if a click is detected outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        // Header container with a gradient background and shadow.
        <header className='bg-gradient-to-br from-[#1D617A] to-[#3d8098] shadow-lg'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center py-4'>
                    {/* Logo section */}
                    <div className='flex items-center'>
                        <Link to='/' className='flex items-center space-x-2'>
                            <img src={Logo} alt='CollegeBuddy Logo' className='w-10' />
                            <span className='text-2xl font-bold text-white hidden sm:inline'>CollegeBuddy</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className='hidden md:flex items-center space-x-4'>
                        {authUser ? (
                            // User dropdown menu for authenticated users.
                            <div className='relative' ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className='flex items-center space-x-2 focus:outline-none'
                                >
                                    <img
                                        src={authUser.image || "/avatar.png"}
                                        className='h-10 w-10 object-cover rounded-full border-2 border-white'
                                        alt='User Avatar'
                                    />
                                    <span className='text-white font-medium'>{authUser.name}</span>
                                </button>
                                {/* Dropdown menu */}
                                {dropdownOpen && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
                                        <Link
                                            to='/profile'
                                            className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <User className='mr-2' size={16} />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'
                                        >
                                            <LogOut className='mr-2' size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Login and Sign Up links for unauthenticated users.
                            <>
                                <Link
                                    to='/auth'
                                    className='text-white hover:text-[#1D617A] transition duration-150 ease-in-out'
                                >
                                    Login
                                </Link>
                                <Link
                                    to='/auth'
                                    className='bg-white text-[#1D617A] px-4 py-2 rounded-full font-medium hover:bg-[#addceb] transition duration-150 ease-in-out'
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className='text-white focus:outline-none'
                        >
                            <Menu className='size-6' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className='md:hidden bg-[#1D617A] border-t'>
                    <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                        {authUser ? (
                            // Mobile menu for authenticated users.
                            <>
                                <Link
                                    to='/profile'
                                    className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#227591]'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#227591]'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            // Mobile menu for unauthenticated users.
                            <>
                                <Link
                                    to='/auth'
                                    className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#227591]'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to='/auth'
                                    className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700'
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};