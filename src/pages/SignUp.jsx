import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SignUp = () => {
  const { createUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await createUser(email, password);
      console.log("User created successfully");

      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 md:mt-0 lg:mt-0  mt-28 mb-40 md:mb-0 lg:mb-0 mx-5 md:mx-0 md:my-0"
      >
        <div className="md:w-1/3 max-w-sm">
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="email"
            placeholder="Email Address"
            name="email"
            required
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            placeholder="Password"
            name="password"
            required
          />

          <div className="text-center md:text-left">
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="submit"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
            Already have an account?{" "}
            <Link
              className="text-red-600 hover:underline hover:underline-offset-4"
              to="/login"
            >
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
