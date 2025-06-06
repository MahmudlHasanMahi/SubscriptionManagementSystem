import React from "react";

const Subscription = ({ color }) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_319_1146)">
        <path
          d="M20 8H4V6H20V8ZM18 2H6V4H18V2ZM10.312 21.1L7.012 17.8L8.412 16.4L10.312 18.3L15.612 13L17.012 14.4L10.312 21.1Z"
          fill={color}
        />
        <path
          d="M22 10H2C1.46957 10 0.960859 10.2107 0.585786 10.5858C0.210714 10.9609 0 11.4696 0 12L0 22C0 22.5304 0.210714 23.0391 0.585786 23.4142C0.960859 23.7893 1.46957 24 2 24H22C22.5304 24 23.0391 23.7893 23.4142 23.4142C23.7893 23.0391 24 22.5304 24 22V12C24 11.4696 23.7893 10.9609 23.4142 10.5858C23.0391 10.2107 22.5304 10 22 10ZM22 22H2V12H22V22Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_319_1146">
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default Subscription;
