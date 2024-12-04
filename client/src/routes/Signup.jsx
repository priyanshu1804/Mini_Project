import { useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { makeUnauthenticatedPOSTRequest } from "../utils/sreverHelpers.js";

function SignupComponent() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const signUp = async () => {
    if (email !== confirmEmail) {
      alert("Email and confirm email fields must match. Please check again");
      return;
    }
    const data = { firstName, lastName, email, username, password };

    try {
      const response = await makeUnauthenticatedPOSTRequest("/auth/register", data);

      if (response && !response.err) {
          const token = response.token;
          const date = new Date();
          date.setDate(date.getDate() + 30);
          setCookie("token", token, {path: "/", expires: date});
          alert("Success");
          navigate("/home");
      } else {
          alert("Failure");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-gradient-to-br from-black via-red-800 to-black shadow-lg p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-orange-600 w-12 h-12 flex items-center justify-center rounded-full">
              <span className="text-white text-2xl font-bold">🎵</span>
            </div>
          </div>
          <h1 className="text-white text-2xl font-semibold">Create Your Account</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Fill in the details below to get started with musichub.
          </p>
        </div>
        <form>
          <div className="mb-4">
            <label className="text-gray-300 text-sm block mb-1">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 text-sm block mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 text-sm block mb-1">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 text-sm block mb-1">Email</label>
            <input
              type="email"
              placeholder="someone@gmail.com"
              className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 text-sm block mb-1">Confirm Email</label>
            <input
              type="email"
              placeholder="someone@gmail.com"
              className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-300 text-sm block mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              className="w-full bg-gray-800 text-gray-300 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition mb-4"
            onClick={(e) => {
              e.preventDefault();
              signUp();
            }}
          >
            Sign Up
          </button>
          <p className="text-gray-400 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupComponent;
