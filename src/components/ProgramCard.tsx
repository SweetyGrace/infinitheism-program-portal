
import { Card } from '@/components/ui/card';

interface ProgramCardProps {
  title: string;
  description: string;
  dateRange: string;
  status: 'On Going' | 'Yet to start';
  icon?: string;
}

const ProgramCard = ({ title, description, dateRange, status }: ProgramCardProps) => {
  const statusStyles = {
    'On Going': 'bg-green-100 text-green-700 border-green-200',
    'Yet to start': 'bg-orange-100 text-orange-700 border-orange-200'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 text-orange-600">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {description}
      </p>
      
      <p className="text-xs text-gray-500 font-medium">{dateRange}</p>
    </Card>
  );
};

export default ProgramCard;
