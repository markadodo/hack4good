'use client';

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <p>Select your role to login:</p>
      <button onClick={() => router.push("/participant")} aria-label="Login as Participant">Participant</button>
      <button onClick={() => router.push("/volunteer")} aria-label="Login as Volunteer">Volunteer</button>
      <button onClick={() => router.push("/admin")} aria-label="Login as Admin">Admin</button>
    </div>
  );
}
