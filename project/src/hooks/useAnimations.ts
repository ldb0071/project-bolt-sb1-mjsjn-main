import { useSpring, useTransition, config } from '@react-spring/web';

export const useAnimations = () => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 280, friction: 60 },
  });

  const slideIn = useSpring({
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
    config: config.gentle,
  });

  const scaleIn = useSpring({
    from: { transform: 'scale(0.8)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    config: config.wobbly,
  });

  const createListTransition = (items: any[]) =>
    useTransition(items, {
      from: { opacity: 0, transform: 'translateY(20px)' },
      enter: { opacity: 1, transform: 'translateY(0)' },
      leave: { opacity: 0, transform: 'translateY(-20px)' },
      trail: 100,
    });

  const pageTransition = useTransition(true, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(1.1)' },
    config: config.gentle,
  });

  return {
    fadeIn,
    slideIn,
    scaleIn,
    createListTransition,
    pageTransition,
  };
};
