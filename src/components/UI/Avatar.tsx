interface AvatarProps {
  firstName: string;
  profileImageUrl?: string;
  height: string;
  width: string;
  borderRadius?: string; // Optional borderRadius prop
}

const Avatar: React.FC<AvatarProps> = ({
  firstName,
  profileImageUrl = '',
  height,
  width,
  borderRadius = '9999px',
}) => {
  // Extract the first letter of the user's first name as the initial
  const avatarInitial = firstName.charAt(0).toUpperCase();

  return (
    <>
      {/* Conditionally render either the user's profile picture or the avatar with initials */}
      {profileImageUrl.trim() ? (
        <img
          src={profileImageUrl}
          alt="Profile"
          className="object-cover"
          style={{ height, width, borderRadius }} // Apply dynamic border radius
        />
      ) : (
        <span
          className="border border-green-300/30 grid place-content-center font-medium text-green-400 bg-white/5"
          style={{ height, width, borderRadius, fontSize: 'calc(50% + 6px)' }}
        >
          {avatarInitial}
        </span>
      )}
    </>
  );
};

export default Avatar;
