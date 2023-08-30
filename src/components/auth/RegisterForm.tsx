import { signIn } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import TextInput from "~/components/fields/inputs/TextInput";
import { trpc } from "~/lib/trpc-client";
import TextField from "../fields/TextField";

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

      for (let key of Object.keys(fieldErrors)) {
        formMethods.setError(key as keyof RegisterFormValues, {
          type: "manual",
          message: fieldErrors[key]?.[0],
        });
      }
    }
  }, [registerMutation.error, formMethods]);

  const onSubmit = async (values: RegisterFormValues) => {
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
        <TextField className="mb-6" type="text" name="name" label="Name" />
        <TextField
          className="mb-6"
          type="email"
          name="email"
          label="Email address"
        />
        <TextField
          className="mb-6"
          type="password"
          name="password"
          label="Password"
        />
        <TextField
          className="mb-6"
          type="password"
          name="passwordConfirmation"
          label="Password Confirmation"
        />
        <button
          type="submit"
          style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
          className="inline-block w-full rounded bg-blue-600 px-7 py-4 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          disabled={loading}
        >
          {loading ? "loading..." : "Sign Up"}
        </button>
      </form>
    </FormProvider>
  );
};
