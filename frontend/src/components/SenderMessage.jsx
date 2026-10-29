const SenderMessage = ({ image, message, profileImage }) => {
  return (
    <div className="flex items-end justify-end gap-2">
      {/* Sender profile image */}
      <div className="max-w-[88%] break-words rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2.5 shadow-sm sm:max-w-[75%] sm:px-4">
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
          10:05 AM <span className="ml-1 text-sky-500">✓✓</span>
        </p>
      </div>

      {/* Profile avatar */}
      <img
        src={profileImage || "/default-avatar.png"}
        alt="Your profile"
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    </div>
  );
};

export default SenderMessage;