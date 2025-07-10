import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Signup successful
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white w-full max-w-md rounded-md shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center">Signup</h2>

        <form className="space-y-3" onSubmit={handleSignup}>
          <input
            type="email"
            value={email}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-200"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Create password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-200"
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Confirm password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-200"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-300 text-black py-2 rounded hover:bg-indigo-600 hover:text-white transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-full bg-gray-300" />
          <span className="text-sm text-gray-500">Or</span>
          <div className="h-px w-full bg-gray-300" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
