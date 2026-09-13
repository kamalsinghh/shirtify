"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Show, useAuth } from "@clerk/nextjs";
import { slideAnimation } from "@/lib/motion";
import { EditorTabs, FilterTabs } from "@/lib/constants";
import { motion } from "framer-motion";
import { pacifico } from "@/app/fonts";
import { ICustomization, IDecalType, IThreeDModelState } from "@/lib/types";
import {
  createCustomization,
  updateCustomization,
} from "@/lib/actions/customize.action";
import { isBase64, reader, urlToBase64 } from "@/lib/utils";
import ColorPicker from "./customize/ColorPicker";
import FilePicker from "./customize/FilePicker";
import Tab from "./customize/Tab";
import dynamic from "next/dynamic";
import state from "@/store";
import Loader from "./Loader";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

type CustomizeProps = {
  type: "create" | "update";
  threeDModelState?: IThreeDModelState | null;
  customizationId?: string;
};

const Customize = ({
  type,
  threeDModelState = null,
  customizationId,
}: CustomizeProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [isLogoActive, setIsLogoActive] = useState(
    type === "create" ? state.isLogoImage : threeDModelState?.isLogoImage,
  );
  const [isFullActive, setIsFullActive] = useState(
    type === "create" ? state.isFullImage : threeDModelState?.isFullImage,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShared, setIsShared] = useState(type === "create" ? false : true);
  const [isLoading, setIsLoading] = useState(false);

  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    if (threeDModelState) {
      state.color = threeDModelState.color;
      state.isFullImage = threeDModelState.isFullImage;
      state.isLogoImage = threeDModelState.isLogoImage;

      const loadImagesFromUrl = async () => {
        if (threeDModelState.logoImage && threeDModelState.fullImage) {
          const [logoImageResponse, fullImageResponse] = await Promise.all([
            urlToBase64(threeDModelState.logoImage),
            urlToBase64(threeDModelState.fullImage),
          ]);

          state.logoImage = logoImageResponse;
          state.fullImage = fullImageResponse;
        } else if (threeDModelState.logoImage) {
          const logoImageResponse = await urlToBase64(
            threeDModelState.logoImage,
          );

          state.logoImage = logoImageResponse;
          state.fullImage = logoImageResponse;
        } else if (threeDModelState.fullImage) {
          const fullImageResponse = await urlToBase64(
            threeDModelState.fullImage,
          );

          state.logoImage = fullImageResponse;
          state.fullImage = fullImageResponse;
        }
      };

      setIsLoading(true);
      loadImagesFromUrl()
        .catch(() => toast.error("Unable to load the saved design images."))
        .finally(() => setIsLoading(false));
    }
  }, [threeDModelState]);

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker onChange={handleColorChange} />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      default:
        return null;
    }
  };

  const handleColorChange = (color: string) => {
    state.color = color;
    setIsShared(false);
  };

  const handleDecals = (type: IDecalType, result: string) => {
    state[type] = result as string;

    if (type === "logoImage" && !state.isLogoImage) {
      state.isLogoImage = true;
      setIsLogoActive(true);
    } else if (type === "fullImage" && !state.isFullImage) {
      state.isFullImage = true;
      setIsFullActive(true);
    }
  };

  const handleActiveFilterTab = (tabName: IDecalType) => {
    if (tabName === "logoImage") {
      state.isLogoImage = !state.isLogoImage;
      setIsLogoActive(!isLogoActive);
    } else if (tabName === "fullImage") {
      state.isFullImage = !state.isFullImage;
      setIsFullActive(!isFullActive);
    }
  };

  const readFile = (type: IDecalType) => {
    if (file) {
      reader(file).then((result) => {
        handleDecals(type, result as string);
        setActiveEditorTab("");
        setIsShared(false);
      });
    }
  };

  const handleShare = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to share your design.");
      return;
    }

    if (isSignedIn) {
      if (isBase64(state.logoImage) || isBase64(state.fullImage)) {
        const customization: ICustomization = {
          id: type === "create" ? userId : customizationId || "",
          logoImage: state.logoImage,
          fullImage: state.fullImage,
          isLogoImage: state.isLogoImage,
          isFullImage: state.isFullImage,
          color: state.color,
        };

        setIsSubmitting(true);

        try {
          if (type === "create") {
            await createCustomization(customization);
            toast.success("Your design is shared with the community.");
          } else if (threeDModelState) {
            const updateCustomizationDetails = customization;

            await updateCustomization(updateCustomizationDetails);
            toast.success("Your design is updated successfully.");
          }

          setIsShared(true);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to save the design.",
          );
        } finally {
          setIsSubmitting(false);
        }
      } else {
        toast.error("Please select an image for your design.");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex flex-1 w-[100vw] h-[82vh]">
        <Scene isCustomizable={true} showTexture={true} />

        <Show when="signed-in">
          {isSubmitting ? (
            <div
              className="absolute bottom-36 lg:top-0 lg:right-0 z-0 lg:mr-24 w-full lg:w-fit
            lg:h-[100vh] flex items-center justify-center"
            >
              <div className="half-circle-spinner">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
              </div>
            </div>
          ) : (
            <>
              {!isShared && (
                <motion.div
                  className="absolute bottom-36 lg:top-0 lg:right-0 z-0 lg:mr-24 w-full lg:w-fit
                  lg:h-[100vh] flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    y: [0, -15, 0],
                    transition: { repeat: Infinity, duration: 1.5 },
                  }}
                >
                  <button
                    type="button"
                    className={`${pacifico.className} text-primary font-extrabold text-3xl`}
                    onClick={handleShare}
                  >
                    {type === "create" ? "Share" : "Update"}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </Show>

        <motion.div
          key="custom"
          className="absolute top-0 left-0 z-10"
          {...slideAnimation("left")}
        >
          <div className="flex items-center min-h-screen">
            <div className="editortabs-container">
              {EditorTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  handleClick={() => {
                    if (activeEditorTab === tab.name) {
                      setActiveEditorTab("");
                    } else {
                      setActiveEditorTab(tab.name);
                    }
                  }}
                />
              ))}
              {generateTabContent()}
            </div>
          </div>
        </motion.div>

        <motion.div className="filtertabs-container" {...slideAnimation("up")}>
          {FilterTabs.map((tab) => (
            <Tab
              key={tab.name}
              tab={tab}
              isFilterTab
              isActiveTab={
                tab.name === "logoImage" ? isLogoActive : isFullActive
              }
              handleClick={() => handleActiveFilterTab(tab.name as IDecalType)}
            />
          ))}
        </motion.div>
      </div>
      <Toaster />
    </>
  );
};

export default Customize;
