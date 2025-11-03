import React from 'react';
import clsx from 'clsx';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  glow?: boolean;
  size?: number;
  color?: string;
}

/** Universal Icon Wrapper (applies consistent neon glow + sizing) */
const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({
  children,
  glow = false,
  size = 24,
  color = 'currentColor',
  className,
  ...props
}) => (
  <div
    className={clsx(
      glow && 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-transform duration-300 hover:scale-110',
      'flex items-center justify-center'
    )}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx(className, glow && 'text-cyan-400')}
      {...props}
    >
      {children}
    </svg>
  </div>
);

/* Individual Icons */
export const BrainCircuitIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 5a3 3 0 1 0-5.997.001A3 3 0 0 0 12 5m0-2a3 3 0 1 0 5.997-.001A3 3 0 0 0 12 3m-5 5.5A3.5 3.5 0 0 0 3.5 9a3.5 3.5 0 0 0 0 7 3.5 3.5 0 0 0 3.5-3.5m14 0A3.5 3.5 0 0 0 17.5 9a3.5 3.5 0 0 0 0 7 3.5 3.5 0 0 0 3.5-3.5" />
    <path d="M12 14a3 3 0 1 0-5.997.001A3 3 0 0 0 12 14m0 3a3 3 0 1 0 5.997-.001A3 3 0 0 0 12 17" />
    <path d="M6.003 5.001 3.5 12.5l2.503 7.501" />
    <path d="m17.997 5.001 2.503 7.5-2.503 7.501" />
    <path d="M12 3V2m0 18v1m-3.5-12.5h-5m14 0h-5" />
    <path d="m9.5 5.5 2.5 8.5 2.5-8.5" />
  </IconWrapper>
);

export const SendIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </IconWrapper>
);

export const DocumentIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </IconWrapper>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </IconWrapper>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconWrapper>
);

export const GoogleDriveIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path
      fill="currentColor"
      d="M19.228 14.288 12 3.018 4.772 14.288l-3.69 6.63A1.983 1.983 0 0 0 2.808 24h18.384a1.983 1.983 0 0 0 1.726-2.92l-3.69-6.792zM8.033 16.903 12 9.875l3.967 7.028H8.033z"
    />
  </IconWrapper>
);

export const LoadingSpinner: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </IconWrapper>
);

export const UploadCloudIcon: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </IconWrapper>
);
