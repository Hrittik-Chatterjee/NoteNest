import { Link } from "react-router-dom"; // Import Link from React Router
import Note from "./pages/Note";
import useAuth from "./hooks/useAuth";

function App() {
  const { user } = useAuth();

  // If the user exists, show the Note page
  if (user) {
    return <Note />;
  }

  // If no user, show the option to go to login or sign up pages
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Welcome to Note Nest! Please choose an option:
        </h2>
        <div className="space-y-4">
          <Link to="/signup">
            <button className="w-full my-5 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300">
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
