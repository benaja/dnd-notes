"use client";

import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import TextInput from "~/components/fiels/TextInput";

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormValues({
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      if (!res.ok) {
        setError((await res.json()).message);
        return;
      }

      signIn(undefined, { callbackUrl: "/" });
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className="mb-6 rounded bg-red-300 py-4 text-center">{error}</p>
      )}
      <div className="mb-6">
        <TextInput
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          label="Name"
        />
      </div>
      <div className="mb-6">
        <TextInput
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          label="Email address"
        />
      </div>
      <div className="mb-6">
        <TextInput
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          label="Password"
        />
      </div>
      <div className="mb-6">
        <TextInput
          type="password"
          name="passwordConfirmation"
          value={formValues.passwordConfirmation}
          onChange={handleChange}
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
  );
};
