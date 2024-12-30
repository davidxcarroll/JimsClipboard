export function CircleCheck02({ className = "", ...props }) {
  return (
    <svg
      className={`absolute h-[150%] w-[220%] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${className}`}
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.66913 39.4231C-5.28193 0.21676 61.9648 -11.5777 76.7663 21.5857C90.3655 52.0556 32.0485 61.0578 15.4883 56.7333C-7.30596 50.7809 5.60609 28.8907 8.00904 24.6571C10.412 20.4236 15.0614 14.2191 15.0614 14.2191"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}