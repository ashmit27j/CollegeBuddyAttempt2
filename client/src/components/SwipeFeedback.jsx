import { useMatchStore } from "../store/useMatchStore";

// Function to determine the CSS class for the feedback text based on the swipe feedback type.
const getFeedbackStyle = (swipeFeedback) => {
    // If the feedback is "liked", return a teal color class.
    if (swipeFeedback === "liked") return "text-[#116e8f]";
    // If the feedback is "passed", return a red color class.
    if (swipeFeedback === "passed") return "text-red-500";
    // If the feedback is "matched", return the same teal color class as "liked".
    if (swipeFeedback === "matched") return "text-[#116e8f]";
    // If no feedback type matches, return an empty string (no styling).
    return "";
};

// Function to determine the feedback text to display based on the swipe feedback type.
const getFeedbackText = (swipeFeedback) => {
    // If the feedback is "liked", return "Request Sent!".
    if (swipeFeedback === "liked") return "Request Sent!";
    // If the feedback is "passed", return "Rejected".
    if (swipeFeedback === "passed") return "Rejected";
    // If the feedback is "matched", return "It's a Connection!".
    if (swipeFeedback === "matched") return "It's a Connection!";
    // If no feedback type matches, return an empty string (no text).
    return "";
};

// Main component to display swipe feedback.
const SwipeFeedback = () => {
    // Access the `swipeFeedback` state from the global store using `useMatchStore`.
    const { swipeFeedback } = useMatchStore();

    return (
        // Render a div with dynamic styling and text based on the swipe feedback.
        <div
            className={`
                absolute top-10 left-0 right-0 text-center text-2xl font-bold ${getFeedbackStyle(swipeFeedback)}
            `}
        >
            {/* Display the feedback text based on the swipe feedback type. */}
            {getFeedbackText(swipeFeedback)}
        </div>
    );
};

// Export the component as the default export for use in other parts of the application.
export default SwipeFeedback;
