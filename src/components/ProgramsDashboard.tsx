import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProgramCard from './ProgramCard';

const ProgramsDashboard = () => {
  const activeTab = 'programs';
  const setActiveTab = () => {};
  const navigate = useNavigate();
  
  const programs = [
    {
      id: 1,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'On Going' as const
    }, {
      id: 2,
      title: 'Entrainment',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'On Going' as const
    }, {
      id: 3,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'On Going' as const
    }, {
      id: 4,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'Yet to start' as const
    }, {
      id: 5,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'Yet to start' as const
    }
  ];

  const handleAddProgram = () => {
    navigate('/choose-program');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sticky Sidebar with dedicated space */}
      <div className="w-20 flex-shrink-0">
        <div className="fixed left-0 top-0 h-full">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 relative">
        {/* Full width header that overlaps sidebar */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 rounded-bl-3xl rounded-br-3xl shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center">
              <img src="/lovable-uploads/af00c1ef-8d89-4eea-83f4-48c40d2bad90.png" alt="infinitheism" className="h-8" />
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell size={20} className="text-gray-600" />
              </Button>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with sufficient top padding to account for fixed header */}
        <div className="pt-24 p-5 px-8 py-5">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl text-gray-700 mb-2">
                Hi Sam, Here's a quick overview of your created programs.
              </h2>
            </div>
            <Button 
              onClick={handleAddProgram}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-full px-6"
            >
              Add Program
            </Button>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {programs.map(program => (
              <ProgramCard
                key={program.id}
                title={program.title}
                description={program.description}
                dateRange={program.dateRange}
                status={program.status}
              />
            ))}
          </div>

          {/* Bottom Message */}
          <div className="text-left">
            <p className="text-gray-600 inline-block mr-2">
              Each program is a seed of change. Plant a new one today
            </p>
            <button 
              onClick={handleAddProgram}
              className="text-blue-600 hover:text-blue-700 font-medium inline-block"
            >
              Add New Program
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsDashboard;
