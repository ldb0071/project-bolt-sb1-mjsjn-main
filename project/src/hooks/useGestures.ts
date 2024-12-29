import { useState, useEffect } from 'react';
import { useSpring, useGesture } from '@use-gesture/react';
import { animated } from '@react-spring/web';

interface GestureConfig {
  enablePinch?: boolean;
  enableRotate?: boolean;
  enableSwipe?: boolean;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
}

export const useGestures = (config: GestureConfig = {}) => {
  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
  }));

  const bind = useGesture(
    {
      onDrag: ({ down, movement: [mx, my], direction: [xDir, yDir] }) => {
        if (config.enableSwipe && !down) {
          const threshold = 50;
          if (Math.abs(mx) > threshold || Math.abs(my) > threshold) {
            const direction = 
              Math.abs(mx) > Math.abs(my)
                ? mx > 0 ? 'right' : 'left'
                : my > 0 ? 'down' : 'up';
            config.onSwipe?.(direction as 'left' | 'right' | 'up' | 'down');
          }
        }
        api.start({
          x: down ? mx : 0,
          y: down ? my : 0,
          immediate: down,
        });
      },
      onPinch: ({ offset: [scale] }) => {
        if (config.enablePinch) {
          api.start({ scale });
          config.onPinch?.(scale);
        }
      },
      onRotate: ({ offset: [angle] }) => {
        if (config.enableRotate) {
          api.start({ rotate: angle });
          config.onRotate?.(angle);
        }
      },
    },
    {
      drag: {
        from: () => [style.x.get(), style.y.get()],
      },
      pinch: {
        scaleBounds: { min: 0.5, max: 2 },
      },
    }
  );

  return { bind, style };
};
