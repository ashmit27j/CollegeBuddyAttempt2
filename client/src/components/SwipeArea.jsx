import TinderCard from "react-tinder-card";
import { useMatchStore } from "../store/useMatchStore";

const SwipeArea = () => {
  // Access user profiles and swipe handlers from Zustand store
  const { userProfiles, swipeRight, swipeLeft } = useMatchStore();

  // Handle swipe actions
  const handleSwipe = (dir, user) => {
    if (dir === "right") swipeRight(user);
    else if (dir === "left") swipeLeft(user);
  };

  return (
    <div className="relative w-full flex flex-col items-center mt-4">
      {/* Swipeable Card Container */}
      <div className="relative w-[85%] max-w-xs h-[30rem] sm:h-[32rem] mb-5 -mt-2">
        {userProfiles.map((user) => (
          <TinderCard
            className="absolute w-full h-full shadow-none"
            key={user._id}
            onSwipe={(dir) => handleSwipe(dir, user)}
            swipeRequirementType="position"
            swipeThreshold={100}
            preventSwipe={["up", "down"]}
          >
            {/* Card content */}
            <div className="bg-white w-full h-full rounded-3xl overflow-hidden border border-gray-200 shadow-md select-none">
              {/* Image section */}
              <figure className="p-3 h-[65%]">
                <img
                  src={user.image || "/avatar.png"}
                  alt={user.name}
                  className="rounded-xl object-cover h-full w-full pointer-events-none"
                />
              </figure>

              {/* Card details */}
              <div className="p-4 pt-1 bg-gradient-to-b from-white to-pink-50">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {user.name}, {user.age}
                </h2>
                <p className="text-gray-600 text-sm leading-snug truncate">
                  {user.bio}
                </p>
                <p className="text-gray-600 text-sm">{user.interest}</p>
                <p className="text-gray-600 text-sm">{user.stream}</p>
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Instruction Text */}
      <p className="text-sm sm:text-base text-gray-500">
        <span className="font-semibold text-red-500">Swipe left</span> to reject
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <span className="font-semibold text-green-500">Swipe right</span> to accept
      </p>
    </div>
  );
};

export default SwipeArea;
