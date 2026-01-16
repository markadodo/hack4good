'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "participant", // Default role
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // // --- START OF TESTING BYPASS ---
    // // This allows you to log in with ANY username/password
    // console.log("Testing Mode: Bypassing Backend");
    
    // // You can even simulate different roles based on the username
    // if (formData.username === "admin") {
    //   router.push("/admin");
    // } else if (formData.username === "volunteer") {
    //   router.push("/volunteer");
    // } else {
    //   router.push("/participant");
    // }
    // return; 
    // // --- END OF TESTING BYPASS ---

    const endpoint = isRegistering ? "/auth/register" : "/auth/login";
    
    // Mapping registration data to match backend CreateUserInput
    const payload = isRegistering 
      ? { 
          username: formData.username, 
          password: formData.password, 
          role: formData.role, // Matches backend CreateUserInput struct
          membership_type: 0 
        } 
      : { 
          username: formData.username, 
          password: formData.password 
        };

    try {
      // const response = await fetch("http://localhost:8080/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isRegistering) {
        alert("Registration successful! Please login.");
        setIsRegistering(false);
        // Optionally clear the password field for security
        setFormData(prev => ({ ...prev, password: "" }));
      } else {
        router.push(`/${data.role || formData.role}`);
        //router.push(`/${formData.role}`); 
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>{isRegistering ? "Create Account" : "Welcome"}</h1>
      <p>{isRegistering ? "Fill in your details to join" : "Enter your credentials to login"}</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />


        {isRegistering && (
          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Select Role:</label>
            <select 
                name="role" 
                value={formData.role} 
                onChange={handleInputChange} style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px"
            }}>
              <option value="participant">Participant</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin/Staff</option>
            </select>
          </div>
        )}

        {error && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "10px" }}>{error}</p>}

        <button type="submit" style={{ width: "100%", marginTop: "20px" }}>
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <div style={{ marginTop: "20px", fontSize: "0.9rem" }}>
        {isRegistering ? (
          <p>
            Already have an account?{" "}
            <span 
              onClick={() => setIsRegistering(false)} 
              style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span 
              onClick={() => setIsRegistering(true)} 
              style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
            >
              Register account
            </span>
          </p>
        )}
      </div>
    </div>
  );
}


// 'use client';

// import { useRouter } from "next/navigation";

// export default function Login() {
//   const router = useRouter();

//   return (
//     <div className="login-container">
//       <h1>Welcome</h1>
//       <p>Select your role to login:</p>
//       <button onClick={() => router.push("/participant")} aria-label="Login as Participant">Participant</button>
//       <button onClick={() => router.push("/volunteer")} aria-label="Login as Volunteer">Volunteer</button>
//       <button onClick={() => router.push("/admin")} aria-label="Login as Admin">Admin</button>
//     </div>
//   );
// }
