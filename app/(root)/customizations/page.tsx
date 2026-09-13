import CustomizationsFeed from "@/components/CustomizationsFeed";
import Pagination from "@/components/pagination/Pagination";
import {
  getCustomizations,
  getCustomizationPages,
} from "@/lib/actions/customize.action";
import { ICustomizationDetails } from "@/lib/types";

type CustomizationsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const CustomizationsPage = async ({
  searchParams,
}: CustomizationsPageProps) => {
  const { page } = await searchParams;

  const parsedPage = Number(page);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [customizations, totalPages] = await Promise.all([
    getCustomizations(currentPage),
    getCustomizationPages(),
  ]);

  const designs = customizations as ICustomizationDetails[];

  return (
    <>
      <CustomizationsFeed customizationDetails={designs} />

      {designs.length > 0 && <Pagination totalPages={totalPages} />}
    </>
  );
};

export default CustomizationsPage;
