import React, { useState } from 'react';
import { getInitials } from '../utils/profileHelpers';

/**
 * Calm editorial avatar with automatic initials fallback when no photo is set
 * or when an image fails to load.
 */
export default function UserAvatar({
  name,
  src,
  sizeClass = 'w-16 h-16',
  textClass = 'text-lg',
  ringClass = 'ring-2 ring-[#3B2FD6]',
  className = '',
}) {
  const [failedSrc, setFailedSrc] = useState(null);

  const initials = getInitials(name);
  const showImage = Boolean(src) && failedSrc !== src;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s profile photo` : 'Profile photo'}
        onError={() => setFailedSrc(src)}
        className={`${sizeClass} rounded-full object-cover ${ringClass} bg-[#EAE5DA] ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name ? `${name} (${initials})` : 'User initials'}
      className={`${sizeClass} rounded-full ${ringClass} bg-[#E5E2F8] text-[#3B2FD6] font-bold flex items-center justify-center select-none ${textClass} ${className}`}
    >
      {initials}
    </div>
  );
}
