import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as { role?: string })?.role;
  const username = session.user?.name as string;

  if (userRole === "USER") {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) redirect("/");

    const [applications, activeJobCount, totalApps, pendingApps, acceptedApps, rejectedApps] = await Promise.all([
      prisma.application.findMany({
        where: { userId: user.id },
        include: { job: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.job.count({ where: { isActive: true } }),
      prisma.application.count({ where: { userId: user.id } }),
      prisma.application.count({ where: { userId: user.id, status: "PENDING" } }),
      prisma.application.count({ where: { userId: user.id, status: "ACCEPTED" } }),
      prisma.application.count({ where: { userId: user.id, status: "REJECTED" } }),
    ]);

    return (
      <UserDashboard
        user={user}
        applications={applications}
        activeJobCount={activeJobCount}
        totalApps={totalApps}
        pendingApps={pendingApps}
        acceptedApps={acceptedApps}
        rejectedApps={rejectedApps}
      />
    );
  }

  const [totalJobs, activeJobs, totalApplications, pendingApplications, acceptedApplications, recentApplications] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.application.findMany({
      include: {
        job: { select: { title: true } },
        user: { select: { fullName: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <AdminDashboard
      totalJobs={totalJobs}
      activeJobs={activeJobs}
      totalApplications={totalApplications}
      pendingApplications={pendingApplications}
      acceptedApplications={acceptedApplications}
      recentApplications={recentApplications}
    />
  );
}
