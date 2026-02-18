"use client";

import { useEffect, useState, use } from "react";
import {
    User, Mail, Calendar, ArrowLeft, Loader2,
    Eye,
    ChevronDown,
    FileText
} from "lucide-react"; // ❌ ลบ CheckCircle, XCircle ออกเพราะไม่ได้ใช้แล้ว
import Link from "next/link";

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    INTERVIEW: "bg-blue-100 text-blue-700 border-blue-200",
    OFFER: "bg-purple-100 text-purple-700 border-purple-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    HIRED: "bg-green-100 text-green-700 border-green-200",
};

const statusLabels: Record<string, string> = {
    PENDING: "รอพิจารณา",
    INTERVIEW: "นัดสัมภาษณ์",
    OFFER: "ยื่นข้อเสนอ",
    REJECTED: "ไม่ผ่าน",
    HIRED: "รับเข้าทำงาน",
};

export default function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const fetchApplicants = () => {
        fetch(`/api/job/${id}/applicants`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchApplicants();
    }, [id]);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        setUpdatingId(appId);
        setOpenMenuId(null);
        try {
            const res = await fetch("/api/application", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId: appId, status: newStatus }),
            });

            if (res.ok) {
                setData((prev: any) => ({
                    ...prev,
                    applications: prev.applications.map((app: any) =>
                        app.id === appId ? { ...app, status: newStatus } : app
                    )
                }));
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        } finally {
            setUpdatingId(null);
        }
    };

    const toggleMenu = (appId: string) => {
        if (openMenuId === appId) {
            setOpenMenuId(null);
        } else {
            setOpenMenuId(appId);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500 flex justify-center"><Loader2 className="animate-spin mr-2" /> กำลังโหลดรายชื่อ...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8" onClick={() => setOpenMenuId(null)}>
            <div className="max-w-6xl mx-auto" onClick={(e) => e.stopPropagation()}>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <Link href="/recruitment" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-2 transition text-sm">
                            <ArrowLeft size={16} /> กลับไปหน้าจัดการงาน
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">{data?.title || "ไม่พบชื่อตำแหน่ง"}</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            ผู้สมัครทั้งหมด <span className="font-semibold text-blue-600">{data?.applications?.length || 0}</span> คน
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
                    <div className="overflow-x-visible">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">ผู้สมัคร</th>
                                    <th className="px-6 py-4 font-semibold">ข้อมูลติดต่อ</th>
                                    <th className="px-6 py-4 font-semibold">วันที่สมัคร</th>
                                    <th className="px-6 py-4 font-semibold text-center">สถานะ</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.applications?.map((app: any) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition relative">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link href={`/profile/${app.user.id}`} className="shrink-0">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm hover:ring-2 hover:ring-blue-400 transition">
                                                        {app.user.fullName?.[0] || app.user.username?.[0] || "U"}
                                                    </div>
                                                </Link>
                                                <div>
                                                    <Link href={`/profile/${app.user.id}`} className="font-medium text-gray-900 hover:text-blue-600 hover:underline transition">
                                                        {app.user.fullName || app.user.username}
                                                    </Link>
                                                    <div className="text-xs text-gray-400">ID: {app.user.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail size={14} className="text-gray-400" /> {app.user.email}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(app.createdAt).toLocaleDateString("th-TH", { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[app.status] || "bg-gray-100 text-gray-600"}`}>
                                                {statusLabels[app.status] || app.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right relative">
                                            <div className="flex items-center justify-end gap-2">
                                                {updatingId === app.id ? (
                                                    <Loader2 size={18} className="animate-spin text-gray-400" />
                                                ) : (
                                                    <>
                                                        {/* ปุ่มดูโปรไฟล์ (Eye) */}
                                                        <Link
                                                            href={`/profile/${app.user.id}`}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                            title="ดูรายละเอียดโปรไฟล์"
                                                        >
                                                            <Eye size={18} />
                                                        </Link>

                                                        {/* ปุ่มดูเรซูเม่ (FileText) */}
                                                        {app.resumeUrl ? (
                                                            <Link
                                                                href={app.resumeUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                                title="เปิดไฟล์เรซูเม่"
                                                            >
                                                                <FileText size={18} />
                                                            </Link>
                                                        ) : (
                                                            <div className="p-1.5 text-gray-200 cursor-not-allowed" title="ไม่แนบเรซูเม่">
                                                                <FileText size={18} />
                                                            </div>
                                                        )}

                                                        <div className="w-px h-4 bg-gray-200 mx-1"></div>

                                                        {/* ✅ เอา Quick Actions (Check/Cross) ออกไปแล้ว */}

                                                        {/* Dropdown Menu */}
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleMenu(app.id);
                                                                }}
                                                                className={`flex items-center gap-1 px-2 py-1 rounded transition text-xs font-medium ${openMenuId === app.id
                                                                        ? 'bg-gray-100 text-gray-900'
                                                                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                <ChevronDown size={14} className={`transition-transform duration-200 ${openMenuId === app.id ? 'rotate-180' : ''}`} />
                                                            </button>

                                                            {openMenuId === app.id && (
                                                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
                                                                    <div className="py-1">
                                                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">เปลี่ยนสถานะเป็น</div>
                                                                        {Object.keys(statusLabels).map((statusKey) => (
                                                                            <button
                                                                                key={statusKey}
                                                                                onClick={() => handleStatusChange(app.id, statusKey)}
                                                                                disabled={app.status === statusKey}
                                                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${app.status === statusKey ? 'text-gray-400 cursor-default' : 'text-gray-700'}`}
                                                                            >
                                                                                <span className={`w-2 h-2 rounded-full ${statusColors[statusKey].split(" ")[0].replace("bg-", "bg-opacity-100 bg-")}`}></span>
                                                                                {statusLabels[statusKey]}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {data?.applications?.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <User size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">ยังไม่มีผู้สมัคร</h3>
                            <p className="text-gray-500 mt-1">เมื่อมีคนสมัคร รายชื่อจะปรากฏที่นี่</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}