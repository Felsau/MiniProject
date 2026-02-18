"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProfileInfoForm } from "@/components/profile/ProfileInfoForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { AccountInfoCard } from "@/components/profile/AccountInfoCard";

interface UserProfile {
  id: string;
  username: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  position: string | null;
  bio: string | null;
  role: string;
}

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.name) return;

    try {
      const res = await fetch("/api/user/me");
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data);
      setFullName(data.fullName || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setPosition(data.position || "");
      setBio(data.bio || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (session?.user?.name) {
      fetchProfile();
    }
  }, [session?.user?.name, fetchProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/user/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, position, bio }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "อัปเดตโปรไฟล์สำเร็จ" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium"
        >
          <ArrowLeft size={20} /> กลับหน้าโปรไฟล์
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">แก้ไขโปรไฟล์</h1>
        <p className="text-gray-500 mt-1">อัปเดตข้อมูลส่วนตัวและรหัสผ่านของคุณ</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProfileInfoForm
          username={profile?.username || ""}
          fullName={fullName}
          email={email}
          phone={phone}
          position={position}
          bio={bio}
          saving={saving}
          message={message}
          onFullNameChange={setFullName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPositionChange={setPosition}
          onBioChange={setBio}
          onSubmit={handleSaveProfile}
        />

        <div className="space-y-8">
          {profile && <ChangePasswordForm userId={profile.id} />}
          {profile && <AccountInfoCard username={profile.username} role={profile.role} />}
        </div>
      </div>
    </div>
  );
}
