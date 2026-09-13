"use client";

import { ICustomizationDetails, IThreeDModelState } from "@/lib/types";
import Link from "next/link";
import CardUser from "./CardUser";
import dynamic from "next/dynamic";
import { fade } from "@/lib/motion";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { pacifico } from "@/app/fonts";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

type CustomizationsFeedProps = {
  customizationDetails: ICustomizationDetails[];
  isProfile?: boolean;
  id?: string;
};

const CustomizationsFeed = ({
  customizationDetails,
  isProfile = false,
  id,
}: CustomizationsFeedProps) => {
  const { userId } = useAuth();

  return (
    <>
      {customizationDetails && customizationDetails.length > 0 ? (
        <div className="pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {customizationDetails.map((customization) => (
            <CustomizationCard
              key={customization.customizationId}
              customizationDetail={customization}
              isProfile={isProfile}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="mt-8 p-4 lg:mt-28 text-xl flex-col items-center"
          {...fade}
        >
          {isProfile ? (
            <>
              {id === userId ? (
                <>
                  <p
                    className={`${pacifico.className} font-extrabold text-xl lg:text-3xl text-center`}
                  >
                    You have not created any designs.
                  </p>
                  <motion.p
                    whileHover={{ scale: 1.1 }}
                    className={`${pacifico.className} text-primary font-extrabold 
                    text-xl lg:text-3xl text-center mt-6`}
                  >
                    <Link href="/customize" className="cursor-pointer">
                      Create and share creative designs to the community.
                    </Link>
                  </motion.p>
                </>
              ) : (
                <p
                  className={`${pacifico.className} text-primary font-extrabold text-xl lg:text-3xl text-center`}
                >
                  User has not shared any designs.
                </p>
              )}
            </>
          ) : (
            <>
              <p
                className={`${pacifico.className} font-extrabold text-xl lg:text-3xl text-center`}
              >
                There are no designs.
              </p>
              <motion.p
                whileHover={{ scale: 1.1 }}
                className={`${pacifico.className} text-primary font-extrabold text-xl lg:text-3xl text-center mt-6`}
              >
                <Link href="/customize" className="cursor-pointer">
                  Create and share creative designs to the community.
                </Link>
              </motion.p>
            </>
          )}
        </motion.div>
      )}
    </>
  );
};

const CustomizationCard = ({
  customizationDetail,
  isProfile = false,
}: {
  customizationDetail: ICustomizationDetails;
  isProfile?: boolean;
}) => {
  const threeDModelState: IThreeDModelState = {
    color: customizationDetail.color,
    isLogoImage: customizationDetail.isLogoImage,
    isFullImage: customizationDetail.isFullImage,
    logoImage: customizationDetail.logoImage,
    fullImage: customizationDetail.fullImage,
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-2 min-h-[400px] md:min-h-[300px]">
      {!isProfile && (
        <Link href={`/profile/${customizationDetail.userId}`}>
          <CardUser
            image={customizationDetail.avatar}
            username={customizationDetail.username}
          />
        </Link>
      )}
      <Link
        className="flex h-full"
        href={`/customization/${customizationDetail.customizationId}`}
      >
        <Scene isCustomizable={false} threeDModelState={threeDModelState} />
      </Link>
    </div>
  );
};

export default CustomizationsFeed;
