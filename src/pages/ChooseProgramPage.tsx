import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User, Sparkles, Edit, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ChooseProgramPage = () => {
  const activeTab = 'programs';
  const setActiveTab = () => {};
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const handleProgramClick = (programId: string) => {
    if (programId === 'hdb') {
      navigate('/add-program/hdb');
    }
    // Add other program navigation logic here
  };

  const programTypes = [
    {
      id: 'hdb',
      title: 'HDB/ MSD',
      image: '/lovable-uploads/5a3f94b4-d871-49bd-92e8-51e329451742.png',
      bgColor: 'bg-red-600',
      textColor: 'text-white'
    },
    {
      id: 'entrainment',
      title: 'Entrainment',
      image: '/lovable-uploads/5a3f94b4-d871-49bd-92e8-51e329451742.png',
      bgColor: 'bg-blue-200',
      textColor: 'text-gray-800'
    },
    {
      id: 'tat',
      title: 'TAT Online/ Offline',
      image: '/lovable-uploads/5a3f94b4-d871-49bd-92e8-51e329451742.png',
      bgColor: 'bg-amber-900',
      textColor: 'text-white'
    }
  ];

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
        <div className="pt-24 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-12">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleBackClick}
                className="mr-4 hover:bg-gray-100"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Button>
              <h1 className="text-2xl text-gray-700">
                Choose the foundation of spiritual program
              </h1>
            </div>

            {/* Program Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {programTypes.map((program) => (
                <div 
                  key={program.id}
                  onClick={() => handleProgramClick(program.id)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className={`${program.bgColor} rounded-t-xl h-48 flex items-center justify-center relative overflow-hidden`}>
                    <div className={`text-center ${program.textColor}`}>
                      {program.id === 'hdb' && (
                        <>
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 bg-red-600 rounded-full"></div>
                          </div>
                          <div className="font-bold text-xl">HDB/MSD</div>
                          <div className="text-sm">2024-25</div>
                        </>
                      )}
                      {program.id === 'entrainment' && (
                        <div className="w-full h-full bg-gradient-to-b from-blue-200 to-purple-300 flex items-center justify-center">
                          <div className="w-20 h-20 bg-black rounded-full opacity-30"></div>
                        </div>
                      )}
                      {program.id === 'tat' && (
                        <>
                          <div className="flex justify-center mb-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mx-0.5"></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full mx-0.5"></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full mx-0.5"></div>
                          </div>
                          <div className="font-bold text-3xl">TAT</div>
                          <div className="text-sm"><span className="text-red-500">THIS</span> AND <span className="text-red-500">THAT</span></div>
                          <div className="text-xs mt-1">Breakthrough to Holistic Abundance</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-800">{program.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Or Divider */}
            <div className="text-center mb-16">
              <span className="text-gray-500 text-lg">or</span>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={32} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Custom program based on</h3>
                <p className="text-gray-600">the parameters set</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Edit size={32} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Create the Program from scratch</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseProgramPage;
