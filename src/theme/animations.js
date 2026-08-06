/** Animation tokens for Framer Motion + CSS */

export const durations = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
};

export const easings = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.45, 0, 0.55, 1],
  spring: { type: "spring", stiffness: 380, damping: 32 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: durations.normal },
};

export const slideUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: { duration: durations.normal, ease: easings.out },
};

export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
  transition: { duration: durations.normal, ease: easings.out },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: durations.fast, ease: easings.out },
};

export const modalMotion = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: 8 },
    transition: { duration: durations.normal, ease: easings.out },
  },
};

export const drawerMotion = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition: { duration: durations.slow, ease: easings.out },
};

export const hoverLift = {
  whileHover: { y: -2, transition: { duration: durations.fast } },
  whileTap: { scale: 0.98 },
};
