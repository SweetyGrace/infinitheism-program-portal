import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';
import Sidebar from './Sidebar';
import ProgramCard from './ProgramCard';

const ProgramsDashboard = () => {
  const [activeTab, setActiveTab] = useState('programs');

  const programs = [
    {
      id: 1,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'On Going' as const
    },
    {
      id: 2,
      title: 'Entrainment',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'On Going' as const
    },
    {
      id: 3,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'On Going' as const
    },
    {
      id: 4,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'Yet to start' as const
    },
    {
      id: 5,
      title: 'HDB - 24',
      description: 'Holistic Development Blueprint - Comprehensive personal growth programs',
      dateRange: '07th May\'25 - 14th Nov\'25',
      status: 'Yet to start' as const
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-bl-3xl rounded-br-3xl">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-light text-gray-700">infinitheism</h1>
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

        {/* Main Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl text-gray-700 mb-2">
                Hi Sam, Here's a quick overview of your created programs.
              </h2>
            </div>
            <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-full px-6">
              Add Program
            </Button>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {programs.map((program) => (
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
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Each program is a seed of change. Plant a new one today
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Add New Program
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsDashboard;
