import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import FormField from "~/components/fields/FormField";
import TextField from "~/components/fields/TextField";
import AuthLayout from "~/components/layouts/AuthLayout";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/trpc-client";

type ResetPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
};

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const mutation = trpc.user.resetPassword.useMutation({
    onSuccess: () => {
      signIn("credentials", {
        email: searchParams.get("email") || "",
        password: formMethods.getValues().password,
        callbackUrl: "/app",
      });
    },
  });

  const formMethods = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(
      z
        .object({
          password: z.string().min(8),
          passwordConfirmation: z.string().min(8),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
          message: "Passwords do not match",
          path: ["passwordConfirmation"],
        }),
    ),
  });

  function onSubmit(values: ResetPasswordFormValues) {
    mutation.mutate({
      ...values,
      token: searchParams.get("token") || "",
      email: searchParams.get("email") || "",
    });
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="mb-4 text-4xl font-medium">Enter your new password</h1>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <FormField
              name="password"
              render={(props) => (
                <TextField
                  className="mb-6"
                  label="Password"
                  type="password"
                  {...props}
                />
              )}
            />

            <FormField
              name="passwordConfirmation"
              render={(props) => (
                <TextField
                  className="mb-6"
                  type="password"
                  label="Password confirmation"
                  {...props}
                />
              )}
            />

            {mutation.error && (
              <p className="mb-4 text-red-500">
                There was an unknown error. Please try again later.
              </p>
            )}

            <Button loading={mutation.isLoading} type="submit">
              Reset password
            </Button>
          </form>
        </FormProvider>
      </div>
    </AuthLayout>
  );
}
