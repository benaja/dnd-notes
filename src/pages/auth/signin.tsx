import CredentialsForm from "~/components/auth/CredentialsForm";
import ProviderButtons from "~/components/auth/ProviderButtons";
import AppLink from "~/components/ui/AppLink";
import AuthLayout from "~/components/layouts/AuthLayout";
import { useSearchParams } from "next/navigation";

export default function Signin() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app";

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-medium">Sign in to your account</h1>
        <p className="mt-3">
          <span className="text-gray-400">Not yet registered?</span>
          <AppLink
            href={{ pathname: "/auth/register", query: { callbackUrl } }}
            className="ml-2 font-medium "
          >
            Create an Account
          </AppLink>
        </p>
      </div>

      <CredentialsForm callbackUrl={callbackUrl} />

      <AppLink href="/auth/forgot-password" className="mt-8 block">
        Forgot Password?
      </AppLink>

      <div className="">
        <div className="my-10 flex items-center justify-between gap-5">
          <span className="flex-1 border-b border-gray-200 md:w-1/4"></span>
          <p className="text-gray-800">Or continue with</p>
          <span className="flex-1 border-b border-gray-200 md:w-1/4"></span>
        </div>

        <ProviderButtons />
      </div>
    </AuthLayout>
  );
}
