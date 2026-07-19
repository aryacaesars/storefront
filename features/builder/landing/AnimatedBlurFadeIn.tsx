"use client";

import { ElementType, ReactNode, useEffect, useRef, useState } from "react";

type AnimatedBlurFadeInProps<T extends ElementType> = {
  as?: T;
  className?: string;
  delayMs?: number;
  children: ReactNode;
};

export default function AnimatedBlurFadeIn<T extends ElementType = "div">({
  as,
  className,
  delayMs = 0,
  children,
}: AnimatedBlurFadeInProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${isVisible ? "animate-blur-fade-in" : "opacity-0"} ${className ?? ""}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}
