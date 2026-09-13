"use client";

import { IFilePicker } from "@/lib/types";
import Image from "next/image";
import { FaPlusSquare } from "react-icons/fa";
import { ChangeEvent, useState } from "react";

const FilePicker = ({ file, setFile, readFile }: IFilePicker) => {
  const [image, setImage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image!");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Please choose an image smaller than 10 MB.");
      e.target.value = "";
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      setImage(result);
    };
  };

  return (
    <div className="filepicker-container">
      <div className="relative w-full h-full">
        <input
          id="file-upload"
          className="absolute z-50 top-0 left-0 opacity-0 w-full h-36 cursor-pointer"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e)}
        />
        {image ? (
          <div className="absolute top-0 left-0 w-full h-36 px-3 pt-3 flex items-center justify-center">
            <Image
              src={image}
              width={160}
              height={160}
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              alt="tshirt image"
            />
          </div>
        ) : (
          <div className="absolute top-0 left-0 px-3 pt-3 w-full h-36 ">
            <div
              className="w-full h-full flex items-center justify-center rounded-lg 
            border border-dashed border-grey-color"
            >
              <div className="flex-col items-center justify-center w-full">
                <FaPlusSquare className="w-full text-primary text-xl" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="flex-1 rounded-button bg-primary"
          onClick={() => readFile("logoImage")}
        >
          Logo
        </button>
        <button
          className="flex-1 rounded-button bg-primary"
          onClick={() => readFile("fullImage")}
        >
          Full
        </button>
      </div>
    </div>
  );
};

export default FilePicker;
