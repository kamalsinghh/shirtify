"use client";

import { getFollowersList, getFollowingList } from "@/lib/actions/user.actions";
import { FollowerUser, ModalType } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import Followers from "./Followers";
import { fadeAnimation } from "@/lib/motion";

const Connections = ({ userId }: { userId: string }) => {
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [modalType, setModalType] = useState(ModalType.Followers);
  const [isFollowersLoading, setIsFollowersLoading] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      setIsFollowersLoading(true);
      const [followersResponse, followingResponse] = await Promise.all([
        getFollowersList(userId),
        getFollowingList(userId),
      ]);

      setFollowers(followersResponse as FollowerUser[]);
      setFollowing(followingResponse as FollowerUser[]);
      setIsFollowersLoading(false);
    };

    fetchConnections();
  }, [userId]);

  const showFollowersModal = () => {
    setModalType(ModalType.Followers);
    showModal();
  };

  const showFollowingModal = () => {
    setModalType(ModalType.Following);
    showModal();
  };

  const showModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const closeOnBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      e.currentTarget.close();
    }
  };

  return (
    <motion.div className="flex gap-2 w-full">
      <button
        onClick={showFollowersModal}
        className="rounded-button bg-primary mt-4 flex-1"
        {...fadeAnimation}
      >
        Followers
      </button>
      <button
        onClick={showFollowingModal}
        className="rounded-button bg-primary mt-4 flex-1"
      >
        Following
      </button>
      <dialog
        className="rounded-2xl w-[90vw] max-w-md p-4"
        ref={dialogRef}
        onClick={closeOnBackdrop}
      >
        <div className="flex-col items-center justify-center">
          <div>
            <h1 className="mb-2 font-bold text-center">
              {ModalType[modalType]}
            </h1>
            <IoClose
              className="absolute right-0 top-0 m-4 font-bold cursor-pointer"
              onClick={closeModal}
            />
          </div>

          <div
            className="border-t divider-color w-full 
              h-96 overflow-y-scroll overflow-x-scroll"
          >
            {isFollowersLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="half-circle-spinner">
                  <div className="circle circle-1"></div>
                  <div className="circle circle-2"></div>
                </div>
              </div>
            ) : (
              <>
                {modalType === ModalType.Following ? (
                  <>
                    {following.length === 0 ? (
                      <h1 className="my-4 flex items-center justify-center">
                        No Following
                      </h1>
                    ) : (
                      <Followers
                        modalType={modalType}
                        userId={userId}
                        followers={following}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {followers.length === 0 ? (
                      <h1 className="my-4 flex items-center justify-center">
                        No Followers
                      </h1>
                    ) : (
                      <Followers
                        modalType={modalType}
                        userId={userId}
                        followers={followers}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </dialog>
    </motion.div>
  );
};

export default Connections;
