import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import FormField from "~/components/fields/FormField";
import TextField from "~/components/fields/TextField";
import AuthLayout from "~/components/layouts/AuthLayout";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/trpc-client";

export default function RegisterPage() {
  const mutation = trpc.user.forgotPassword.useMutation({
    onError(error, variables, context) {},
  });
  const formMethods = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
      }),
    ),
  });

  function onSubmit(values: { email: string }) {
    mutation.mutate(values);
  }

  return (
    <AuthLayout>
      {!mutation.isSuccess && (
        <div className="mb-6">
          <h1 className="mb-4 text-4xl font-medium">Forgot your password?</h1>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                render={(props) => (
                  <TextField
                    className="mb-6"
                    type="email"
                    label="Email"
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
                Send reset link
              </Button>
            </form>
          </FormProvider>
        </div>
      )}
      {mutation.isSuccess && (
        <div className="mb-6">
          <h1 className="mb-4 text-4xl font-medium">Email sent!</h1>
          <p className="text-gray-800">Please check your inbox.</p>
        </div>
      )}
    </AuthLayout>
  );
}
