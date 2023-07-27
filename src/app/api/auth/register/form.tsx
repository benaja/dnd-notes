"use client";

import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import TextInput from "~/components/fiels/TextInput";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const formMethods = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
    if (!res.ok) {
      const response = await res.json();
      if (response.status === "validation-error") {
        console.log(response.issues);
        for (let error of response.issues) {
          console.log(error.path[0]);
          formMethods.clearErrors();
          formMethods.setError(error.path[0], {
            type: "manual",
            message: error.message,
          });
        }
      }
      // setError((await res.json()).message);
      return;
    }

    signIn(undefined, { callbackUrl: "/" });
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        {/* {error && (
          <p className="mb-6 rounded bg-red-300 py-4 text-center">{error}</p>
        )} */}
        <div className="mb-6">
          <TextInput type="text" name="name" label="Name" />
        </div>
        <div className="mb-6">
          <TextInput type="email" name="email" label="Email address" />
        </div>
        <div className="mb-6">
          <TextInput type="password" name="password" label="Password" />
        </div>
        <div className="mb-6">
          <TextInput
            type="password"
            name="passwordConfirmation"
            label="Password Confirmation"
          />
        </div>
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
