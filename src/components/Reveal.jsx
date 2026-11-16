import { motion } from 'motion/react';

/**
 * Scroll-reveal wrapper. Fades + lifts its children once when they enter the viewport.
 * Reduced-motion users get the content immediately (handled globally by <MotionConfig>).
 */
export default function Reveal({ as = 'div', delay = 0, y = 24, className, children, ...props }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Comp>
  );
}
