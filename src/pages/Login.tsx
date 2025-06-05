import { useState } from "react";
import { Link } from "react-router-dom";
import { isValidEmail, isValidPassword } from "@/lib/validation";
import {
  signInWithEmailAndPassword,
  // GoogleAuthProvider,
  // signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");
    
    // if (!isValidEmail(email)) {
    //   setError("Please enter a valid email address.");
    //   return;
    // }
    
    // if (!isValidPassword(password)) {
    //   setError("Password must be at least 6 characters.");
    //   return;
    // }
    
    const testUser = {
        username: "admin@gmail.com",
        password: "one23456",
    };

    if(email === testUser.username && password === testUser.password) {
      console.log("Logged in successfully!");
      navigate("/home");
    } else {
      setError("Invalid username or password.");
    }

    // try {
    //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //   const user = userCredential.user;
    //   console.log("Logged in user:", user);
    //   navigate("/home");
    // } catch (err: any) {
    //   console.error(err);
    //   if (err.code === "auth/user-not-found") {
    //     setError("No user found with this email.");
    //   } else if (err.code === "auth/wrong-password") {
    //     setError("Incorrect password.");
    //   } else {
    //     setError("Failed to log in. Please try again.");
    //   }
    // }
  };
  
  const hardcodedUser = {
    username: "admin@gmail.com",
    password: "one23456",
  };
  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     console.log("Logged in with Google:", user);
  //     navigate("/home");
  //   } catch (err) {
  //     console.error("Google sign-in error:", err);
  //     setError("Google login failed. Try again.");
  //   }
  // };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">Sign in to OEX</h1>
        <form
          onSubmit={handleLogin}
          className="space-y-4 bg-white p-6 rounded-md shadow-md"
          >
          <div>
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-200"
              />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-indigo-200"
              onChange={(e) => setPassword(e.target.value)}
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
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-gray-200 hover:text-black transition"
            >
            Log in
          </button>

          {/* <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-100 transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Login with Google
          </button>


          <div className="text-center text-sm text-blue-600 space-y-1 mt-2">
            <div className="text-gray-700">
              No account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
                Create one
              </Link>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;

