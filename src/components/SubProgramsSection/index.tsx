
import { useRef } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import SubProgramCard from '../SubProgramCard';
import { SubProgram, CurrencyOption } from '../../types/program';

interface SubProgramsSectionProps {
  subPrograms: SubProgram[];
  uploadedBanner: File | null;
  programDescription: string;
  selectedCurrency: string;
  isPaymentRequired: 'yes' | 'no';
  modeOfProgram: 'online' | 'offline' | 'hybrid';
  startDate?: Date;
  endDate?: Date;
  currencyOptions: CurrencyOption[];
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
  onAddSubProgram,
  onSubProgramChange,
  onSubProgramVenueChange,
  onSubProgramBannerUpload,
  onDeleteSubProgram,
  getCurrencySymbol,
  currencyOptions,
  venueOptions,
  isDateWithinProgramRange
}: SubProgramsSectionProps) => {
  const subProgramRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  return (
    <>
      {/* Sub-Program Configuration Section */}
      <Box sx={{ textAlign: 'center', py: 4, mb: 4 }}>
        <Box sx={{ maxWidth: '32rem', mx: 'auto' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
            Sub-Program Configuration
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
            Configure individual sub-programs with their specific schedules, delivery modes, and requirements. 
            Each sub-program inherits settings from the main program but can be customized as needed.
          </Typography>
        </Box>
      </Box>

      {/* Sub-Program Details Section */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Sub-Program Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={onAddSubProgram}
            sx={{ 
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'primary.50',
                borderColor: 'primary.main'
              }
            }}
          >
            Add Sub-Program
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {subPrograms.map((subProgram, index) => (
            <div 
              key={subProgram.id} 
              ref={(el) => (subProgramRefs.current[subProgram.id] = el)}
            >
              <SubProgramCard
                subProgram={subProgram}
                index={index}
                onSubProgramChange={onSubProgramChange}
                onSubProgramVenueChange={onSubProgramVenueChange}
                onSubProgramBannerUpload={onSubProgramBannerUpload}
                onDeleteSubProgram={onDeleteSubProgram}
                getCurrencySymbol={getCurrencySymbol}
                currencyOptions={currencyOptions}
                venueOptions={venueOptions}
                isDateWithinProgramRange={isDateWithinProgramRange}
              />
            </div>
          ))}
        </Box>
      </Paper>
    </>
  );
};

export default SubProgramsSection;
