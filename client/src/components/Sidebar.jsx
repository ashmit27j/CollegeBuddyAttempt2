// Import necessary libraries and components.
// `useEffect` and `useState` are React hooks for managing side effects and local state.
// `Heart`, `Loader`, `MessageCircle`, and `X` are icons from the `lucide-react` library.
// `Link` is from `react-router-dom` for navigation.
// `useMatchStore` is a Zustand store for managing match-related state and actions.
import { useEffect, useState } from "react";
import { Heart, Loader, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMatchStore } from "../store/useMatchStore";

const Sidebar = () => {
    // State variable:
    // `isOpen`: Tracks whether the sidebar is open or closed.
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the sidebar's visibility.
    const toggleSidebar = () => setIsOpen(!isOpen);

    // Destructure state and actions from `useMatchStore`.
    // `getMyMatches`: Fetches the user's matches.
    // `matches`: Stores the list of matches.
    // `isLoadingMyMatches`: Indicates whether matches are being loaded.
    const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();

    // Fetch matches when the component mounts.
    useEffect(() => {
        getMyMatches();
    }, [getMyMatches]);

    return (
        <>
            {/* Sidebar container */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md overflow-hidden transition-transform duration-300
                    ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:w-1/4
                `}
            >
                <div className='flex flex-col h-full'>
                    {/* Sidebar header */}
                    <div className='p-[1.35rem] border-b border-[#d6edf5] flex justify-between items-center'>
                        <h2 className='text-xl font-bold text-[#1D617A]'>Connections</h2>
                        {/* Close button for mobile view */}
                        <button
                            className='lg:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                            onClick={toggleSidebar}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Sidebar content */}
                    <div className='flex-grow overflow-y-auto p-4 z-10 relative'>
                        {/* Render loading state, no matches message, or the list of matches */}
                        {isLoadingMyMatches ? (
                            <LoadingState />
                        ) : matches.length === 0 ? (
                            <NoMatchesFound />
                        ) : (
                            matches.map((match) => (
                                <Link key={match._id} to={`/chat/${match._id}`}>
                                    <div className='flex items-center mb-4 cursor-pointer hover:bg-[#eaf6fa] p-2 rounded-lg transition-colors duration-300'>
                                        {/* Match avatar */}
                                        <img
                                            src={match.image || "/avatar.png"}
                                            alt='User avatar'
                                            className='size-12 object-cover rounded-full mr-3 border-2 border-[#1D617A]'
                                        />
                                        {/* Match name */}
                                        <h3 className='font-semibold text-gray-800'>{match.name}</h3>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Toggle button for mobile view */}
            <button
                className='lg:hidden fixed top-[0.7rem] left-[0.7rem] p-2 bg-[#1D617A] text-white rounded-md z-0'
                onClick={toggleSidebar}
            >
                <MessageCircle size={24} />
            </button>
        </>
    );
};

export default Sidebar;

// Component: Displays a message when no matches are found.
const NoMatchesFound = () => (
    <div className='flex flex-col items-center justify-center h-full text-center'>
        <Heart className='text-[#1D617A] mb-4' size={48} />
        <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Matches Yet</h3>
        <p className='text-gray-500 max-w-xs'>
            Don&apos;t worry! Your perfect match is just around the corner. Keep swiping!
        </p>
    </div>
);

// Component: Displays a loading state while matches are being fetched.
const LoadingState = () => (
    <div className='flex flex-col items-center justify-center h-full text-center'>
        <Loader className='text-[#1D617A] mb-4 animate-spin' size={48} />
        <h3 className='text-xl font-semibold text-gray-700 mb-2'>Loading Matches</h3>
        <p className='text-gray-500 max-w-xs'>We&apos;re finding your perfect matches. This might take a moment...</p>
    </div>
);
