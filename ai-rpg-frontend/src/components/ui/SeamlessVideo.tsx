import React, { useRef, useState, useEffect } from 'react';

interface SeamlessVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  crossfadeDuration?: number;
}

export const SeamlessVideo: React.FC<SeamlessVideoProps> = ({
  src,
  className = '',
  crossfadeDuration = 0.8,
  ...props
}) => {
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<1 | 2>(1);

  useEffect(() => {
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    if (!v1 || !v2 || !src) return;

    let isSwitching = false;

    const checkTime1 = () => {
      if (!v1.duration || isSwitching) return;
      if (v1.currentTime >= v1.duration - crossfadeDuration) {
        isSwitching = true;
        v2.currentTime = 0;
        v2.play().then(() => {
          setActive(2);
          setTimeout(() => {
            isSwitching = false;
          }, crossfadeDuration * 1000 + 200);
        }).catch(() => {
          isSwitching = false;
        });
      }
    };

    const checkTime2 = () => {
      if (!v2.duration || isSwitching) return;
      if (v2.currentTime >= v2.duration - crossfadeDuration) {
        isSwitching = true;
        v1.currentTime = 0;
        v1.play().then(() => {
          setActive(1);
          setTimeout(() => {
            isSwitching = false;
          }, crossfadeDuration * 1000 + 200);
        }).catch(() => {
          isSwitching = false;
        });
      }
    };

    v1.addEventListener('timeupdate', checkTime1);
    v2.addEventListener('timeupdate', checkTime2);

    return () => {
      v1.removeEventListener('timeupdate', checkTime1);
      v2.removeEventListener('timeupdate', checkTime2);
    };
  }, [src, crossfadeDuration]);

  const handleEnded1 = () => {
    if (v2Ref.current) {
      v2Ref.current.currentTime = 0;
      v2Ref.current.play().catch(() => {});
      setActive(2);
    }
  };

  const handleEnded2 = () => {
    if (v1Ref.current) {
      v1Ref.current.currentTime = 0;
      v1Ref.current.play().catch(() => {});
      setActive(1);
    }
  };

  const posClass = className.includes('absolute') || className.includes('fixed') ? '' : 'relative';

  return (
    <div className={`${posClass} overflow-hidden ${className}`}>
      <video
        ref={v1Ref}
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded1}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${active === 1 ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
      <video
        ref={v2Ref}
        src={src}
        muted
        playsInline
        onEnded={handleEnded2}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${active === 2 ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};
