import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedCounter({ value }: { value: number }) {
  const [prev, setPrev] = useState(value);

  useEffect(() => {
    setPrev(value);
  }, [value]);

  const direction = value > prev ? 1 : -1;

  return (
    <span className="inline-block overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
