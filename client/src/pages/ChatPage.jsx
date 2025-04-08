// Import necessary libraries and components.
// `useEffect` is a React hook for managing side effects.
// `Header` is a reusable component for the page header.
// `useAuthStore`, `useMatchStore`, and `useMessageStore` are Zustand stores for managing authentication, match, and message-related state and actions.
// `Link` and `useParams` are from `react-router-dom` for navigation and accessing route parameters.
// `Loader` and `UserX` are icons from the `lucide-react` library.
// `MessageInput` is a component for sending messages.
import { useEffect } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";
import { Link, useParams } from "react-router-dom";
import { Loader, UserX } from "lucide-react";
import MessageInput from "../components/MessageInput";

const ChatPage = () => {
    // Destructure state and actions from `useMatchStore`.
    // `getMyMatches`: Fetches the user's matches.
    // `matches`: Stores the list of matches.
    // `isLoadingMyMatches`: Indicates whether matches are being loaded.
    const { getMyMatches, matches, isLoadingMyMatches } = useMatchStore();

    // Destructure state and actions from `useMessageStore`.
    // `messages`: Stores the list of messages in the current conversation.
    // `getMessages`: Fetches messages for a specific conversation.
    // `subscribeToMessages` and `unsubscribeFromMessages`: Manage WebSocket subscriptions for real-time messages.
    const { messages, getMessages, subscribeToMessages, unsubscribeFromMessages } = useMessageStore();

    // Access the authenticated user's data from `useAuthStore`.
    const { authUser } = useAuthStore();

    // Access the match ID from the route parameters.
    const { id } = useParams();

    // Find the match corresponding to the current chat ID.
    const match = matches.find((m) => m?._id === id);

    // Fetch matches and messages when the component mounts.
    // Subscribe to real-time messages and unsubscribe when the component unmounts.
    useEffect(() => {
        if (authUser && id) {
            getMyMatches();
            getMessages(id);
            subscribeToMessages();
        }

        return () => {
            unsubscribeFromMessages();
        };
    }, [getMyMatches, authUser, getMessages, subscribeToMessages, unsubscribeFromMessages, id]);

    // Render a loading UI if matches are being loaded.
    if (isLoadingMyMatches) return <LoadingMessagesUI />;

    // Render a "Match Not Found" UI if the match doesn't exist.
    if (!match) return <MatchNotFound />;

    return (
        // Main container for the chat page with a light background.
        <div className='flex flex-col h-screen bg-gray-100 bg-opacity-50'>
            {/* Render the header component at the top of the page. */}
            <Header />

            {/* Main content area for the chat. */}
            <div className='flex-grow flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden max-w-4xl mx-auto w-full'>
                {/* Chat header displaying the match's name and image. */}
                <div className='flex items-center mb-4 bg-white rounded-lg shadow p-3'>
                    <img
                        src={match.image || "/avatar.png"}
                        className='w-12 h-12 object-cover rounded-full mr-3 border-2 border-[#1D617A]'
                    />
                    <h2 className='text-xl font-semibold text-gray-800'>{match.name}</h2>
                </div>

                {/* Chat messages area. */}
                <div className='flex-grow overflow-y-auto mb-4 bg-white rounded-lg shadow p-4'>
                    {/* Display a message if there are no messages yet. */}
                    {messages.length === 0 ? (
                        <p className='text-center text-gray-500 py-8'>Start your conversation with {match.name}</p>
                    ) : (
                        // Render each message in the conversation.
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`mb-3 ${msg.sender === authUser._id ? "text-right" : "text-left"}`}
                            >
                                <span
                                    className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                                        msg.sender === authUser._id
                                            ? "bg-[#1D617A] text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {msg.content}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Message input component for sending new messages. */}
                <MessageInput match={match} />
            </div>
        </div>
    );
};

export default ChatPage;

// Component: Displays a "Match Not Found" UI when the match doesn't exist.
const MatchNotFound = () => (
    <div className='h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50 bg-dot-pattern'>
        <div className='bg-white p-8 rounded-lg shadow-md text-center'>
            <UserX size={64} className='mx-auto text-[#1D617A] mb-4' />
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Match Not Found</h2>
            <p className='text-gray-600'>Oops! It seems this match doesn&apos;t exist or has been removed.</p>
            <Link
                to='/'
                className='mt-6 px-4 py-2 bg-[#1D617A] text-white rounded hover:bg-[#227591] transition-colors 
                focus:outline-none focus:ring-2 focus:ring-[#30a7cf] inline-block'
            >
                Go Back To Home
            </Link>
        </div>
    </div>
);

// Component: Displays a loading UI while messages are being fetched.
const LoadingMessagesUI = () => (
    <div className='h-screen flex flex-col items-center justify-center bg-gray-100 bg-opacity-50'>
        <div className='bg-white p-8 rounded-lg shadow-md text-center'>
            <Loader size={48} className='mx-auto text-[#30a7cf] animate-spin mb-4' />
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Loading Chat</h2>
            <p className='text-gray-600'>Please wait while we fetch your conversation...</p>
            <div className='mt-6 flex justify-center space-x-2'>
                <div className='w-3 h-3 bg-[#1D617A] rounded-full animate-bounce' style={{ animationDelay: "0s" }}></div>
                <div
                    className='w-3 h-3 bg-[#1D617A] rounded-full animate-bounce'
                    style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                    className='w-3 h-3 bg-[#1D617A] rounded-full animate-bounce'
                    style={{ animationDelay: "0.4s" }}
                ></div>
            </div>
        </div>
    </div>
);
