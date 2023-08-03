import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import CredentialsForm from "~/components/auth/CredentialsForm";
import ProviderButtons from "~/components/auth/ProviderButtons";

export default function Signin() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="">
        <div className="mb-6">
          <h1 className=" text-center text-3xl font-bold">
            Sign in to your account
          </h1>
          <p className="mt-3">
            <span className="text-gray-400">Not yet registered?</span>
            <Link
              href="/auth/register"
              className="ml-2 font-medium text-blue-500"
            >
              Create an Account
            </Link>
          </p>
        </div>

        <CredentialsForm />

        <div className="">
          <div className="my-10 flex items-center justify-between gap-5">
            <span className="flex-1 border-b border-gray-200 md:w-1/4"></span>
            <p className="text-gray-800">Or continue with</p>
            <span className="flex-1 border-b border-gray-200 md:w-1/4"></span>
          </div>

          <ProviderButtons />
        </div>
      </div>
    </main>
  );
}
