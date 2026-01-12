
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Student } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  students: Student[];
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#22c55e', '#06b6d4'];

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const [insight, setInsight] = useState('Đang phân tích dữ liệu...');

  const classData = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      counts[s.className] = (counts[s.className] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  const uniqueClasses = classData.length;

  useEffect(() => {
    if (students.length > 0) {
      geminiService.getInsights(students.length, uniqueClasses).then(setInsight);
    } else {
      setInsight('Chưa có dữ liệu để phân tích.');
    }
  }, [students.length, uniqueClasses]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center">
          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-xl mr-4">
            <i className="fas fa-users text-2xl"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Tổng học sinh</p>
            <p className="text-3xl font-bold text-slate-800">{students.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center">
          <div className="bg-purple-100 text-purple-600 p-4 rounded-xl mr-4">
            <i className="fas fa-school text-2xl"></i>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Số lớp học</p>
            <p className="text-3xl font-bold text-slate-800">{uniqueClasses}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white col-span-1 md:col-span-1">
          <div className="flex items-center mb-2">
            <i className="fas fa-lightbulb mr-2 text-yellow-300"></i>
            <span className="font-bold">AI Insight</span>
          </div>
          <p className="text-sm opacity-90 leading-relaxed italic">
            "{insight}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Phân bổ học sinh theo lớp</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tỷ lệ lớp học</h3>
          <div className="h-64 flex justify-center items-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
