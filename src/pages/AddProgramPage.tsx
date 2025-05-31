import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import BreadcrumbNavigation from '../components/BreadcrumbNavigation';
import ProgramDetailsForm from '../components/ProgramDetailsForm';
import SubProgramsSection from '../components/SubProgramsSection';
import styles from './AddProgramPage.module.css';

// Form schema for validation
const subProgramSchema = z.object({
  title: z.string().min(1, "Sub-program title is required"),
  banner: z.any().optional(),
  description: z.string().min(10, "Description should be at least 10 characters"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  modeOfProgram: z.enum(['online', 'offline', 'hybrid'], { required_error: "Please select a mode" }),
  venueAddress: z.array(z.string()).optional(),
  customVenue: z.string().optional(),
  isTravelRequired: z.enum(['yes', 'no']).optional(),
  isResidential: z.enum(['yes', 'no']).optional(),
  isPaymentRequired: z.enum(['yes', 'no']),
  currency: z.string().optional(),
  programFee: z.string().optional(),
});

const programDetailsSchema = z.object({
  programName: z.string().min(1, "Program name is required"),
  programBanner: z.any().optional(),
  description: z.string().min(10, "Description should be at least 10 characters"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  modeOfProgram: z.enum(['online', 'offline', 'hybrid'], { required_error: "Please select a mode" }),
  venueAddress: z.array(z.string()).optional(),
  customVenue: z.string().optional(),
  isTravelRequired: z.enum(['yes', 'no']).optional(),
  isResidential: z.enum(['yes', 'no']).optional(),
  isPaymentRequired: z.enum(['yes', 'no']),
  currency: z.string().optional(),
  programFee: z.string().optional(),
  registrationStartDate: z.date().optional(),
  registrationStartTime: z.string().optional(),
  registrationEndDate: z.date().optional(),
  registrationEndTime: z.string().optional(),
  approvalRequired: z.enum(['yes', 'no']),
  hasSeatLimit: z.enum(['yes', 'no']),
  seatLimit: z.string().optional(),
  hasWaitlist: z.enum(['yes', 'no']),
  waitlistTriggerCount: z.string().optional(),
  subPrograms: z.array(subProgramSchema),
});

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

const AddProgramPage = () => {
  const activeTab = 'programs';
  const setActiveTab = () => {};
  const navigate = useNavigate();
  const subProgramRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
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

  const [showCustomVenue, setShowCustomVenue] = useState(false);
  const [uploadedBanner, setUploadedBanner] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subProgramToDelete, setSubProgramToDelete] = useState<string | null>(null);
  
  // Watch form values for conditional rendering
  const modeOfProgram = form.watch('modeOfProgram');
  const isPaymentRequired = form.watch('isPaymentRequired');
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const selectedCurrency = form.watch('currency');
  const programDescription = form.watch('description');

  // Auto-calculate end date when start date changes
  useEffect(() => {
    if (startDate) {
      const endDate = addMonths(startDate, 6);
      form.setValue('endDate', endDate);
    }
  }, [startDate, form]);

  // Initialize default sub-programs
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([
    {
      id: '1',
      title: 'HDB 1',
      description: '',
      modeOfProgram: 'online',
      venueAddress: [],
      customVenue: '',
      isPaymentRequired: 'yes',
      currency: 'INR',
      programFee: '',
      showCustomVenue: false,
    },
    {
      id: '2',
      title: 'HDB 2',
      description: '',
      modeOfProgram: 'online',
      venueAddress: [],
      customVenue: '',
      isPaymentRequired: 'yes',
      currency: 'INR',
      programFee: '',
      showCustomVenue: false,
    },
    {
      id: '3',
      title: 'HDB 3',
      description: '',
      modeOfProgram: 'online',
      venueAddress: [],
      customVenue: '',
      isPaymentRequired: 'yes',
      currency: 'INR',
      programFee: '',
      showCustomVenue: false,
    },
    {
      id: '4',
      title: 'MSD 1',
      description: '',
      modeOfProgram: 'online',
      venueAddress: [],
      customVenue: '',
      isPaymentRequired: 'yes',
      currency: 'INR',
      programFee: '',
      showCustomVenue: false,
    },
    {
      id: '5',
      title: 'MSD 2',
      description: '',
      modeOfProgram: 'online',
      venueAddress: [],
      customVenue: '',
      isPaymentRequired: 'yes',
      currency: 'INR',
      programFee: '',
      showCustomVenue: false,
    }
  ]);

  // Venue options
  const venueOptions = [
    'Leonia Holistic Destination, Bommarasipet, Shamirpet Mandal, Medchal-Malkajgiri District, Hyderabad - 500078',
    'ITC Kohenur, Hyderabad',
    'Marriott Hotel, Bangalore',
    'Add Custom Venue'
  ];

  // Currency options
  const currencyOptions = [
    { value: 'INR', label: 'INR (₹)', symbol: '₹' },
    { value: 'USD', label: 'USD ($)', symbol: '$' },
    { value: 'EUR', label: 'EUR (€)', symbol: '€' },
    { value: 'GBP', label: 'GBP (£)', symbol: '£' },
    { value: 'SGD', label: 'SGD (S$)', symbol: 'S$' },
  ];

  const getCurrencySymbol = (currency: string) => {
    return currencyOptions.find(c => c.value === currency)?.symbol || '₹';
  };

  // Get program name for breadcrumb
  const programName = form.watch('programName') || 'HDB - 25';

  useEffect(() => {
    // Handle highlight phases with fade effects
    const highlightedSubProgram = subPrograms.find(sp => sp.isHighlighted);
    
    if (highlightedSubProgram) {
      // Start with fade-in
      setSubPrograms(prev => prev.map(sp => 
        sp.id === highlightedSubProgram.id 
          ? { ...sp, highlightPhase: 'fade-in' } 
          : sp
      ));

      // Transition to visible after 200ms
      const visibleTimer = setTimeout(() => {
        setSubPrograms(prev => prev.map(sp => 
          sp.id === highlightedSubProgram.id 
            ? { ...sp, highlightPhase: 'visible' } 
            : sp
        ));
      }, 200);

      // Start fade-out after 800ms
      const fadeOutTimer = setTimeout(() => {
        setSubPrograms(prev => prev.map(sp => 
          sp.id === highlightedSubProgram.id 
            ? { ...sp, highlightPhase: 'fade-out' } 
            : sp
        ));
      }, 800);

      // Complete fade-out and remove highlight after 1200ms total
      const completeTimer = setTimeout(() => {
        setSubPrograms(prev => prev.map(sp => 
          sp.id === highlightedSubProgram.id 
            ? { ...sp, isHighlighted: false, highlightPhase: undefined } 
            : sp
        ));
      }, 1200);

      return () => {
        clearTimeout(visibleTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [subPrograms.some(sp => sp.isHighlighted)]);

  // Pre-fill sub-program fields from main program
  const prefillSubProgramFields = (subProgram: SubProgram): SubProgram => {
    return {
      ...subProgram,
      description: subProgram.description || programDescription || '',
      banner: subProgram.banner || uploadedBanner,
      modeOfProgram: subProgram.modeOfProgram || modeOfProgram || 'online',
      currency: subProgram.currency || selectedCurrency || 'INR',
      isPaymentRequired: subProgram.isPaymentRequired || isPaymentRequired || 'yes',
    };
  };

  const handleAddSubProgram = () => {
    const newSubProgram: SubProgram = prefillSubProgramFields({
      id: Date.now().toString(),
      title: `Sub-Program ${subPrograms.length + 1}`,
      description: '',
      modeOfProgram: 'online',
      venueAddress: [],
      customVenue: '',
      isPaymentRequired: 'yes',
      currency: 'INR',
      programFee: '',
      isHighlighted: true,
      showCustomVenue: false,
    });
    
    setSubPrograms(prev => [...prev, newSubProgram]);
    
    // Scroll to new subprogram with faster timing
    setTimeout(() => {
      const element = subProgramRefs.current[newSubProgram.id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleDeleteSubProgram = (subProgramId: string) => {
    setSubProgramToDelete(subProgramId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSubProgram = () => {
    if (subProgramToDelete) {
      setSubPrograms(prev => prev.filter(sp => sp.id !== subProgramToDelete));
      setDeleteDialogOpen(false);
      setSubProgramToDelete(null);
    }
  };

  const handleSubProgramChange = (subProgramId: string, field: keyof SubProgram, value: any) => {
    setSubPrograms(prev => prev.map(sp => 
      sp.id === subProgramId ? { ...sp, [field]: value } : sp
    ));
  };

  const handleSubProgramVenueChange = (subProgramId: string, venues: string[]) => {
    if (venues.includes('Add Custom Venue')) {
      handleSubProgramChange(subProgramId, 'showCustomVenue', true);
      const filteredVenues = venues.filter(v => v !== 'Add Custom Venue');
      handleSubProgramChange(subProgramId, 'venueAddress', filteredVenues);
    } else {
      handleSubProgramChange(subProgramId, 'showCustomVenue', false);
      handleSubProgramChange(subProgramId, 'venueAddress', venues);
    }
  };

  const handleSubProgramBannerUpload = (subProgramId: string, file: File | null) => {
    handleSubProgramChange(subProgramId, 'banner', file);
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
    <div className={styles.container}>
      {/* Sticky Sidebar */}
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebar}>
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
      
      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Fixed Header */}
        <PageHeader />

        {/* Banner */}
        <div className={styles.bannerContainer}>
          <div className={styles.banner} style={{backgroundImage: 'url(/lovable-uploads/8f140035-f50b-40c4-b9b0-ac365bbd6cc7.png)'}}>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <div className={styles.maxWidth}>
            {/* Breadcrumb */}
            <BreadcrumbNavigation programName={programName} />

            {/* Personalization Message */}
            <div className={styles.pageTitle}>
              <h1 className={styles.titleText}>Add a HDB/MSD program</h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className={styles.form}>
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
                <div className={styles.footer}>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Program
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sub-Program</DialogTitle>
          </DialogHeader>
          <div className={styles.dialogContent}>
            <p>Are you sure you want to delete this sub-program? This action cannot be undone.</p>
          </div>
          <div className={styles.dialogActions}>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSubProgram}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddProgramPage;
