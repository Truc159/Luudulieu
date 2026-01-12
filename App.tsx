
import React, { useState, useEffect, useCallback } from 'react';
import { Tab, Student } from './types';
import { sheetService } from './services/sheetService';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import Dashboard from './components/Dashboard';
import SetupGuide from './components/SetupGuide';

// Updated with the new URL provided by the user
const DEFAULT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzQo-8YVA9T8z7MRp-zt7pnAlCgn2kEh3bVL53tAYmJ_uT4DvqyDQguCnUboRG6cxHhIg/exec';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ADD);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return localStorage.getItem('sheet_webapp_url') || DEFAULT_WEBAPP_URL;
  });

  const loadData = useCallback(async () => {
    if (!webAppUrl) return;
    setIsLoading(true);
    try {
      const data = await sheetService.fetchStudents(webAppUrl);
      const sortedData = [...data].sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setStudents(sortedData);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [webAppUrl]);

  useEffect(() => {
    loadData();
    if (!localStorage.getItem('sheet_webapp_url')) {
      localStorage.setItem('sheet_webapp_url', DEFAULT_WEBAPP_URL);
    }
  }, [loadData]);

  const handleAddStudent = async (data: { fullName: string; className: string; dob: string }) => {
    if (!webAppUrl) {
      alert("Vui lòng cấu hình Google Sheets URL trước!");
      setActiveTab(Tab.SETUP);
      return;
    }

    setIsLoading(true);
    try {
      const success = await sheetService.addStudent(webAppUrl, data);
      if (success) {
        const newStudent: Student = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        setStudents(prev => [newStudent, ...prev]);
        alert("✅ Đã lưu thông tin học sinh " + data.fullName + " thành công!");
        setTimeout(loadData, 1000);
      }
    } catch (error) {
      alert("Lỗi khi kết nối với máy chủ Google!");
    } finally {
      setIsLoading(false);
    }
  };

  const saveUrl = (url: string) => {
    setWebAppUrl(url);
    localStorage.setItem('sheet_webapp_url', url);
    alert("Đã cập nhật cấu hình kết nối!");
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pb-20 md:pb-0 font-sans">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white mr-3.5 shadow-lg shadow-indigo-100">
                <i className="fas fa-user-graduate text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                  EduCollect <span className="text-indigo-600">Pro</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hệ thống thu thập dữ liệu</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <NavButton active={activeTab === Tab.ADD} onClick={() => setActiveTab(Tab.ADD)} icon="fa-plus-circle" label="Nhập Liệu" />
              <NavButton active={activeTab === Tab.LIST} onClick={() => setActiveTab(Tab.LIST)} icon="fa-list-check" label="Danh Sách" />
              <NavButton active={activeTab === Tab.DASHBOARD} onClick={() => setActiveTab(Tab.DASHBOARD)} icon="fa-chart-simple" label="Thống Kê" />
              <NavButton active={activeTab === Tab.SETUP} onClick={() => setActiveTab(Tab.SETUP)} icon="fa-sliders" label="Cấu Hình" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl w-full mx-auto p-4 md:p-10">
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === Tab.ADD && <StudentForm onSubmit={handleAddStudent} isLoading={isLoading} />}
          {activeTab === Tab.LIST && <StudentTable students={students} isLoading={isLoading} />}
          {activeTab === Tab.DASHBOARD && <Dashboard students={students} />}
          {activeTab === Tab.SETUP && <SetupGuide currentUrl={webAppUrl} onSave={saveUrl} />}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 h-18 flex justify-around items-center z-50 px-4 pb-safe shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <MobileNavButton active={activeTab === Tab.ADD} onClick={() => setActiveTab(Tab.ADD)} icon="fa-plus-circle" label="Thêm" />
        <MobileNavButton active={activeTab === Tab.LIST} onClick={() => setActiveTab(Tab.LIST)} icon="fa-table-list" label="Dữ liệu" />
        <MobileNavButton active={activeTab === Tab.DASHBOARD} onClick={() => setActiveTab(Tab.DASHBOARD)} icon="fa-chart-pie" label="Số liệu" />
        <MobileNavButton active={activeTab === Tab.SETUP} onClick={() => setActiveTab(Tab.SETUP)} icon="fa-cog" label="Cài đặt" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-50' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
    }`}
  >
    <i className={`fas ${icon} mr-2.5`}></i> {label}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-3 transition-all ${
      active ? 'text-indigo-600' : 'text-slate-400'
    }`}
  >
    <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>
      <i className={`fas ${icon} text-xl`}></i>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
  </button>
);

export default App;
