// Import necessary libraries and components.
// `useEffect` is a React hook for managing side effects.
// `Sidebar` and `Header` are reusable components for the page layout.
// `useMatchStore` is a Zustand store for managing match-related state and actions.
// `Frown` is an icon from the `lucide-react` library.
// `SwipeArea` and `SwipeFeedback` are components for the swipe functionality.
// `useAuthStore` is a Zustand store for managing authentication-related state.
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import { useMatchStore } from "../store/useMatchStore";
import { Frown } from "lucide-react";
import SwipeArea from "../components/SwipeArea";
import SwipeFeedback from "../components/SwipeFeedback";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    // Destructure state and actions from `useMatchStore`.
    // `isLoadingUserProfiles`: Indicates whether user profiles are being loaded.
    // `getUserProfiles`: Fetches user profiles for swiping.
    // `userProfiles`: Stores the list of user profiles.
    // `subscribeToNewMatches` and `unsubscribeFromNewMatches`: Manage WebSocket subscriptions for new matches.
    const { isLoadingUserProfiles, getUserProfiles, userProfiles, subscribeToNewMatches, unsubscribeFromNewMatches } =
        useMatchStore();

    // Access the authenticated user's data from `useAuthStore`.
    const { authUser } = useAuthStore();

    // Fetch user profiles when the component mounts.
    useEffect(() => {
        getUserProfiles();
    }, [getUserProfiles]);

    // Subscribe to new matches when the authenticated user is available.
    // Unsubscribe when the component unmounts.
    useEffect(() => {
        if (authUser) {
            subscribeToNewMatches();
        }
        return () => {
            unsubscribeFromNewMatches();
        };
    }, [subscribeToNewMatches, unsubscribeFromNewMatches, authUser]);

    return (
        // Main container for the home page with a gradient background.
        <div
            className='flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#eaf6fa] to-[#addceb]
         overflow-hidden'
        >
            {/* Sidebar component for navigation. */}
            <Sidebar />

            {/* Main content area. */}
            <div className='flex-grow flex flex-col overflow-hidden'>
                {/* Header component at the top of the page. */}
                <Header />

                {/* Main section for swipe functionality and feedback. */}
                <main className='flex-grow flex flex-col gap-10 justify-center items-center p-4 relative overflow-hidden'>
                    {/* Render swipe area and feedback if user profiles are available and not loading. */}
                    {userProfiles.length > 0 && !isLoadingUserProfiles && (
                        <>
                            <SwipeArea />
                            <SwipeFeedback />
                        </>
                    )}

                    {/* Render a message when no more profiles are available. */}
                    {userProfiles.length === 0 && !isLoadingUserProfiles && <NoMoreProfiles />}

                    {/* Render a loading UI while user profiles are being fetched. */}
                    {isLoadingUserProfiles && <LoadingUI />}
                </main>
            </div>
        </div>
    );
};

export default HomePage;

// Component: Displays a message when no more profiles are available.
const NoMoreProfiles = () => (
    <div className='flex flex-col items-center justify-center h-full text-center p-8'>
        <Frown className='text-[#1D617A] mb-6' size={80} />
        <h2 className='text-3xl font-bold text-gray-800 mb-4'>You've Reached the end!</h2>
        <p className='text-xl text-gray-600 mb-6'>Bro are you OK? Maybe it&apos;s time to touch some grass.</p>
    </div>
);

// Component: Displays a loading UI while user profiles are being fetched.
const LoadingUI = () => {
    return (
        <div className='relative w-full max-w-sm h-[28rem]'>
            <div className='card bg-white w-96 h-[28rem] rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
                {/* Placeholder for the image section. */}
                <div className='px-4 pt-4 h-3/4'>
                    <div className='w-full h-full bg-gray-200 rounded-lg' />
                </div>

                {/* Placeholder for the card body section. */}
                <div className='card-body bg-gradient-to-b from-white to-[1D617A] p-4'>
                    <div className='space-y-2'>
                        <div className='h-6 bg-gray-200 rounded w-3/4' />
                        <div className='h-4 bg-gray-200 rounded w-1/2' />
                    </div>
                </div>
            </div>
        </div>
    );
};
