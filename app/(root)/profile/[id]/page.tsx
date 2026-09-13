import CustomizationsFeed from "@/components/CustomizationsFeed";
import Pagination from "@/components/pagination/Pagination";
import ProfileHeader from "@/components/profile/ProfileHeader";
import {
  getUserCustomizations,
  getUserCustomizationsPages,
} from "@/lib/actions/customize.action";
import { getUserDetails } from "@/lib/actions/user.actions";
import { ICustomizationDetails, User } from "@/lib/types";
import { notFound } from "next/navigation";

type ProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
  const { id } = await params;
  const { page } = await searchParams;

  const parsedPage = Number(page);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [userDetails, customizations, totalPages] = await Promise.all([
    getUserDetails(id),
    getUserCustomizations(id, currentPage),
    getUserCustomizationsPages(id),
  ]);

  const users = userDetails as User[];

  if (!users.length) {
    notFound();
  }

  const user: User = {
    id,
    avatar: users[0].avatar,
    firstName: users[0].firstName,
    lastName: users[0].lastName,
    username: users[0].username,
    bio: users[0].bio,
  };

  const designs = customizations as ICustomizationDetails[];

  return (
    <>
      <ProfileHeader user={user} />

      <CustomizationsFeed customizationDetails={designs} isProfile id={id} />

      {designs.length > 0 && <Pagination totalPages={totalPages} />}
    </>
  );
};

export default ProfilePage;
