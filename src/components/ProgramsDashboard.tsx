
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProgramCard from './ProgramCard';
import './ProgramsDashboard.css';

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
    <div className="programs-dashboard">
      <div className="programs-dashboard-sidebar">
        <div className="programs-dashboard-sidebar-fixed">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
      
      <div className="programs-dashboard-main">
        <div className="programs-dashboard-header">
          <div className="programs-dashboard-header-content">
            <div className="programs-dashboard-header-logo">
              <img src="/lovable-uploads/af00c1ef-8d89-4eea-83f4-48c40d2bad90.png" alt="infinitheism" />
            </div>
            
            <div className="programs-dashboard-header-dots">
              <div className="programs-dashboard-header-dot"></div>
              <div className="programs-dashboard-header-dot"></div>
              <div className="programs-dashboard-header-dot"></div>
            </div>
            
            <div className="programs-dashboard-header-actions">
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <div className="programs-dashboard-avatar">
                <User size={20} color="white" />
              </div>
            </div>
          </div>
        </div>

        <div className="programs-dashboard-content">
          <div className="programs-dashboard-title-section">
            <div>
              <h2 className="programs-dashboard-title">
                Hi Sam, Here's a quick overview of your created programs.
              </h2>
            </div>
            <button 
              onClick={handleAddProgram}
              className="programs-dashboard-add-button"
            >
              Add Program
            </button>
          </div>

          <div className="programs-dashboard-grid">
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

          <div className="programs-dashboard-footer">
            <p className="programs-dashboard-footer-text">
              Each program is a seed of change. Plant a new one today
            </p>
            <button 
              onClick={handleAddProgram}
              className="programs-dashboard-footer-link"
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
