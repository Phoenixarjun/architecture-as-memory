import { Variants } from "framer-motion";

export const fadeIn = (direction: "up" | "down" | "left" | "right" | "none" = "none", delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      delay,
    },
  },
});

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const slideUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 18,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.94, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 20,
    },
  },
};

export const blurReveal: Variants = {
  hidden: { filter: "blur(8px)", opacity: 0, y: 10 },
  show: {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // premium custom cubic-bezier
    },
  },
};

export const graphFloat: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};
