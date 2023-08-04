"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TextInput from "~/components/fiels/TextInput";
import { Button } from "../ui/button";

export default function CredentialsForm({
  callbackUrl = "/app",
}: {
  callbackUrl?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formMethods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        // redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      setLoading(false);

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("Invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <TextInput type="email" name="email" label="Email address" />
        </div>
        <TextInput type="password" name="password" label="Password" />
        {error ? (
          <p className="leading-4 text-red-600">{error}</p>
        ) : (
          <p className="h-4"></p>
        )}

        <Button className="mt-4 w-full" disabled={loading}>
          Sign In
        </Button>
      </form>
    </FormProvider>
  );
}
