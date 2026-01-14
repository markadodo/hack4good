import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/">Logout</Link>
      {/* <Link href="/participant">Participant</Link>
      <Link href="/volunteer">Volunteer</Link>
      <Link href="/admin">Admin</Link> */}
      
      <Link href="/profile">Profile</Link>
    </nav>
  );
}
