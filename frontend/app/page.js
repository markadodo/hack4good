'use client';


import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


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
       credentials: "include",
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
       const targetRole = data.role === "staff" ? "admin" : data.role;
       router.push(`/logged_in/${targetRole}`);
      
     }
   } catch (err) {
     setError(err.message);
   }
 };
    
 return (
  <div className="auth-background-wrapper" style={{
    
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    
    
    backgroundImage: `url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGRtb25ldC1hMzUwMDAtam9iNTgyLTIuanBn.jpg')`,

    //backgroundImage: `url('https://media.istockphoto.com/id/1974249928/vector/summer-foggy-morning-painting.jpg?s=612x612&w=0&k=20&c=NzfSDgAUOakRyv9LiovQqsJF-_z_zfyhDXP8Meh1SE8=')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    
    // 3. Use flexbox to center the login box
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
    // 4. Ensure background stays behind
    zIndex: -1 
  }}>
    <div className="login-container" style={{
      // Your existing styles for the glass effect
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(4px)',
      
      // 5. Ensure the login box sits on top of the background
      position: 'relative',
      zIndex: 1,
      
      // 6. Add some basic styling for the box so it looks good
      padding: '40px',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '400px' // Prevents the box from getting too wide on large screens
    }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <Image
          src="https://www.minds.org.sg/wp-content/uploads/2022/08/Inclusive-Community_CM60-Artwork-X-Large.jpg"
          alt="Mind"
          width={300}
          height={200}
          priority
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
      </div>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>{isRegistering ? "Create Account" : "Welcome"}</h1>
      <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>{isRegistering ? "Fill in your details to join" : "Enter your credentials to login"}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        {isRegistering && (
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            <label style={{ fontSize: "0.9rem", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Select Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "white"
              }}>
              <option value="participant">Participant</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin/Staff</option>
            </select>
          </div>
        )}

        {error && <p style={{ color: "red", fontSize: "0.9rem", marginTop: "10px", textAlign: "center" }}>{error}</p>}

        <button type="submit" style={{ width: "100%", padding: "12px", marginTop: "10px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "white", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <div style={{ marginTop: "20px", fontSize: "0.9rem", textAlign: "center" }}>
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
  </div>
);
}


//  return (
//    <div className="login-container" >
//      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
//        <Image
//           src= "https://www.minds.org.sg/wp-content/uploads/2022/08/Inclusive-Community_CM60-Artwork-X-Large.jpg"
//           alt="Mind"
//           width={300}   
//           height={200}  
//           priority      
//           style={{ borderRadius: "8px", objectFit: "cover" }} 
//         />
//      </div>
//      <h1>{isRegistering ? "Create Account" : "Welcome"}</h1>
//      <p>{isRegistering ? "Fill in your details to join" : "Enter your credentials to login"}</p>


//      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
//        <input
//          type="text"
//          name="username"
//          placeholder="Username"
//          value={formData.username}
//          onChange={handleInputChange}
//          required
//        />
//        <input
//          type="password"
//          name="password"
//          placeholder="Password"
//          value={formData.password}
//          onChange={handleInputChange}
//          required
//        />




//        {isRegistering && (
//          <div style={{ textAlign: "left", marginTop: "10px" }}>
//            <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Select Role:</label>
//            <select
//                name="role"
//                value={formData.role}
//                onChange={handleInputChange} style={{
//                width: "100%",
//                padding: "10px",
//                borderRadius: "8px",
//                border: "1px solid #ccc",
//                marginTop: "5px"
//            }}>
//              <option value="participant">Participant</option>
//              <option value="volunteer">Volunteer</option>
//              <option value="staff">Admin/Staff</option>
//            </select>
//          </div>
//        )}


//        {error && <p style={{ color: "red", fontSize: "0.8rem", marginTop: "10px" }}>{error}</p>}


//        <button type="submit" style={{ width: "100%", marginTop: "20px" }}>
//          {isRegistering ? "Register" : "Login"}
//        </button>
//      </form>


//      <div style={{ marginTop: "20px", fontSize: "0.9rem" }}>
//        {isRegistering ? (
//          <p>
//            Already have an account?{" "}
//            <span
//              onClick={() => setIsRegistering(false)}
//              style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
//            >
//              Login here
//            </span>
//          </p>
//        ) : (
//          <p>
//            Don't have an account?{" "}
//            <span
//              onClick={() => setIsRegistering(true)}
//              style={{ color: "#2563eb", cursor: "pointer", fontWeight: "bold" }}
//            >
//              Register account
//            </span>
//          </p>
//        )}
//      </div>
//    </div>
//  );





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
