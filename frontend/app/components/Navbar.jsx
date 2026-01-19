'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <nav className="navbar">
      <button onClick={handleLogout}>Logout</button>
      
      <Link href="/profile">Profile</Link>
    </nav>
  );
}
