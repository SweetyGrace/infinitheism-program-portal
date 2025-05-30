import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Bell, User, Plus, X, CalendarIcon, Upload, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Sidebar from '../components/Sidebar';
import { cn } from '@/lib/utils';

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
  const hasSeatLimit = form.watch('hasSeatLimit');
  const hasWaitlist = form.watch('hasWaitlist');
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

  const getHighlightClasses = (subProgram: SubProgram) => {
    if (!subProgram.isHighlighted) {
      return 'border-gray-200';
    }

    switch (subProgram.highlightPhase) {
      case 'fade-in':
        return 'border-blue-500 border-2 shadow-lg bg-blue-50 opacity-0 animate-fade-in';
      case 'visible':
        return 'border-blue-500 border-2 shadow-lg bg-blue-50 opacity-100';
      case 'fade-out':
        return 'border-blue-500 border-2 shadow-lg bg-blue-50 opacity-100 animate-fade-out';
      default:
        return 'border-blue-500 border-2 shadow-lg bg-blue-50';
    }
  };

  const isDateWithinProgramRange = (date: Date) => {
    if (!startDate || !endDate) return true;
    return date >= startDate && date <= endDate;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sticky Sidebar */}
      <div className="w-20 flex-shrink-0">
        <div className="fixed left-0 top-0 h-full">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 relative">
        {/* Fixed Header */}
        <div className="fixed top-0 left-20 right-0 z-10 bg-white border-b border-gray-200 rounded-bl-3xl rounded-br-3xl shadow-sm">
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

        {/* Banner */}
        <div className="pt-20">
          <div className="w-full h-48 bg-cover bg-center" style={{backgroundImage: 'url(/lovable-uploads/8f140035-f50b-40c4-b9b0-ac365bbd6cc7.png)'}}>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Programs</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/choose-program">Add new program</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{programName}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Personalization Message */}
            <div className="mb-8">
              <h1 className="text-2xl text-gray-700">Add a HDB/MSD program</h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-12">
                {/* Program Details Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-800">Program Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Program Name */}
                    <FormField
                      control={form.control}
                      name="programName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">What's your program called?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter program name" 
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Program Banner Upload */}
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Upload your program banner</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="hidden"
                            id="banner-upload"
                          />
                          <label htmlFor="banner-upload" className="cursor-pointer">
                            <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                            <p className="mt-3 text-sm font-medium text-gray-700">
                              {uploadedBanner ? uploadedBanner.name : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Tell us about your program</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what makes your program special..."
                              className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Program Start Date */}
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium text-gray-700">When does your program begin?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 pl-3 text-left font-normal border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Program End Date */}
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium text-gray-700">When does your program end?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 pl-3 text-left font-normal border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => startDate && date < startDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mode of Program */}
                    <FormField
                      control={form.control}
                      name="modeOfProgram"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-gray-700">How will your program be delivered?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-8 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="online" id="online" className="border-gray-300 text-blue-600" />
                                <Label htmlFor="online" className="text-sm font-medium text-gray-700 cursor-pointer">Online</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="offline" id="offline" className="border-gray-300 text-blue-600" />
                                <Label htmlFor="offline" className="text-sm font-medium text-gray-700 cursor-pointer">In-person</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hybrid" id="hybrid" className="border-gray-300 text-blue-600" />
                                <Label htmlFor="hybrid" className="text-sm font-medium text-gray-700 cursor-pointer">Hybrid</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Required */}
                    <FormField
                      control={form.control}
                      name="isPaymentRequired"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Is there a fee for your program?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-8 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="payment-yes" className="border-gray-300 text-blue-600" />
                                <Label htmlFor="payment-yes" className="text-sm font-medium text-gray-700 cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="payment-no" className="border-gray-300 text-blue-600" />
                                <Label htmlFor="payment-no" className="text-sm font-medium text-gray-700 cursor-pointer">No, it's free</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Currency and Fee - Conditional with smooth transition */}
                    <div className={cn(
                      "md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden transition-all duration-500 ease-in-out",
                      isPaymentRequired === 'yes' 
                        ? "max-h-32 opacity-100 transform translate-y-0" 
                        : "max-h-0 opacity-0 transform -translate-y-4"
                    )}>
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">What currency will you use?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencyOptions.map((currency) => (
                                  <SelectItem key={currency.value} value={currency.value} className="py-3">
                                    {currency.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="programFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">What's the program fee?</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                  {getCurrencySymbol(selectedCurrency || 'INR')}
                                </span>
                                <Input 
                                  placeholder="0.00" 
                                  className="h-11 pl-8 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                  type="number"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Registration Start Date & Time */}
                    <FormField
                      control={form.control}
                      name="registrationStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium text-gray-700">When does registration open?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 pl-3 text-left font-normal border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationStartTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Registration start time</FormLabel>
                          <FormControl>
                            <Input type="time" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Registration End Date & Time */}
                    <FormField
                      control={form.control}
                      name="registrationEndDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-medium text-gray-700">When does registration close?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 pl-3 text-left font-normal border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationEndTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Registration end time</FormLabel>
                          <FormControl>
                            <Input type="time" className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Participants Limit Section - Inline Layout */}
                    <FormField
                      control={form.control}
                      name="hasSeatLimit"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Is there a limit on participants?</FormLabel>
                          <div className="flex flex-col md:flex-row md:items-end gap-4 mt-2">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-row space-x-8"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="limit-yes" className="border-gray-300 text-blue-600" />
                                  <Label htmlFor="limit-yes" className="text-sm font-medium text-gray-700 cursor-pointer">Yes, limit participants</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="limit-no" className="border-gray-300 text-blue-600" />
                                  <Label htmlFor="limit-no" className="text-sm font-medium text-gray-700 cursor-pointer">No, unlimited participants</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>

                            {/* Seat Limit Number - Conditional Inline */}
                            <div className={cn(
                              "overflow-hidden transition-all duration-300 ease-in-out",
                              hasSeatLimit === 'yes' 
                                ? "max-w-xs opacity-100 transform translate-x-0" 
                                : "max-w-0 opacity-0 transform -translate-x-4"
                            )}>
                              {hasSeatLimit === 'yes' && (
                                <FormField
                                  control={form.control}
                                  name="seatLimit"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex flex-col space-y-1">
                                          <Label className="text-xs text-gray-600">Number of seats</Label>
                                          <Input 
                                            type="number" 
                                            placeholder="Enter seats"
                                            min="1"
                                            className="h-10 w-32 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                            {...field} 
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Waitlist Section - Inline Layout */}
                    <FormField
                      control={form.control}
                      name="hasWaitlist"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Enable waitlist when full?</FormLabel>
                          <div className="flex flex-col md:flex-row md:items-end gap-4 mt-2">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-row space-x-8"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="waitlist-yes" className="border-gray-300 text-blue-600" />
                                  <Label htmlFor="waitlist-yes" className="text-sm font-medium text-gray-700 cursor-pointer">Yes, allow waitlist</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="waitlist-no" className="border-gray-300 text-blue-600" />
                                  <Label htmlFor="waitlist-no" className="text-sm font-medium text-gray-700 cursor-pointer">No waitlist</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>

                            {/* Waitlist Trigger Count - Conditional Inline */}
                            <div className={cn(
                              "overflow-hidden transition-all duration-300 ease-in-out",
                              hasWaitlist === 'yes' 
                                ? "max-w-xs opacity-100 transform translate-x-0" 
                                : "max-w-0 opacity-0 transform -translate-x-4"
                            )}>
                              {hasWaitlist === 'yes' && (
                                <FormField
                                  control={form.control}
                                  name="waitlistTriggerCount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex flex-col space-y-1">
                                          <Label className="text-xs text-gray-600">Trigger count</Label>
                                          <Input 
                                            type="number" 
                                            placeholder="Count"
                                            min="1"
                                            className="h-10 w-32 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                            {...field} 
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Approval Required - Moved to bottom */}
                    <FormField
                      control={form.control}
                      name="approvalRequired"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-sm font-medium text-gray-700">Do you need to approve registrations?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-8 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="approval-yes" className="border-gray-300 text-blue-600" />
                                <Label htmlFor="approval-yes" className="text-sm font-medium text-gray-700 cursor-pointer">I'll approve each registration</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="approval-no" className="border-gray-300 text-blue-600" />
                                <Label htmlFor="approval-no" className="text-sm font-medium text-gray-700 cursor-pointer">Auto-approve registrations</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sub-Program Configuration Section */}
                <div className="text-center py-8">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sub-Program Configuration</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Configure individual sub-programs with their specific schedules, delivery modes, and requirements. 
                      Each sub-program inherits settings from the main program but can be customized as needed.
                    </p>
                  </div>
                </div>

                {/* Sub-Program Details Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-800">Sub-Program Details</h2>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSubProgram}
                      className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Plus size={16} />
                      Add Sub-Program
                    </Button>
                  </div>

                  <div className="space-y-12">
                    {subPrograms.map((subProgram) => (
                      <div 
                        key={subProgram.id} 
                        ref={(el) => (subProgramRefs.current[subProgram.id] = el)}
                        className={`border rounded-xl p-8 transition-all duration-300 ease-in-out ${getHighlightClasses(subProgram)}`}
                      >
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-lg font-semibold text-gray-700">{subProgram.title}</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSubProgram(subProgram.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Sub-Program Title */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Sub-program title</Label>
                            <Input
                              value={subProgram.title}
                              onChange={(e) => handleSubProgramChange(subProgram.id, 'title', e.target.value)}
                              placeholder="Enter sub-program title"
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                            />
                          </div>

                          {/* Sub-Program Banner Upload */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Upload sub-program banner</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-300 cursor-pointer group">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSubProgramBannerUpload(subProgram.id, e.target.files?.[0] || null)}
                                className="hidden"
                                id={`banner-upload-${subProgram.id}`}
                              />
                              <label htmlFor={`banner-upload-${subProgram.id}`} className="cursor-pointer">
                                <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                <p className="mt-2 text-sm font-medium text-gray-700">
                                  {subProgram.banner ? subProgram.banner.name : (uploadedBanner ? `Using: ${uploadedBanner.name}` : "Click to upload")}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                              </label>
                            </div>
                          </div>

                          {/* Sub-Program Description */}
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Tell us about this sub-program</Label>
                            <Textarea 
                              value={subProgram.description}
                              onChange={(e) => handleSubProgramChange(subProgram.id, 'description', e.target.value)}
                              placeholder={programDescription ? `Pre-filled: ${programDescription.slice(0, 50)}...` : "Describe this sub-program..."}
                              className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                            />
                          </div>

                          {/* Sub-Program Start Date */}
                          <div className="flex flex-col space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Sub-program start date</Label>
                            <Calendar
                              mode="single"
                              selected={subProgram.startDate || undefined}
                              onSelect={(date) => handleSubProgramChange(subProgram.id, 'startDate', date)}
                              disabled={(date) => !isDateWithinProgramRange(date)}
                              className="border rounded-md p-3 bg-white shadow-sm"
                            />
                            {startDate && endDate && (
                              <p className="text-xs text-gray-500">Must be between {format(startDate, "PPP")} and {format(endDate, "PPP")}</p>
                            )}
                          </div>

                          {/* Sub-Program End Date */}
                          <div className="flex flex-col space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Sub-program end date</Label>
                            <Calendar
                              mode="single"
                              selected={subProgram.endDate || undefined}
                              onSelect={(date) => handleSubProgramChange(subProgram.id, 'endDate', date)}
                              disabled={(date) => 
                                !isDateWithinProgramRange(date) || 
                                (subProgram.startDate && date < subProgram.startDate)
                              }
                              className="border rounded-md p-3 bg-white shadow-sm"
                            />
                          </div>

                          {/* Mode of Sub-Program */}
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">How will this sub-program be delivered?</Label>
                            <RadioGroup
                              value={subProgram.modeOfProgram}
                              onValueChange={(value) => handleSubProgramChange(subProgram.id, 'modeOfProgram', value as 'online' | 'offline' | 'hybrid')}
                              className="flex flex-row space-x-8 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="online" id={`online-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                <Label htmlFor={`online-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">Online</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="offline" id={`offline-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                <Label htmlFor={`offline-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">In-person</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hybrid" id={`hybrid-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                <Label htmlFor={`hybrid-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">Hybrid</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Conditional Fields - Venue Address */}
                          <div className={cn(
                            "md:col-span-2 overflow-hidden transition-all duration-500 ease-in-out",
                            (subProgram.modeOfProgram === 'offline' || subProgram.modeOfProgram === 'hybrid') 
                              ? "max-h-96 opacity-100 transform translate-y-0" 
                              : "max-h-0 opacity-0 transform -translate-y-4"
                          )}>
                            <div className="space-y-6 pt-2">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Where will this sub-program take place?</Label>
                                <Select onValueChange={(value) => handleSubProgramVenueChange(subProgram.id, [...subProgram.venueAddress, value])}>
                                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
                                    <SelectValue placeholder="Select venue(s)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {venueOptions.map((venue) => (
                                      <SelectItem key={venue} value={venue} className="py-3">
                                        {venue}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {subProgram.venueAddress && subProgram.venueAddress.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {subProgram.venueAddress.map((venue, index) => (
                                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200">
                                        {venue}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Custom Venue Input */}
                              <div className={cn(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                subProgram.showCustomVenue 
                                  ? "max-h-24 opacity-100 transform translate-y-0" 
                                  : "max-h-0 opacity-0 transform -translate-y-2"
                              )}>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">Add your custom venue</Label>
                                  <Input 
                                    value={subProgram.customVenue}
                                    onChange={(e) => handleSubProgramChange(subProgram.id, 'customVenue', e.target.value)}
                                    placeholder="Enter venue address" 
                                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                  />
                                </div>
                              </div>

                              {/* Travel Required */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Will participants need to travel?</Label>
                                <RadioGroup
                                  value={subProgram.isTravelRequired}
                                  onValueChange={(value) => handleSubProgramChange(subProgram.id, 'isTravelRequired', value as 'yes' | 'no')}
                                  className="flex flex-row space-x-8 mt-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`travel-yes-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                    <Label htmlFor={`travel-yes-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`travel-no-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                    <Label htmlFor={`travel-no-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              {/* Residential */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Is this a residential sub-program?</Label>
                                <RadioGroup
                                  value={subProgram.isResidential}
                                  onValueChange={(value) => handleSubProgramChange(subProgram.id, 'isResidential', value as 'yes' | 'no')}
                                  className="flex flex-row space-x-8 mt-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`residential-yes-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                    <Label htmlFor={`residential-yes-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`residential-no-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                    <Label htmlFor={`residential-no-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </div>

                          {/* Payment Required */}
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Is there a fee for this sub-program?</Label>
                            <RadioGroup
                              value={subProgram.isPaymentRequired}
                              onValueChange={(value) => handleSubProgramChange(subProgram.id, 'isPaymentRequired', value as 'yes' | 'no')}
                              className="flex flex-row space-x-8 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id={`payment-yes-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                <Label htmlFor={`payment-yes-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id={`payment-no-${subProgram.id}`} className="border-gray-300 text-blue-600" />
                                <Label htmlFor={`payment-no-${subProgram.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">No, it's free</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Currency and Fee - Conditional */}
                          <div className={cn(
                            "md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden transition-all duration-500 ease-in-out",
                            subProgram.isPaymentRequired === 'yes' 
                              ? "max-h-32 opacity-100 transform translate-y-0" 
                              : "max-h-0 opacity-0 transform -translate-y-4"
                          )}>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">What currency will you use?</Label>
                              <Select 
                                value={subProgram.currency} 
                                onValueChange={(value) => handleSubProgramChange(subProgram.id, 'currency', value)}
                              >
                                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencyOptions.map((currency) => (
                                    <SelectItem key={currency.value} value={currency.value} className="py-3">
                                      {currency.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">What's the sub-program fee?</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                  {getCurrencySymbol(subProgram.currency || 'INR')}
                                </span>
                                <Input 
                                  value={subProgram.programFee}
                                  onChange={(e) => handleSubProgramChange(subProgram.id, 'programFee', e.target.value)}
                                  placeholder="0.00" 
                                  className="h-11 pl-8 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                  type="number"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-4 mt-12 mb-8">
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
          <div className="py-3">
            <p>Are you sure you want to delete this sub-program? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
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
