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
import { Bell, User, Plus, X, CalendarIcon, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Sidebar from '../components/Sidebar';
import { cn } from '@/lib/utils';

// Form schema for validation
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
});

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'dropdown';
  value: string;
  options?: string[];
  isMultiSelect?: boolean;
  isRemovable?: boolean;
}

interface SubProgram {
  id: string;
  name: string;
  fields: FormField[];
  isHighlighted?: boolean;
  highlightPhase?: 'fade-in' | 'visible' | 'fade-out';
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
    },
  });

  const [showCustomVenue, setShowCustomVenue] = useState(false);
  const [uploadedBanner, setUploadedBanner] = useState<File | null>(null);
  
  // Watch form values for conditional rendering
  const modeOfProgram = form.watch('modeOfProgram');
  const isPaymentRequired = form.watch('isPaymentRequired');
  const hasSeatLimit = form.watch('hasSeatLimit');
  const hasWaitlist = form.watch('hasWaitlist');
  const startDate = form.watch('startDate');
  const selectedCurrency = form.watch('currency');

  // Auto-calculate end date when start date changes
  useEffect(() => {
    if (startDate) {
      const endDate = addMonths(startDate, 6);
      form.setValue('endDate', endDate);
    }
  }, [startDate, form]);

  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([
    {
      id: '1',
      name: 'Sub-Program 1',
      fields: [
        { id: 'sp1-1', label: 'Title', type: 'text', value: '', isRemovable: false },
        { id: 'sp1-2', label: 'Duration (weeks)', type: 'number', value: '', isRemovable: false },
      ]
    }
  ]);

  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [fieldTargetSection, setFieldTargetSection] = useState<'program' | string>('program');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>(['']);
  const [newFieldIsMultiSelect, setNewFieldIsMultiSelect] = useState(false);

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

  const handleAddSubProgram = () => {
    const newSubProgram: SubProgram = {
      id: Date.now().toString(),
      name: `Sub-Program ${subPrograms.length + 1}`,
      fields: [
        { id: `sp${Date.now()}-1`, label: 'Title', type: 'text', value: '', isRemovable: false },
      ],
      isHighlighted: true,
    };
    
    setSubPrograms(prev => [...prev, newSubProgram]);
    
    // Scroll to new subprogram with faster timing
    setTimeout(() => {
      const element = subProgramRefs.current[newSubProgram.id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
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
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-gray-800">Program Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Program Name */}
                    <FormField
                      control={form.control}
                      name="programName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your program called?</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter program name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Program Banner Upload */}
                    <FormItem>
                      <FormLabel>Upload your program banner</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="hidden"
                            id="banner-upload"
                          />
                          <label htmlFor="banner-upload" className="cursor-pointer">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              {uploadedBanner ? uploadedBanner.name : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                          <FormLabel>Tell us about your program</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what makes your program special..."
                              className="min-h-[100px]"
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
                          <FormLabel>When does your program begin?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                          <FormLabel>When does your program end?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                        <FormItem className="space-y-3">
                          <FormLabel>How will your program be delivered?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="online" id="online" />
                                <Label htmlFor="online">Online</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="offline" id="offline" />
                                <Label htmlFor="offline">In-person</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hybrid" id="hybrid" />
                                <Label htmlFor="hybrid">Hybrid (Online + In-person)</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Conditional Fields - Venue Address */}
                    {(modeOfProgram === 'offline' || modeOfProgram === 'hybrid') && (
                      <div className="md:col-span-2 animate-fade-in">
                        <FormField
                          control={form.control}
                          name="venueAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Where will your program take place?</FormLabel>
                              <FormControl>
                                <Select onValueChange={(value) => handleVenueChange([...field.value || [], value])}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select venue(s)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {venueOptions.map((venue) => (
                                      <SelectItem key={venue} value={venue}>
                                        {venue}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              {field.value && field.value.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {field.value.map((venue, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                                      {venue}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Custom Venue Input */}
                        {showCustomVenue && (
                          <FormField
                            control={form.control}
                            name="customVenue"
                            render={({ field }) => (
                              <FormItem className="mt-4 animate-fade-in">
                                <FormLabel>Add your custom venue</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter venue address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}

                    {/* Travel Required */}
                    {(modeOfProgram === 'offline' || modeOfProgram === 'hybrid') && (
                      <FormField
                        control={form.control}
                        name="isTravelRequired"
                        render={({ field }) => (
                          <FormItem className="space-y-3 animate-fade-in">
                            <FormLabel>Will participants need to travel?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="travel-yes" />
                                  <Label htmlFor="travel-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="travel-no" />
                                  <Label htmlFor="travel-no">No</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Residential */}
                    {(modeOfProgram === 'offline' || modeOfProgram === 'hybrid') && (
                      <FormField
                        control={form.control}
                        name="isResidential"
                        render={({ field }) => (
                          <FormItem className="space-y-3 animate-fade-in">
                            <FormLabel>Is this a residential program?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="residential-yes" />
                                  <Label htmlFor="residential-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="residential-no" />
                                  <Label htmlFor="residential-no">No</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Payment Required */}
                    <FormField
                      control={form.control}
                      name="isPaymentRequired"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Is there a fee for your program?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="payment-yes" />
                                <Label htmlFor="payment-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="payment-no" />
                                <Label htmlFor="payment-no">No, it's free</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Currency and Fee - Conditional */}
                    {isPaymentRequired === 'yes' && (
                      <>
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem className="animate-fade-in">
                              <FormLabel>What currency will you use?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currencyOptions.map((currency) => (
                                    <SelectItem key={currency.value} value={currency.value}>
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
                            <FormItem className="animate-fade-in">
                              <FormLabel>What's the program fee?</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {getCurrencySymbol(selectedCurrency || 'INR')}
                                  </span>
                                  <Input 
                                    placeholder="0.00" 
                                    className="pl-8"
                                    type="number"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Registration Start Date & Time */}
                    <FormField
                      control={form.control}
                      name="registrationStartDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>When does registration open?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                          <FormLabel>Registration start time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
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
                          <FormLabel>When does registration close?</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
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
                          <FormLabel>Registration end time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Approval Required */}
                    <FormField
                      control={form.control}
                      name="approvalRequired"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Do you need to approve registrations?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="approval-yes" />
                                <Label htmlFor="approval-yes">Yes, I'll approve each registration</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="approval-no" />
                                <Label htmlFor="approval-no">No, auto-approve registrations</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Seat Limit */}
                    <FormField
                      control={form.control}
                      name="hasSeatLimit"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Is there a limit on participants?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="limit-yes" />
                                <Label htmlFor="limit-yes">Yes, limit participants</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="limit-no" />
                                <Label htmlFor="limit-no">No, unlimited participants</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Seat Limit Number - Conditional */}
                    {hasSeatLimit === 'yes' && (
                      <FormField
                        control={form.control}
                        name="seatLimit"
                        render={({ field }) => (
                          <FormItem className="animate-fade-in">
                            <FormLabel>How many participants can join?</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Enter number of seats"
                                min="1"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Waitlist */}
                    <FormField
                      control={form.control}
                      name="hasWaitlist"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Enable waitlist when full?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="waitlist-yes" />
                                <Label htmlFor="waitlist-yes">Yes, allow waitlist</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="waitlist-no" />
                                <Label htmlFor="waitlist-no">No waitlist</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Waitlist Trigger Count - Conditional */}
                    {hasWaitlist === 'yes' && (
                      <FormField
                        control={form.control}
                        name="waitlistTriggerCount"
                        render={({ field }) => (
                          <FormItem className="animate-fade-in">
                            <FormLabel>Waitlist trigger count</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="When to start waitlist"
                                min="1"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Sub-Program Details Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-gray-800">Sub-Program Details</h2>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSubProgram}
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Sub-Program
                    </Button>
                  </div>

                  <div className="space-y-8">
                    {subPrograms.map((subProgram) => (
                      <div 
                        key={subProgram.id} 
                        ref={(el) => (subProgramRefs.current[subProgram.id] = el)}
                        className={`border rounded-lg p-4 transition-all duration-300 ease-in-out ${getHighlightClasses(subProgram)}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-700">{subProgram.name}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {subProgram.fields.map(field => (
                            <div key={field.id} className="space-y-2">
                              <Label htmlFor={field.id}>{field.label}</Label>
                              <Input
                                id={field.id}
                                type={field.type}
                                value={field.value}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                              />
                            </div>
                          ))}
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
    </div>
  );
};

export default AddProgramPage;
