"use client";

import { updateUserBio } from "@/lib/actions/user.actions";
import { useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { Toaster, toast } from "sonner";

type BioProps = {
  bio: string;
  id: string;
  canEdit: boolean;
};

const Bio = ({ bio: bioDetails, id, canEdit }: BioProps) => {
  const [bio, setBio] = useState(bioDetails);
  const [bioDialog, setBioDialog] = useState(bioDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const updateBio = async () => {
    setIsSubmitting(true);
    try {
      await updateUserBio(id, bioDialog);
      closeModal();
      setBio(bioDialog);
      toast.success("Bio updated successfully.");
    } catch {
      toast.error("Unable to update your bio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setBioDialog(bio);
    }
  };

  if (dialogRef.current) {
    dialogRef.current.addEventListener("click", (e) => {
      if (dialogRef.current) {
        const dialogDimensions = dialogRef.current.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          closeModal();
        }
      }
    });
  }

  return (
    <div>
      <div className="flex max-w-2xl items-center gap-2 mt-5 cursor-pointer relative group">
        <p
          onClick={canEdit ? showModal : undefined}
          className="text-lg sm:text-xl hover:opacity-50 transition-opacity duration-300 "
        >
          {bio ? bio : "Elevating style to an art form, one outfit at a time."}
        </p>
        {canEdit && (
          <MdEdit className="text-primary text-2xl opacity-0 group-hover:opacity-100" />
        )}
      </div>

      <dialog className="rounded-2xl w-[90vw] max-w-md p-4" ref={dialogRef}>
        <div className="w-full flex-col">
          <textarea
            className="w-full border border-color p-2"
            defaultValue={bioDialog}
            onChange={(e) => {
              setBioDialog(e.target.value);
            }}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="w-[90px] rounded-button bg-primary"
              onClick={updateBio}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="h-5 flex items-center justify-center">
                  <span className="horizontal-spinner bottom-3"></span>
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button
              className="w-[90px] rounded-button bg-primary"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
      <Toaster />
    </div>
  );
};

export default Bio;
