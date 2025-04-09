import TinderCard from "react-tinder-card";
import { useMatchStore } from "../store/useMatchStore";

const SwipeArea = () => {
	// Destructure `userProfiles`, `swipeRight`, and `swipeLeft` from the global store.
	// `userProfiles` contains the list of user profiles to display.
	// `swipeRight` and `swipeLeft` are functions to handle swipe actions.
	const { userProfiles, swipeRight, swipeLeft } = useMatchStore();

	// Function to handle swipe actions.
	// It determines whether the swipe direction is "right" or "left" and calls the appropriate function.
	const handleSwipe = (dir, user) => {
		if (dir === "right") swipeRight(user);
		else if (dir === "left") swipeLeft(user);
	};

	return (
		// Container for the swipeable cards.
		// The `relative` class ensures that the cards are positioned correctly within the container.
		//external profile container
		<div className="relative w-full max-w-sm h-[40rem]">
			{/* Map through the `userProfiles` array to render a TinderCard for each user. */}
			{userProfiles.map((user) => (
				<TinderCard
					// Each card is absolutely positioned to stack on top of each other.
					className="absolute shadow-none h-full"
					key={user._id} // Use the unique `_id` of the user as the key.
					onSwipe={(dir) => handleSwipe(dir, user)} // Handle swipe actions for each card.
					swipeRequirementType="position" // Swipe is based on position.
					swipeThreshold={100} // Minimum swipe distance required to trigger an action.
					preventSwipe={["up", "down"]} // Prevent swiping up or down.
				>
					{/* Card content */}
					<div className="card bg-white w-96 h-full select-none rounded-3xl overflow-hidden border border-gray-200">
						{/* Image section */}
						<figure className="p-4 h-3/4">
							<img
								src={user.image || "/avatar.png"} // Display the user's image or a default avatar.
								alt={user.name} // Use the user's name as the alt text for accessibility.
								className="rounded-xl object-cover h-full w-full pointer-events-none shrink-0 flex-0" // Style the image to fit the card.
							/>
						</figure>

						{/* Card body section */}
						<div className="card-body bg-gradient-to-b from-white to-pink-50">
							<h2 className="card-title text-2xl text-gray-800">
								{/* Display the user's name and age */}
								{user.name}, {user.age}
							</h2>
							{/* Display the user's bio */}
							<p className="text-gray-600">{user.bio}</p>
							<p className="text-gray-600">{user.interest}</p>
							<p className="text-gray-600">{user.stream}</p>
						</div>
					</div>
				</TinderCard>
			))}
		</div>
	);
};

// Export the SwipeArea component for use in other parts of the application.
export default SwipeArea;
