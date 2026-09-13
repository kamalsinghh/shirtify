"use client";

import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation,
} from "@/lib/motion";
import { motion } from "framer-motion";
import { pacifico } from "../fonts";
import Link from "next/link";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <motion.section
      className="w-full flex flex-col lg:flex-row xl:py-16 xl:px-24 sm:p-8 p-6"
      {...slideAnimation("left")}
    >
      <motion.div
        className="lg:w-2/5 w-full xl:py-16 flex flex-1 justify-center items-center"
        {...headContainerAnimation}
      >
        <div className="flex flex-col gap-6 xl:gap-10">
          <motion.div {...headTextAnimation}>
            <h1
              className="xl:text-[8rem] text-[3rem] xl:leading-[11rem]
              leading-[6rem] font-black md:text-start text-center"
            >
              LET&apos;S
              <br className="hidden xl:block" /> DESIGN
            </h1>
          </motion.div>

          <motion.div
            {...headContentAnimation}
            className="flex flex-col xl:gap-12 gap-8 xl:justify-start justify-center"
          >
            <p className="max-w-md font-normal text-grey-color text-base xl:text-start text-center">
              Customize Your Style in 3D
              <br />
              <strong>Wear Innovation, Wear Exclusivity</strong>
            </p>

            <div className="w-full flex xl:justify-start justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                animate={{
                  y: [0, -15, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                  },
                }}
              >
                <Link
                  href="/customize"
                  className={`${pacifico.className} text-primary font-extrabold text-3xl`}
                >
                  Create my style
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="hidden lg:flex w-3/5 flex-col justify-center items-center gap-6">
        <Scene isCustomizable showTexture />
      </div>

      <div className="flex lg:hidden w-full h-[480px] mt-4 justify-center items-center">
        <Scene isCustomizable showTexture />
      </div>
    </motion.section>
  );
}
