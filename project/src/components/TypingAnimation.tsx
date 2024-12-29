import React from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system';

const bounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  40% {
    transform: translateY(-6px);
    opacity: 1;
  }
`;

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

interface TypingAnimationProps {
  size?: number;
  color?: string;
  spacing?: number;
  showBackground?: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  size = 8,
  color = '#60a5fa',
  spacing = 3,
  showBackground = true,
}) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: showBackground ? 2 : 0,
        borderRadius: 2,
        ...(showBackground && {
          background: 'linear-gradient(120deg, rgba(96, 165, 250, 0.1), rgba(129, 140, 248, 0.1))',
          backgroundSize: '200% 200%',
          animation: `${gradient} 3s ease infinite`,
        }),
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            margin: `0 ${spacing}px`,
            animation: `${bounce} 1.4s ease-in-out infinite`,
            animationDelay: `${index * 0.16}s`,
            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        />
      ))}
    </Box>
  );
};

export default TypingAnimation;
