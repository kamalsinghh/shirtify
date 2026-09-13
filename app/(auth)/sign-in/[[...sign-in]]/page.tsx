import { SignIn } from "@clerk/nextjs";

type SignInPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const { redirectTo } = await searchParams;

  const safeRedirect =
    redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/";

  return <SignIn fallbackRedirectUrl={safeRedirect} />;
};

export default SignInPage;
