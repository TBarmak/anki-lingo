export const DURATION = {
  DEFAULT: 0.5,
  QUICK: 0.25,
  MEDIUM: 0.5,
  SLOW: 1,
};

export const DELAY = {
  NONE: 0,
  SHORT: 0.15,
  MEDIUM: 0.3,
  LONG: 0.45,
  EXTRA_LONG: 0.6,
};

export const FADE = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { ease: "easeInOut" },
  },
};

export const FADE_UP = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

export const FADE_DOWN = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0 },
};

export const FADE_LEFT = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
};

export const FADE_RIGHT = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
};

export const TRANSITION = {
  DEFAULT: { duration: DURATION.DEFAULT },
  WITH_DELAY: (delay: number) => ({ duration: DURATION.DEFAULT, delay }),
  QUICK: { duration: DURATION.QUICK },
  MEDIUM: { duration: DURATION.MEDIUM },
  SLOW: { duration: DURATION.SLOW },
};

export const HOVER = {
  SCALE: { scale: 1.05 },
};

export const TAP = {
  SCALE: { scale: 0.98 },
};

export const EXIT = {
  DEFAULT: {
    opacity: 0,
    transition: { ease: "easeInOut", duration: DURATION.DEFAULT },
  },
};
