
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

interface StudentFormProps {
  onSubmit: (data: { fullName: string; className: string; dob: string }) => Promise<void>;
  isLoading: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    className: '',
    dob: ''
  });
  const [isFormatting, setIsFormatting] = useState(false);

  const handleFormatName = async () => {
    if (!formData.fullName.trim() || formData.fullName.length < 2) return;
    setIsFormatting(true);
    const formatted = await geminiService.formatName(formData.fullName);
    setFormData(prev => ({ ...prev, fullName: formatted }));
    setIsFormatting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.className || !formData.dob) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }
    await onSubmit(formData);
    setFormData({ fullName: '', className: '', dob: '' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-10 text-white relative">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              Sinh viên & Học sinh
            </span>
            <h2 className="text-3xl font-black flex items-center tracking-tight">
              Ghi Danh Dữ Liệu
            </h2>
            <p className="text-indigo-100 text-sm mt-2 font-medium opacity-90">Tự động đồng bộ hóa với Google Sheets thời gian thực</p>
          </div>
          <i className="fas fa-file-signature absolute right-[-10px] top-[-10px] text-[10rem] text-white/5 -rotate-12 pointer-events-none"></i>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Full Name Field */}
          <div className="space-y-3">
            <label className="text-sm font-extrabold text-slate-700 flex justify-between items-center ml-1">
              HỌ VÀ TÊN HỌC SINH
              {isFormatting ? (
                <span className="text-[10px] text-indigo-500 animate-pulse font-bold">AI ĐANG XỬ LÝ...</span>
              ) : (
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Chuẩn hóa tự động</span>
              )}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <i className="fas fa-user"></i>
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                onBlur={handleFormatName}
                className="w-full pl-11 pr-14 py-4.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 text-slate-800 font-semibold placeholder:text-slate-300"
                placeholder="Ví dụ: nguyễn văn minh"
                required
              />
              <button
                type="button"
                onClick={handleFormatName}
                disabled={isFormatting || formData.fullName.length < 2}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all disabled:opacity-30"
                title="Làm đẹp tên bằng AI"
              >
                <i className={`fas ${isFormatting ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Class Name Field */}
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-slate-700 ml-1">LỚP / KHỐI</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <i className="fas fa-school"></i>
                </div>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value.toUpperCase() })}
                  className="w-full pl-11 pr-4 py-4.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 text-slate-800 font-bold"
                  placeholder="VD: 12A1"
                  required
                />
              </div>
            </div>

            {/* DOB Field */}
            <div className="space-y-3">
              <label className="text-sm font-extrabold text-slate-700 ml-1">NGÀY SINH</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full pl-11 pr-4 py-4.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all duration-300 text-slate-800 font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isFormatting}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch fa-spin text-2xl"></i>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  <span>GỬI DỮ LIỆU LÊN HỆ THỐNG</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex items-center justify-center space-x-6 text-slate-400">
        <div className="flex items-center space-x-2">
          <i className="fas fa-shield-halved text-xs"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Bảo mật SSL</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
        <div className="flex items-center space-x-2">
          <i className="fas fa-bolt text-xs text-yellow-500"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Xử lý tức thì</span>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
