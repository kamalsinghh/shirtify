import { ITabInfo } from "./types";

export const navLinks = [
  {
    title: "Create Designs",
    href: "/customize",
    icon: "/assets/images/camera.png",
  },
  {
    title: "Explore Designs",
    href: "/customizations",
    icon: "/assets/images/shining.png",
  },
];

export const EditorTabs: ITabInfo[] = [
  {
    name: "colorpicker",
    icon: "/assets/images/color.png",
  },
  {
    name: "filepicker",
    icon: "/assets/images/file.png",
  },
];

export const FilterTabs: ITabInfo[] = [
  {
    name: "logoImage",
    icon: "/assets/images/logo-tshirt.png",
  },
  {
    name: "fullImage",
    icon: "/assets/images/stylish-tshirt.png",
  },
];

export const DecalTypes = ["logoImage", "fullImage"];

export const DefaultState = {
  color: "#C10048",
  isLogoImage: true,
  isFullImage: false,
  logoImage: "./assets/images/batman.png",
  fullImage: "./assets/images/batman.png",
};
