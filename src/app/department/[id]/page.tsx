import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Users, Target, TrendingUp, Award, Trophy, Crown, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { AutoRefresh } from "@/components/ui/auto-refresh";

interface DepartmentPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = "force-dynamic";

async function getDepartment(id: string) {
    const department = await prisma.department.findUnique({
        where: { id },
        include: {
            students: {
                include: {
                    department: true,
                },
                orderBy: {
                    amountPaid: "desc",
                },
            },
        },
    });

    if (!department) return null;

    const studentCount = department.students.length;
    const target = studentCount * 5000; // ₹5000 per student
    const totalCollected = department.students.reduce((acc: number, s: { amountPaid: number }) => acc + s.amountPaid, 0);

    return {
        ...department,
        totalCollected,
        target: target > 0 ? target : 5000,
    };
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function getClubInfo(percentage: number) {
    if (percentage >= 100) {
        return {
            name: "Centenary Club",
            icon: Crown,
            color: "centenary",
            description: "🎉 Goal Achieved! Outstanding achievement!"
        };
    } else if (percentage >= 75) {
        return {
            name: "Platinum Club",
            icon: Trophy,
            color: "platinum",
            description: "Almost there! Just a bit more to reach the goal."
        };
    } else if (percentage >= 50) {
        return {
            name: "Golden Club",
            icon: Star,
            color: "golden",
            description: "Halfway milestone achieved! Keep going!"
        };
    } else if (percentage >= 25) {
        return {
            name: "Silver Club",
            icon: Award,
            color: "silver",
            description: "Great start! Building momentum."
        };
    } else {
        return {
            name: "Getting Started",
            icon: Target,
            color: "base",
            description: "Every contribution counts. Let's reach 25%!"
        };
    }
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
    const { id } = await params;
    const department = await getDepartment(id);

    if (!department) {
        notFound();
    }

    const percentage = department.target > 0 ? Math.min((department.totalCollected / department.target) * 100, 100) : 0;
    const participationCount = department.students.filter(s => s.amountPaid > 0).length;
    const participationRate = department.students.length > 0 ? (participationCount / department.students.length) * 100 : 0;
    const remaining = Math.max(department.target - department.totalCollected, 0);

    const club = getClubInfo(percentage);
    const ClubIcon = club.icon;



    // ...

    return (
        <main className="department-page">
            <AutoRefresh intervalMs={8000} />
            <div className="department-container">
                {/* Back Button */}
                <Link href="/" className="back-link">
                    <ArrowLeft size={18} />
                    <span>Back to Dashboard</span>
                </Link>

                {/* Club Badge Card */}
                <div className={`club-banner ${club.color}`}>
                    <div className="club-icon-wrapper">
                        <ClubIcon size={32} />
                    </div>
                    <div className="club-info">
                        <h3 className="club-name">{club.name}</h3>
                        <p className="club-description">{club.description}</p>
                    </div>
                    <div className="club-percentage">{percentage.toFixed(0)}%</div>
                </div>

                {/* Hero Section */}
                <div className="department-hero">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Users size={14} />
                            <span>{department.students.length} Students</span>
                        </div>
                        <h1 className="hero-title">{department.name}</h1>
                        <p className="hero-subtitle">
                            Target: {formatCurrency(department.target)} (₹5,000 × {department.students.length} students)
                        </p>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-amount">{formatCurrency(department.totalCollected)}</div>
                        <div className="hero-label">Collected</div>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="progress-section">
                    <div className="progress-header">
                        <span className="progress-percentage">{percentage.toFixed(0)}% Complete</span>
                        <span className="progress-remaining">{formatCurrency(remaining)} remaining</span>
                    </div>
                    <div className={`progress-bar-container ${club.color}`}>
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${percentage}%` }}
                        />
                        <div className="progress-milestone" style={{ left: '25%' }} data-label="Silver" />
                        <div className="progress-milestone" style={{ left: '50%' }} data-label="Golden" />
                        <div className="progress-milestone" style={{ left: '75%' }} data-label="Platinum" />
                    </div>
                    <div className="club-markers">
                        <span className={percentage >= 25 ? 'active' : ''}>Silver 25%</span>
                        <span className={percentage >= 50 ? 'active' : ''}>Golden 50%</span>
                        <span className={percentage >= 75 ? 'active' : ''}>Platinum 75%</span>
                        <span className={percentage >= 100 ? 'active' : ''}>Centenary 100%</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <TrendingUp size={20} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{participationRate.toFixed(0)}%</span>
                            <span className="stat-label">Participation Rate</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <Award size={20} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{participationCount}</span>
                            <span className="stat-label">Contributors</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">
                            <Target size={20} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{formatCurrency(5000)}</span>
                            <span className="stat-label">Per Student Target</span>
                        </div>
                    </div>
                </div>

                {/* Students List */}
                <div className="students-section">
                    <h2 className="section-title">Students ({department.students.length})</h2>
                    <div className="students-list">
                        {department.students.map((student, index) => {
                            const studentProgress = Math.min((student.amountPaid / 5000) * 100, 100);
                            const status = student.amountPaid >= 5000 ? 'completed' : student.amountPaid > 0 ? 'partial' : 'pending';

                            return (
                                <div key={student.id} className="student-row">
                                    <div className="student-rank">{index + 1}</div>
                                    <div className="student-avatar">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="student-info">
                                        <span className="student-name">{student.name}</span>
                                        <span className="text-xs text-muted-foreground">{student.admissionNumber}</span>
                                        <div className="student-progress-bar">
                                            <div
                                                className="student-progress-fill"
                                                style={{ width: `${studentProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="student-amount-section">
                                        <span className="student-amount">{formatCurrency(student.amountPaid)}</span>
                                        <span className={`student-status ${status}`}>
                                            {status === 'completed' ? '✓ Complete' : status === 'partial' ? 'Partial' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {department.students.length === 0 && (
                            <div className="empty-state">
                                <Users size={48} />
                                <p>No students in this department yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
