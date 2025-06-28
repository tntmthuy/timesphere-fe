import { Link } from "react-router-dom";

export const RegisterPage = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFDE70] px-4">
      <div className="border border-black w-full max-w-lg space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">
          Register New Account
        </h2>

        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-black"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-black"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Gender
            </label>
            <div className="flex flex-wrap gap-4">
              {["Male", "Female", "Other", "Prefer not to say"].map((label) => (
                <label
                  key={label}
                  className="inline-flex items-center gap-2 text-sm text-[#B3B1B0]"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={label}
                    className="mr-2 scale-150 accent-black"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-black"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-black"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repeat your password"
                className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between text-sm text-[#B3B1B0]">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="accent-black" />
            Remember me
          </label>

          <Link to="/verify">
            <button
              type="submit"
              className="border border-black rounded bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-white"
            >
              NEXT STEP
            </button>
          </Link>
        </div>

        <hr className="my-4 border-t border-[#D1D5DB]" />

        <p className="text-left text-sm text-[#B3B1B0]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-black hover:text-[#FFDE70]"
          >
            Log in
          </Link>
        </p>

        <div className="mb-2 flex items-center justify-between text-sm text-[#B3B1B0]">
          <button
            onClick={() => window.history.back()}
            className="transition hover:text-[#FFDE70]"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
};
