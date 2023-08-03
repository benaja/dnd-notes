import { RegisterForm } from "./form";

export default function RegisterPage() {
  return (
    <>
      <section className="flex h-screen items-center justify-center">
        <div className="bg-white px-8 py-10 md:w-8/12 lg:w-5/12">
          <h1 className="mb-6 text-3xl font-bold">Create an Account</h1>
          <RegisterForm />
        </div>
      </section>
    </>
  );
}
