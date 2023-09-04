import { signIn } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import TextInput from "~/components/fields/inputs/TextInput";
import { trpc } from "~/lib/trpc-client";
import TextField from "../fields/TextField";
import { Button } from "../ui/button";
import FormField from "../fields/FormField";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const RegisterForm = ({
  callbackUrl = "/app",
}: {
  callbackUrl: string;
}) => {
  const [loading, setLoading] = useState(false);
  const formMethods = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const registerMutation = trpc.user.register.useMutation();

  useEffect(() => {
    if (registerMutation.error?.data?.zodError) {
      const fieldErrors = registerMutation.error.data.zodError.fieldErrors;
      formMethods.clearErrors();
      console.log(fieldErrors);

      for (let key of Object.keys(fieldErrors)) {
        formMethods.setError(key as keyof RegisterFormValues, {
          type: "manual",
          message: fieldErrors[key]?.[0],
        });
      }
    }
  }, [registerMutation.error, formMethods]);

  const onSubmit = async (values: RegisterFormValues) => {
    console.log(values);
    setLoading(true);

    try {
      await registerMutation.mutateAsync(values);

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl,
      });
    } catch (e) {}

    setLoading(false);
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          render={(props) => (
            <TextField className="mb-6" label="Name" {...props} />
          )}
        />

        <FormField
          name="email"
          render={(props) => (
            <TextField
              className="mb-6"
              type="email"
              label="Email address"
              {...props}
            />
          )}
        />

        <FormField
          name="password"
          render={(props) => (
            <TextField
              className="mb-6"
              type="password"
              label="Password"
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
              label="Password Confirmation"
              {...props}
            />
          )}
        />

        <Button
          type="submit"
          style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
          disabled={loading}
          className="w-full"
        >
          {loading ? "loading..." : "Sign Up"}
        </Button>
      </form>
    </FormProvider>
  );
};
