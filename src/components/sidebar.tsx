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
    GraduationCap
} from "lucide-react";

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

export function Sidebar() {
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
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    <GraduationCap size={22} />
                </div>
                <span className="sidebar-brand-text">Fund Tracker</span>
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
            </div>
        </aside>
    );
}
