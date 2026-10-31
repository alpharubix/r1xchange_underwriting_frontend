import React from 'react';

export interface AdminLoaderProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  arcColor?: string;
  dotColor?: string;
  text?: string;
  containerClassName?: string;
}

/**
 * CRISP Branded Loading Spinner for Admin Portal.
 * Geometrically centered at (0, 0) for a perfectly balanced spin without wobble.
 */
export const AdminLoader: React.FC<AdminLoaderProps> = ({
  className = 'h-8 w-8 text-[#000080]',
  arcColor = 'currentColor',
  dotColor = '#2563eb',
  text,
  containerClassName = '',
  ...props
}) => {
  const svgElement = (
    <svg
      viewBox="-32 -32 64 64"
      className={`animate-spin shrink-0 ${className}`}
      aria-label="Loading"
      role="status"
      {...props}
    >
      {/* CRISP 'C' Arc */}
      <path
        d="M 15.875 -18 A 24 24 0 1 0 15.875 18"
        fill="none"
        stroke={arcColor}
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* CRISP Inner Dot */}
      <circle cx="15.875" cy="0" r="4.2" fill={dotColor} />
    </svg>
  );

  if (!text) {
    return svgElement;
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${containerClassName}`}>
      {svgElement}
      <span className="text-xs font-bold text-slate-600 tracking-tight">
        {text}
      </span>
    </div>
  );
};

export default AdminLoader;
