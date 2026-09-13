import UserCustomization from "@/components/UserCustomization";
import { getCustomizationByID } from "@/lib/actions/customize.action";
import { ICustomizationDetails, IThreeDModelState } from "@/lib/types";
import { notFound } from "next/navigation";

type CustomizationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const CustomizationPage = async ({ params }: CustomizationPageProps) => {
  const { id } = await params;

  const customizations = (await getCustomizationByID(
    id,
  )) as ICustomizationDetails[];

  if (!customizations.length) {
    notFound();
  }

  const { color, logoImage, fullImage, isLogoImage, isFullImage, userId } =
    customizations[0];

  const threeDModelState: IThreeDModelState = {
    color,
    logoImage,
    fullImage,
    isLogoImage,
    isFullImage,
  };

  return (
    <UserCustomization
      threeDModelState={threeDModelState}
      userId={userId}
      customizationId={id}
    />
  );
};

export default CustomizationPage;
