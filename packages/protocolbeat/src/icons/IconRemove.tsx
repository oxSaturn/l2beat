import { Icon } from './Icon'

export function IconRemove(props: { className?: string }) {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3H12H13V4H12V13L11 14H4L3 13V4H2V3H5V2C5 1.73478 5.10531 1.48038 5.29285 1.29285C5.48038 1.10531 5.73478 1 6 1H9C9.26522 1 9.51962 1.10531 9.70715 1.29285C9.89469 1.48038 10 1.73478 10 2V3ZM9 2H6V3H9V2ZM4 13H11V4H4V13ZM6 5H5V12H6V5ZM7 5H8V12H7V5ZM9 5H10V12H9V5Z"
        fill="currentColor"
      />
    </Icon>
  )
}
