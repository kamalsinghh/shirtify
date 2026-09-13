"use client";

import {
  followUser,
  isFollowingUser,
  unFollowUser,
} from "@/lib/actions/user.actions";
import { fadeAnimation } from "@/lib/motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type ProfileActionsProps = {
  userId: string;
  followingId: string;
};

const FollowButton = ({ userId, followingId }: ProfileActionsProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await isFollowingUser(userId, followingId);
      setIsFollowing(response.exists);
    };

    fetchData().catch((error) => console.log(error));
  }, [followingId, userId]);

  const handleOnClick = async () => {
    try {
      setIsSubmitting(true);
      if (isFollowing) {
        await unFollowUser(userId, followingId);
      } else {
        await followUser(userId, followingId);
      }
      setIsFollowing((prevIsFollowing) => !prevIsFollowing);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleOnClick}
      className="rounded-button bg-primary mt-4 w-full"
      {...fadeAnimation}
    >
      {isSubmitting ? (
        <div className="h-5 flex items-center justify-center">
          <span className="horizontal-spinner bottom-3"></span>
        </div>
      ) : (
        <>{isFollowing ? "Following" : "Follow"}</>
      )}
    </motion.button>
  );
};

export default FollowButton;
