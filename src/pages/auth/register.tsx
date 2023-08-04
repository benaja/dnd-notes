import { useSearchParams } from "next/navigation";
import { RegisterForm } from "~/components/auth/RegisterForm";
import AuthLayout from "~/components/layouts/AuthLayout";
import AppLink from "~/components/ui/AppLink";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/app";

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-medium">Create an Account</h1>
        <p className="mt-3">
          <span className="text-gray-400">Already have an account?</span>
          <AppLink
            href={{ pathname: "/auth/signin", query: { callbackUrl } }}
            className="ml-2 font-medium "
          >
            Sign in
          </AppLink>
        </p>
      </div>
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}
