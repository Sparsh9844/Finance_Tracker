import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="px-5 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width="100%" color="#9333ea" />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}
