
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SubProgramCard from '../SubProgramCard';
import styles from './index.module.css';

interface SubProgram {
  id: string;
  title: string;
  banner?: File | null;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  modeOfProgram: 'online' | 'offline' | 'hybrid';
  venueAddress: string[];
  customVenue: string;
  isTravelRequired?: 'yes' | 'no';
  isResidential?: 'yes' | 'no';
  isPaymentRequired: 'yes' | 'no';
  currency: string;
  programFee: string;
  isHighlighted?: boolean;
  highlightPhase?: 'fade-in' | 'visible' | 'fade-out';
  showCustomVenue?: boolean;
}

interface SubProgramsSectionProps {
  subPrograms: SubProgram[];
  uploadedBanner: File | null;
  programDescription: string;
  selectedCurrency: string;
  isPaymentRequired: 'yes' | 'no';
  modeOfProgram: 'online' | 'offline' | 'hybrid';
  startDate?: Date;
  endDate?: Date;
  currencyOptions: Array<{ value: string; label: string; symbol: string }>;
  venueOptions: string[];
  onAddSubProgram: () => void;
  onSubProgramChange: (subProgramId: string, field: keyof SubProgram, value: any) => void;
  onSubProgramVenueChange: (subProgramId: string, venues: string[]) => void;
  onSubProgramBannerUpload: (subProgramId: string, file: File | null) => void;
  onDeleteSubProgram: (subProgramId: string) => void;
  getCurrencySymbol: (currency: string) => string;
  isDateWithinProgramRange: (date: Date) => boolean;
}

const SubProgramsSection = ({
  subPrograms,
  uploadedBanner,
  programDescription,
  selectedCurrency,
  isPaymentRequired,
  modeOfProgram,
  startDate,
  endDate,
  currencyOptions,
  venueOptions,
  onAddSubProgram,
  onSubProgramChange,
  onSubProgramVenueChange,
  onSubProgramBannerUpload,
  onDeleteSubProgram,
  getCurrencySymbol,
  isDateWithinProgramRange
}: SubProgramsSectionProps) => {
  const subProgramRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  return (
    <>
      {/* Sub-Program Configuration Section */}
      <div className={styles.configurationSection}>
        <div className={styles.configurationContent}>
          <h2 className={styles.configurationTitle}>Sub-Program Configuration</h2>
          <p className={styles.configurationDescription}>
            Configure individual sub-programs with their specific schedules, delivery modes, and requirements. 
            Each sub-program inherits settings from the main program but can be customized as needed.
          </p>
        </div>
      </div>

      {/* Sub-Program Details Section */}
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sub-Program Details</h2>
          <Button
            type="button"
            variant="outline"
            onClick={onAddSubProgram}
            className={styles.addButton}
          >
            <Plus size={16} />
            Add Sub-Program
          </Button>
        </div>

        <div className={styles.subProgramsList}>
          {subPrograms.map((subProgram) => (
            <div 
              key={subProgram.id} 
              ref={(el) => (subProgramRefs.current[subProgram.id] = el)}
            >
              <SubProgramCard
                subProgram={subProgram}
                uploadedBanner={uploadedBanner}
                programDescription={programDescription}
                currencyOptions={currencyOptions}
                venueOptions={venueOptions}
                onSubProgramChange={onSubProgramChange}
                onSubProgramVenueChange={onSubProgramVenueChange}
                onSubProgramBannerUpload={onSubProgramBannerUpload}
                onDeleteSubProgram={onDeleteSubProgram}
                getCurrencySymbol={getCurrencySymbol}
                isDateWithinProgramRange={isDateWithinProgramRange}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SubProgramsSection;
