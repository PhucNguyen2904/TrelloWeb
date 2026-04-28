import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Kanban, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogoutClean } from "@/lib/logout";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    handleLogoutClean();
  };

  return (
    <nav className="h-16 border-b border-white/10 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors">
        <Kanban className="w-6 h-6 text-indigo-500" />
        <span className="font-bold text-xl tracking-tight">TrelloClone</span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
          <User className="w-4 h-4 text-gray-500" />
          <span>{user?.email}</span>
          {user?.role?.name === "admin" && (
            <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Admin
            </span>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
