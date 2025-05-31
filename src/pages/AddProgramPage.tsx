
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addMonths } from 'date-fns';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNavigation from '../components/BreadcrumbNavigation';
import ProgramDetailsForm from '../components/ProgramDetailsForm';
import SubProgramsSection from '../components/SubProgramsSection';
import ProgramLayout from '../components/ProgramLayout';
import DeleteSubProgramDialog from '../components/DeleteSubProgramDialog';
import { programDetailsSchema } from '../schemas/programSchemas';
import { currencyOptions, venueOptions, getCurrencySymbol } from '../utils/programUtils';
import { useSubPrograms } from '../hooks/useSubPrograms';

const AddProgramPage = () => {
  const navigate = useNavigate();
  const [showCustomVenue, setShowCustomVenue] = useState(false);
  const [uploadedBanner, setUploadedBanner] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subProgramToDelete, setSubProgramToDelete] = useState<string | null>(null);
  
  // Form setup
  const form = useForm<z.infer<typeof programDetailsSchema>>({
    resolver: zodResolver(programDetailsSchema),
    defaultValues: {
      programName: 'HDB - 25',
      description: '',
      modeOfProgram: 'online',
      isPaymentRequired: 'yes',
      currency: 'INR',
      approvalRequired: 'no',
      hasSeatLimit: 'no',
      hasWaitlist: 'no',
      venueAddress: [],
      subPrograms: [],
    },
  });

  // Watch form values for conditional rendering
  const modeOfProgram = form.watch('modeOfProgram');
  const isPaymentRequired = form.watch('isPaymentRequired');
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const selectedCurrency = form.watch('currency');
  const programDescription = form.watch('description');
  const programName = form.watch('programName') || 'HDB - 25';

  // Sub-programs management
  const {
    subPrograms,
    subProgramRefs,
    handleAddSubProgram,
    handleSubProgramChange,
    handleSubProgramVenueChange,
    handleSubProgramBannerUpload,
    handleDeleteSubProgram: deleteSubProgram
  } = useSubPrograms({
    programDescription,
    uploadedBanner,
    modeOfProgram,
    selectedCurrency,
    isPaymentRequired
  });

  // Auto-calculate end date when start date changes
  useEffect(() => {
    if (startDate) {
      const endDate = addMonths(startDate, 6);
      form.setValue('endDate', endDate);
    }
  }, [startDate, form]);

  const handleDeleteSubProgram = (subProgramId: string) => {
    setSubProgramToDelete(subProgramId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSubProgram = () => {
    if (subProgramToDelete) {
      deleteSubProgram(subProgramToDelete);
      setDeleteDialogOpen(false);
      setSubProgramToDelete(null);
    }
  };

  const handleSave = (data: z.infer<typeof programDetailsSchema>) => {
    console.log('Saving program...', { ...data, subPrograms, uploadedBanner });
    // Add save logic here
  };

  const handleCancel = () => {
    navigate('/choose-program');
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedBanner(file);
    }
  };

  const handleVenueChange = (value: string[]) => {
    if (value.includes('Add Custom Venue')) {
      setShowCustomVenue(true);
      // Remove "Add Custom Venue" from selection
      const filteredValue = value.filter(v => v !== 'Add Custom Venue');
      form.setValue('venueAddress', filteredValue);
    } else {
      setShowCustomVenue(false);
      form.setValue('venueAddress', value);
    }
  };

  const isDateWithinProgramRange = (date: Date) => {
    if (!startDate || !endDate) return true;
    return date >= startDate && date <= endDate;
  };

  return (
    <ProgramLayout>
      {/* Breadcrumb */}
      <BreadcrumbNavigation programName={programName} />

      {/* Personalization Message */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>
          Add a HDB/MSD program
        </Typography>
      </Box>

      <Box component="form" onSubmit={form.handleSubmit(handleSave)} sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Program Details Section */}
        <ProgramDetailsForm
          form={form}
          uploadedBanner={uploadedBanner}
          showCustomVenue={showCustomVenue}
          onBannerUpload={handleBannerUpload}
          onVenueChange={handleVenueChange}
          getCurrencySymbol={getCurrencySymbol}
          currencyOptions={currencyOptions}
          venueOptions={venueOptions}
        />

        {/* Sub-Programs Section */}
        <SubProgramsSection
          subPrograms={subPrograms}
          uploadedBanner={uploadedBanner}
          programDescription={programDescription}
          selectedCurrency={selectedCurrency}
          isPaymentRequired={isPaymentRequired}
          modeOfProgram={modeOfProgram}
          startDate={startDate}
          endDate={endDate}
          currencyOptions={currencyOptions}
          venueOptions={venueOptions}
          onAddSubProgram={handleAddSubProgram}
          onSubProgramChange={handleSubProgramChange}
          onSubProgramVenueChange={handleSubProgramVenueChange}
          onSubProgramBannerUpload={handleSubProgramBannerUpload}
          onDeleteSubProgram={handleDeleteSubProgram}
          getCurrencySymbol={getCurrencySymbol}
          isDateWithinProgramRange={isDateWithinProgramRange}
        />

        {/* Footer Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6, mb: 4 }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save Program
          </Button>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteSubProgramDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteSubProgram}
      />
    </ProgramLayout>
  );
};

export default AddProgramPage;
