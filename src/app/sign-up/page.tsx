export default function SignUp() {
  return (
    <div>
      <h1 className=" text-2xl">Sign Up</h1>

      <form className="flex flex-col space-y-4">
        <label>
          <span>Username</span>
          <input type="text" />
        </label>

        <label>
          <span>Email</span>
          <input type="email" />
        </label>

        <label>
          <span>Password</span>
          <input type="password" />
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
