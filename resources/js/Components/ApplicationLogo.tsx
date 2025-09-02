import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
                d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <rect 
                x="3" 
                y="3" 
                width="18" 
                height="18" 
                rx="2" 
                stroke="currentColor" 
                strokeWidth="2"
            />
            <circle 
                cx="8.5" 
                cy="8.5" 
                r="1.5" 
                fill="currentColor"
            />
            <path 
                d="M20 16L21.5 17.5M21.5 17.5L23 19M21.5 17.5L20 19M21.5 17.5L23 16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                opacity="0.8"
            />
        </svg>
    );
}
