'use client' // ต้องมี เพราะมีการใช้ State และการกดปุ่ม

import { useState } from 'react'

export default function RegisterForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('USER') // ค่าเริ่มต้นคือ USER
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'เกิดข้อผิดพลาด')
            }

            setSuccess('สร้างบัญชีผู้ใช้ใหม่สำเร็จแล้ว!')
            setUsername('')
            setPassword('')
            setRole('USER')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* ส่วนแสดงข้อความแจ้งเตือน */}
            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center bg-green-50 p-2 rounded">{success}</p>}

            <div>
                <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้ (Username)</label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="employee_name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">รหัสผ่าน (Password)</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">บทบาท (Role)</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                    <option value="USER">พนักงาน (Employee)</option>
                    <option value="HR">ฝ่ายบุคคล (HR/Recruiter)</option>
                    <option value="ADMIN">ผู้ดูแลระบบ (Admin)</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
                {loading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชีผู้ใช้'}
            </button>
        </form>
    )
}