"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Map, 
  Network, 
  FolderOpen, 
  MessageSquare,
  FileText,
  Menu,
  Bell,
  Search,
  LogOut,
  ShieldCheck,
  X,
  User,
  Globe,
  Lock,
  ShieldAlert,
  Home, 
  Users, 
  Settings, 
  FileSearch, 
  HelpCircle, 
  Shield,
  Monitor,
  Activity,
  Radar
} from "lucide-react";
import GlobalSearchBar from "./GlobalSearchBar";
import IntelligenceFeedTicker from "./IntelligenceFeedTicker";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [language, setLanguage] = useState<"EN" | "KA">("EN");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: 'Investigation', href: '/investigation', icon: FileSearch },
    { name: 'Officer Workspace', href: '/officer-workspace', icon: Shield },
    { name: 'Alert Center', href: '/alert-center', icon: ShieldAlert },
    { name: 'Command Wall', href: '/command-wall', icon: Monitor },
    { name: 'Predictive Intelligence', href: '/predictive-intelligence', icon: Radar },
    { name: 'System Health', href: '/system-health', icon: Activity },
    { name: "AI Assistant", href: "/ai-assistant", icon: MessageSquare },
    { name: "Crime Map", href: "/crime-map", icon: Map },
    { name: "Network Analysis", href: "/knowledge-graph", icon: Network },
    { name: "Timeline Intelligence", href: "/timeline-intelligence", icon: FolderOpen },
    { name: "Investigation Board", href: "/investigation-board", icon: FolderOpen },
    { name: "FIR Workspace", href: "/fir-workspace", icon: FileText },
    { name: "Executive Intelligence", href: "/executive-dashboard", icon: ShieldCheck },
    { name: "Intelligence Reports", href: "/reports", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-[#061224] text-slate-100 font-sans antialiased selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-[#061224]/80 backdrop-blur-md transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Crest SVG */}
            <div className="flex-shrink-0 bg-gradient-to-tr from-amber-500 to-yellow-300 p-1.5 rounded-lg shadow-lg shadow-amber-500/20">
              <svg className="h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">KCIA Core</span>
                <span className="text-[10px] text-amber-500 font-medium tracking-widest">KSP INTEL</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {navItems?.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border-l-2 border-blue-500 text-blue-400 shadow-md shadow-blue-900/10" 
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                }`} />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout footer */}
        <div className="border-t border-slate-800 p-4">
          {isSidebarOpen ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950 border border-blue-800 text-blue-400">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate">{user?.first_name} {user?.last_name}</span>
                  <span className="text-[10px] text-slate-400 truncate">Badge: {user?.badge_number}</span>
                </div>
              </div>
              
              <button 
                onClick={() => logout()}
                className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-red-950/30 hover:text-red-400 border border-slate-800 hover:border-red-900/50 text-xs font-semibold text-slate-300 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Secure Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => logout()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/40 hover:bg-red-950/30 hover:text-red-400 border border-slate-800 hover:border-red-900/50 text-slate-400 transition-all"
                title="Secure Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
        isSidebarOpen ? "md:pl-64" : "md:pl-20"
      }`}>
        
        <IntelligenceFeedTicker />

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-6 border-b border-slate-800/60 bg-[#061224]/85 backdrop-blur-md">
          {/* Left info */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[10px] font-semibold text-slate-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>SCRB SECURE PORTAL</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-blue-950/30 border border-blue-900/40 px-3 py-1 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
              <Lock className="h-3 w-3" />
              <span>ROLE: {user?.role || "OFFICER"}</span>
            </div>
          </div>

          <GlobalSearchBar />

          {/* Right actions */}
          <div className="flex items-center gap-4">
            
            {/* Language Toggle */}
            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-semibold">
              <button 
                onClick={() => setLanguage("EN")}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === "EN" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage("KA")}
                className={`px-2 py-1 rounded-md transition-all ${
                  language === "KA" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors">
              <Bell className="h-4.5 w-4.5" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-[#061224]">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* Security Mark */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase">
                CONFIDENTIAL
              </span>
              <span className="text-[8px] text-slate-500 font-mono mt-0.5">IP: 10.168.4.12</span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
