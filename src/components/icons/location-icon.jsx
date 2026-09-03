import { cn } from "@/lib/utils";
import { useId } from "react";

/** GPS / current location — from /icons/location.svg */
export function CurrentLocationIcon({ className, strokeWidth = 1.329, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        d="M20.7499 12.0001C20.7499 16.8325 16.8325 20.7501 12 20.7501C7.16747 20.7501 3.25 16.8325 3.25 12.0001C3.25 7.16758 7.16747 3.25007 12 3.25007C16.8325 3.25007 20.7499 7.16758 20.7499 12.0001Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 12.0001C15.5 13.9331 13.933 15.5001 12 15.5001C10.067 15.5001 8.5 13.9331 8.5 12.0001C8.5 10.0671 10.067 8.50011 12 8.50011C13.933 8.50011 15.5 10.0671 15.5 12.0001Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 12.0001H5.00001"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 12.0001H22.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 1.50012V5.00012"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19.0001V22.5001"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LocationIcon({ className, strokeWidth = 1.65, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        d="M10.3562 1.98486C11.5511 1.74496 12.7849 1.77347 13.9675 2.06787C15.1499 2.36226 16.2523 2.91512 17.1951 3.68701L17.3054 3.77783C18.2302 4.56596 18.9704 5.54822 19.4666 6.65869C19.9826 7.81381 20.2226 9.07339 20.1687 10.3374C20.1148 11.6014 19.7685 12.8359 19.156 13.9429C18.5435 15.0498 17.6817 15.9992 16.6394 16.7163L16.6218 16.728C15.0686 17.8569 13.7738 19.3037 12.822 20.9712L12.1511 22.0884C12.1356 22.1142 12.1138 22.136 12.0876 22.1509C12.0614 22.1657 12.0309 22.1733 12.0007 22.1733C11.9707 22.1733 11.941 22.1657 11.9148 22.1509C11.8886 22.136 11.8668 22.1142 11.8513 22.0884L11.1511 20.9243L11.1433 20.9126L10.9363 20.5903C9.88722 18.9993 8.56328 17.6065 7.02515 16.478C5.78187 15.524 4.83852 14.233 4.30835 12.7583C3.77815 11.2834 3.68354 9.68703 4.03491 8.15967C4.38629 6.6323 5.16938 5.23797 6.29077 4.14307C7.41125 3.0491 8.82234 2.30006 10.3562 1.98486Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M11.4453 6.76904C11.9964 6.65942 12.5677 6.7152 13.0869 6.93018C13.6061 7.14524 14.0501 7.50978 14.3623 7.97705C14.6746 8.44436 14.8418 8.99412 14.8418 9.55615C14.8417 10.3097 14.5416 11.0321 14.0088 11.5649C13.476 12.0978 12.7535 12.3979 12 12.3979C11.438 12.3979 10.8882 12.2307 10.4209 11.9185C9.95363 11.6062 9.58909 11.1623 9.37402 10.6431C9.15904 10.1239 9.10326 9.55259 9.21289 9.00146C9.32254 8.45025 9.59283 7.94379 9.99023 7.54639C10.3876 7.14898 10.8941 6.87869 11.4453 6.76904Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

/** Address list pin — from /icons/0001.svg */
export function AddressListPinIcon({ className, strokeWidth = 1.65, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        d="M10.3561 1.98505C11.551 1.74514 12.7848 1.77365 13.9675 2.06805C15.1499 2.36244 16.2522 2.9153 17.195 3.68719L17.3054 3.77802C18.2301 4.56614 18.9704 5.5484 19.4665 6.65887C19.9825 7.814 20.2225 9.07358 20.1686 10.3376C20.1147 11.6016 19.7685 12.8361 19.1559 13.9431C18.5434 15.05 17.6816 15.9994 16.6393 16.7165L16.6218 16.7282C15.0685 17.8571 13.7737 19.3039 12.822 20.9714L12.1511 22.0886C12.1356 22.1143 12.1137 22.1362 12.0876 22.1511C12.0613 22.1659 12.0309 22.1735 12.0007 22.1735C11.9706 22.1735 11.9409 22.1659 11.9147 22.1511C11.8885 22.1362 11.8668 22.1144 11.8513 22.0886L11.1511 20.9245L11.1432 20.9128L10.9362 20.5905C9.88716 18.9995 8.56322 17.6067 7.02509 16.4782C5.78181 15.5242 4.83846 14.2332 4.30829 12.7585C3.77809 11.2836 3.68348 9.68721 4.03485 8.15985C4.38623 6.63248 5.16932 5.23815 6.29071 4.14325C7.41119 3.04928 8.82228 2.30025 10.3561 1.98505Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M11.4453 6.76904C11.9964 6.65942 12.5677 6.7152 13.0869 6.93018C13.6061 7.14524 14.05 7.50978 14.3622 7.97705C14.6745 8.44436 14.8417 8.99412 14.8417 9.55615C14.8416 10.3097 14.5416 11.0321 14.0087 11.5649C13.4759 12.0978 12.7535 12.3979 11.9999 12.3979C11.4379 12.3979 10.8881 12.2307 10.4208 11.9185C9.95357 11.6062 9.58903 11.1623 9.37396 10.6431C9.15898 10.1239 9.1032 9.55259 9.21283 9.00146C9.32248 8.45025 9.59277 7.94379 9.99017 7.54639C10.3876 7.14898 10.894 6.87869 11.4453 6.76904Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

/** Map card location pin — from /icons/location-2.svg */
export function AddressMapLocationIcon({ className, ...props }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        d="M23.0476 13.2926C23.7856 11.4898 23.8963 9.48676 23.3639 7.6102C22.0302 2.93988 16.9488 0.225192 12.3259 1.71695C7.57124 3.25088 5.05686 8.66972 6.94923 13.2926C8.63603 17.3567 12.4946 19.9291 14.9984 23.4345C17.5022 19.9291 21.3608 17.3567 23.0476 13.2926ZM10.5179 9.9928C10.5179 7.55221 12.5578 5.51224 14.9984 5.51224C17.439 5.51224 19.479 7.55221 19.479 9.9928C19.479 12.4334 17.439 14.4734 14.9984 14.4734C12.5578 14.4734 10.5179 12.4334 10.5179 9.9928Z"
        fill={`url(#${gradientId}-pin)`}
      />
      <path
        d="M24.9035 25.0786C24.6558 24.5357 24.0759 24.1667 23.5699 23.9084C22.6211 23.4182 21.5932 23.144 20.56 22.9121C21.6301 23.7186 20.4862 24.5409 19.6428 24.8519C17.6661 25.5794 15.3468 25.6848 13.2699 25.4634C12.0101 25.3263 10.3496 25.1735 9.3481 24.2984C8.83679 23.8451 8.90531 23.3127 9.43771 22.9121C8.15152 23.202 6.71775 23.5447 5.66877 24.3933C4.96242 24.9626 4.75157 25.7533 5.40521 26.4491C5.96396 27.05 6.781 27.3716 7.53479 27.651C8.5416 28.0252 9.61693 28.2308 10.6712 28.3942C12.8904 28.7316 15.1517 28.7737 17.3867 28.6103C19.4372 28.4575 21.667 28.157 23.5172 27.2029C24.2604 26.8234 25.3621 26.0643 24.9035 25.0786Z"
        fill={`url(#${gradientId}-base)`}
      />
      <defs>
        <linearGradient
          id={`${gradientId}-pin`}
          x1="6.31641"
          y1="1.30664"
          x2="27.8139"
          y2="18.1908"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id={`${gradientId}-base`}
          x1="5.01172"
          y1="22.9121"
          x2="8.10551"
          y2="33.5976"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
      </defs>
    </svg>
  );
}
