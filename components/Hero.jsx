"use client";

import { ArrowRight } from "lucide-react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import { useEffect } from "react";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const Hero = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  });

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, black 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative w-full bg-black flex flex-col items-center justify-center overflow-hidden  py-8 xl:py-24 h-[100vh] xl:pt-28"
    >
      <div className="z-10 flex flex-col items-center px-24 ">
        <h1 className="max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-7xl">
          Don&apos;t know Web Development?
          <br />
          <span>Verve</span> can help
        </h1>
        <p className="my-6 max-w-xl text-center text-sm leading-relaxed sm:text-lg ">
          Get started with a basic website in a matter of minutes using{" "}
          <strong>Verve</strong>, Your new AI Web Developer.
        </p>
        <a href="/form">
          <motion.button
            style={{
              border,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="group relative flex w-fit items-center gap-1.5 rounded-full bg-black px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            Get Started
            <ArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>
        </a>
      </div>
    </motion.section>
  );
};

export default Hero;
