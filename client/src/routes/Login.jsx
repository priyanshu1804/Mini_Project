import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeUnauthenticatedPOSTRequest } from "../utils/sreverHelpers.js";
import { useCookies } from "react-cookie";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const login = async () => {
    const data = { email, password };
    const response = await makeUnauthenticatedPOSTRequest("/auth/login", data);
    if (response && !response.err) {
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      alert("Success");
      navigate("/home");
    } else {
      alert("Failure");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90">
      <div className="bg-gradient-to-br from-black via-red-800 to-black shadow-lg p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-orange-600 w-12 h-12 flex items-center justify-center rounded-full">
              <span className="text-white text-2xl font-bold">🎸</span>
            </div>
          </div>
          <h1 className="text-white text-2xl font-semibold">Welcome to MUSICHUB</h1>
          <h1 className="text-white mt-2 text-sm">LOGIN</h1>
        </div>
        <form>
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
              login();
            }}
          >
            Sign In
          </button>
          <Link
            to="/signup"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition text-center block"
          >
            Register
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginComponent;
