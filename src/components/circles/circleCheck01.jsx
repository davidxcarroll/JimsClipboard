export function CircleCheck01({ className = "", ...props }) {
  return (
    <svg
      className={`absolute h-[150%] w-[300%] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${className}`}
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M27.2543 3.04283C12.3823 11.8046 -6.2353 33.8171 8.66131 49.4526C27.4995 69.2251 69.0885 48.3895 77.3839 27.6092C87.5554 2.12925 39.2764 -8.8218 8.18775 18.6801"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}