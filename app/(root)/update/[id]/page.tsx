import Customize from "@/components/Customize";
import { getCustomizationByID } from "@/lib/actions/customize.action";
import { ICustomizationDetails, IThreeDModelState } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

type UpdatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const UpdatePage = async ({ params }: UpdatePageProps) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const customizations = (await getCustomizationByID(
    id,
  )) as ICustomizationDetails[];

  if (!customizations.length || customizations[0].userId !== userId) {
    notFound();
  }

  const { color, logoImage, fullImage, isLogoImage, isFullImage } =
    customizations[0];

  const threeDModelState: IThreeDModelState = {
    color,
    logoImage,
    fullImage,
    isLogoImage,
    isFullImage,
  };

  return (
    <Customize
      type="update"
      threeDModelState={threeDModelState}
      customizationId={id}
    />
  );
};

export default UpdatePage;
