
import React, { useState } from 'react';

interface CourseRecord {
    id: number;
    title: string;
    instructor: string;
    date: string;
    points: number;
    enrollments: number;
    status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
}

interface PendingVerification {
    id: number;
    employee: string;
    course: string;
    points: number;
    submittedDate: string;
}

const CMEAdmin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'courses' | 'verifications' | 'enrollment'>('courses');

    // Mock Data
    const [courses, setCourses] = useState<CourseRecord[]>([
        { id: 1, title: 'Infection Prevention Protocols', instructor: 'Dr. Sarah Smith', date: '2023-11-10', points: 2, enrollments: 15, status: 'Upcoming' },
        { id: 2, title: 'Advanced ACLS 2023', instructor: 'Resuscitation Council', date: '2023-11-05', points: 5, enrollments: 20, status: 'In Progress' },
        { id: 3, title: 'Paediatric Triage', instructor: 'Nurse Joy', date: '2023-10-20', points: 3, enrollments: 12, status: 'Completed' },
    ]);

    const [pendingVerifications, setPendingVerifications] = useState<PendingVerification[]>([
        { id: 101, employee: 'John Doe', course: 'Global Surgical Symposium', points: 10, submittedDate: '2023-10-24' },
        { id: 102, employee: 'Mary Ann', course: 'Diabetes Care Webinar', points: 2, submittedDate: '2023-10-23' },
    ]);

    const stats = {
        totalCourses: 124,
        pendingReview: 5,
        activeLearning: 42,
        totalPointsIssued: 1540
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="animate-bottom space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Training Catalog</h6>
                    <h3 className="text-2xl font-black text-gray-800 mt-1">{stats.totalCourses}</h3>
                    <p className="text-[10px] text-teal-600 font-bold mt-1">Available Courses</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Review</h6>
                    <h3 className="text-2xl font-black text-orange-500 mt-1">{stats.pendingReview}</h3>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">Submissions</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Learners</h6>
                    <h3 className="text-2xl font-black text-blue-600 mt-1">{stats.activeLearning}</h3>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">Current Enrollment</p>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl shadow-lg text-white flex flex-col justify-center">
                    <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CPD Impact</h6>
                    <h3 className="text-xl font-black text-white mt-1">{stats.totalPointsIssued} Units</h3>
                    <p className="text-[9px] text-slate-500 uppercase mt-1">Total Points Issued</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <div className="flex border-b border-gray-100 bg-gray-50 px-2 pt-2">
                    {[
                        { id: 'courses', label: 'Course Management', icon: 'fa-chalkboard-teacher' },
                        { id: 'verifications', label: 'Credit Verification', icon: 'fa-check-double', badge: stats.pendingReview },
                        { id: 'enrollment', label: 'Enrollment Monitoring', icon: 'fa-user-graduate' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-t-2 border-l border-r rounded-t-xl mx-0.5 flex items-center space-x-2 ${activeTab === tab.id
                                ? 'border-t-teal-600 border-l-gray-200 border-r-gray-200 bg-white text-teal-600 shadow-sm relative -bottom-[1px]'
                                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <i className={`fa ${tab.icon}`}></i>
                            <span>{tab.label}</span>
                            {tab.badge ? <span className="bg-orange-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]">{tab.badge}</span> : null}
                        </button>
                    ))}
                </div>

                <div className="p-8 flex-1">
                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">Internal Training Calendar</h5>
                                    <p className="text-xs text-gray-500">Manage hospital-provided certified medical education.</p>
                                </div>
                                <button className="bg-teal-600 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase shadow hover:bg-teal-700 transition">
                                    <i className="fa fa-plus mr-2"></i> Create Course
                                </button>
                            </div>

                            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-tight">
                                        <tr>
                                            <th className="px-6 py-4">Topic / Course Title</th>
                                            <th className="px-6 py-4">Facilitator</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 text-center">Value</th>
                                            <th className="px-6 py-4 text-center">Enrollment</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-gray-700">
                                        {courses.map(course => (
                                            <tr key={course.id} className="hover:bg-teal-50/30 transition-colors">
                                                <td className="px-6 py-4 font-black uppercase text-gray-800 tracking-tight">{course.title}</td>
                                                <td className="px-6 py-4 font-bold">{course.instructor}</td>
                                                <td className="px-6 py-4 font-mono">{course.date}</td>
                                                <td className="px-6 py-4 text-center"><span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-black">{course.points} Units</span></td>
                                                <td className="px-6 py-4 text-center font-bold">{course.enrollments} Users</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${getStatusBadge(course.status)}`}>{course.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-gray-400 hover:text-blue-600 transition p-1"><i className="fa fa-pencil-alt"></i></button>
                                                    <button className="text-gray-400 hover:text-red-500 transition p-1 ml-2"><i className="fa fa-trash-alt"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'verifications' && (
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">Self-Reported Credit Queue</h5>
                                <p className="text-xs text-gray-500">Review and verify credits earned from external conferences and seminars.</p>
                            </div>

                            <div className="space-y-4">
                                {pendingVerifications.map(v => (
                                    <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center group hover:border-teal-500 transition-all shadow-sm">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg text-gray-400"><i className="fa fa-certificate"></i></div>
                                            <div>
                                                <h6 className="text-sm font-black text-gray-800 uppercase">{v.course}</h6>
                                                <p className="text-xs text-gray-500 font-bold">Staff: <span className="text-blue-600">{v.employee}</span> • Submitted: {v.submittedDate}</p>
                                                <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded mt-2 inline-block uppercase">{v.points} CPD Units Requested</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-gray-50">View Evidence</button>
                                            <button className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-red-100">Reject</button>
                                            <button className="bg-teal-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase shadow-lg hover:bg-teal-700">Approve</button>
                                        </div>
                                    </div>
                                ))}
                                {pendingVerifications.length === 0 && (
                                    <div className="text-center py-20 text-gray-400 italic">No verifications pending</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'enrollment' && (
                        <div className="flex flex-col items-center justify-center h-[400px] text-gray-300">
                            <i className="fa fa-user-graduate text-6xl mb-4 opacity-20"></i>
                            <p className="text-sm font-bold uppercase tracking-widest">Attendance & Enrollment Reports</p>
                            <p className="text-xs mt-1">Monitor staff participation and CPD compliance rates.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CMEAdmin;
