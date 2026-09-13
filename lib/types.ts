export type IFilePicker = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  readFile: (type: IDecalType) => void;
};

export type ITab = {
  tab: ITabInfo;
  isFilterTab?: boolean;
  isActiveTab?: boolean;
  handleClick: () => void;
};

export type ITabInfo = {
  name: string;
  icon: string;
};

export type IDecalType = "logoImage" | "fullImage";

export type IAIPicker = {
  prompt: string;
  setPrompt: (value: string) => void;
  generatingImg: any;
  handleSubmit: () => void;
};

export type ICustomization = {
  id: string;
  logoImage: string;
  fullImage: string;
  isLogoImage: boolean;
  isFullImage: boolean;
  color: string;
};

export type ClerkUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string | null;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string | null;
  bio: string | null;
};

export type ICustomizationDetails = {
  customizationId: string;
  logoImage: string;
  fullImage: string;
  isLogoImage: boolean;
  isFullImage: boolean;
  color: string;
  userId: string;
  username: string;
  avatar: string;
};

export type IThreeDModelState = {
  logoImage: string;
  fullImage: string;
  isLogoImage: boolean;
  isFullImage: boolean;
  color: string;
};

export type FollowerUser = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export enum ModalType {
  "Following",
  "Followers",
}

export type PreviousImages = {
  logoImage: string;
  fullImage: string;
};
