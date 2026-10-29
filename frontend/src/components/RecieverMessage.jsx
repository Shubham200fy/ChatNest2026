const RecieverMessage = ({ image, message, profileImage }) => {
  return (
    <div className="flex items-end justify-start gap-2">
      {/* Receiver profile avatar */}
      <img
        src={profileImage || "/default-avatar.png"}
        alt="Friend's profile"
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />

      {/* Message bubble */}
      <div className="max-w-[88%] break-words rounded-2xl rounded-tl-sm bg-white px-3 py-2.5 shadow-sm sm:max-w-[75%] sm:px-4">
        {image && (
          <img
            src={image}
            alt="Attachment"
            className="mb-2 w-[200px] rounded-lg object-cover"
          />
        )}

        {message && (
          <p className="text-sm leading-6 text-slate-800">
            {message}
          </p>
        )}

        <p className="mt-1 text-right text-[10px] text-slate-400">
          10:02 AM
        </p>
      </div>
    </div>
  );
};

export default RecieverMessage;