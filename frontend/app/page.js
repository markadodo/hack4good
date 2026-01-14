"use client";
// import Image from "next/image";
// import styles from "./page.module.css"; 
import AdminCalendar from './AdminCalendar'; // Adjust path if needed


export default function AdminHome() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navigation Bar Placeholder */}
      <nav style={{ padding: '20px', background: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>MINDS STEP Admin</h1>
        <button style={{ background: '#ef4444', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px' }}>
          Logout
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Statistics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <StatCard title="Total Events" value="12" color="#3b82f6" />
          <StatCard title="Active Volunteers" value="45" color="#22c55e" />
          <StatCard title="Pending Approvals" value="3" color="#f59e0b" />
        </div>

        {/* The Main Calendar Component */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <AdminCalendar />
        </div>
      </div>
    </main>
  );
}

// Simple internal component for the Dashboard feel
function StatCard({ title, value, color }) {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', borderLeft: `5px solid ${color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h4 style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{title}</h4>
      <p style={{ margin: '5px 0 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{value}</p>
    </div>
  );
}


// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className={styles.intro}>
//           <h1>To get started, edit the page.js file.</h1>
//           <p>
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className={styles.secondary}
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
