export default function Title({
  status,
  text,
}: {
  status: "active" | "inactive" | "completed";
  text: string;
}) {
  const isActive = status === "active";
  const isCompleted = status === "completed";

  return (
    <div className="flex gap-2 items-center">
      <span className="relative flex size-4 items-center justify-center">
        <span
          className={`absolute inline-flex h-full w-full ${isActive ? "animate-ping bg-primary" : ""} rounded-full opacity-75`}
        ></span>
        <span
          className={`inline-flex ${isCompleted ? "size-4" : "size-3"} rounded-full ${isActive || isCompleted ? "bg-primary" : "bg-[#7d7d89]"} items-center justify-center`}
        >
          {isCompleted && (
            <svg
              className="w-2.5 h-2.5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={6}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
      </span>
      <span
        className={`${isActive ? "text-pink-500" : "text-gray-400"}  font-medium`}
      >
        {text}
      </span>
    </div>
  );
}
