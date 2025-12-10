"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Receipt,
    BarChart3,
    Building2,
    Settings,
    HelpCircle,
    GraduationCap,
    X
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
}

function NavLink({ href, icon, label, isActive }: NavLinkProps) {
    return (
        <Link href={href} className={`nav-link ${isActive ? 'active' : ''}`}>
            {icon}
            <span>{label}</span>
        </Link>
    );
}

import { InstallPrompt } from "@/components/ui/install-prompt"; // Add import

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const mainNav = [
        { href: "/", icon: <LayoutDashboard />, label: "Dashboard" },
        { href: "/admin", icon: <Receipt />, label: "Admin" },
        { href: "/developer", icon: <BarChart3 />, label: "Developer" },
        { href: "/departments", icon: <Building2 />, label: "Departments" },
    ];

    const footerNav = [
        { href: "/settings", icon: <Settings />, label: "Settings" },
        { href: "/support", icon: <HelpCircle />, label: "Support" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-[260px] transition-transform duration-300`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <GraduationCap size={22} />
                    </div>
                    <span className="sidebar-brand-text">Fund Tracker</span>
                    {/* Mobile Close Button */}
                    <button className="ml-auto lg:hidden text-gray-500" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {mainNav.map((item) => (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={pathname === item.href}
                        />
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {footerNav.map((item) => (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={pathname === item.href}
                        />
                    ))}
                    <div style={{ marginTop: '12px', padding: '0 12px' }}>
                        <ThemeToggle />
                    </div>
                    <div style={{ marginTop: '8px', padding: '0 12px' }}>
                        <InstallPrompt />
                    </div>
                </div>
            </aside>
        </>
    );
}
