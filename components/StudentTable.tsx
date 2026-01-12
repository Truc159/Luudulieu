
import React, { useState } from 'react';
import { Student } from '../types';

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <i className="fas fa-list-ul mr-3 text-indigo-600"></i>
          Danh Sách Học Sinh
        </h2>
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Họ và Tên</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Lớp</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Ngày Sinh</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Ngày Nhập</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                </tr>
              ))
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{student.fullName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">
                      {student.className}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(student.dob).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm italic">
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  <i className="fas fa-folder-open text-4xl mb-3 block"></i>
                  Chưa có dữ liệu học sinh nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
