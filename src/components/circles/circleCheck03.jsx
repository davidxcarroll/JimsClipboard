export function CircleCheck03({ className = "", ...props }) {
  return (
    <svg
      className={`absolute h-[150%] w-[220%] top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ${className}`}
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M25.4582 10.8574C6.96532 17.2136 -0.636459 34.8633 3.31884 49.2712C7.54242 64.6564 64.7881 60.3256 75.7275 31.308C89.9139 -6.32219 25.4586 -3.00854 7.22578 15.0028"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}