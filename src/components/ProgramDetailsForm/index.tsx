
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CalendarIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './index.module.css';

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
  subPrograms: z.array(z.any()),
});

interface ProgramDetailsFormProps {
  form: UseFormReturn<z.infer<typeof programDetailsSchema>>;
  uploadedBanner: File | null;
  showCustomVenue: boolean;
  onBannerUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVenueChange: (value: string[]) => void;
  getCurrencySymbol: (currency: string) => string;
  currencyOptions: Array<{ value: string; label: string; symbol: string }>;
  venueOptions: string[];
}

const ProgramDetailsForm = ({
  form,
  uploadedBanner,
  showCustomVenue,
  onBannerUpload,
  onVenueChange,
  getCurrencySymbol,
  currencyOptions,
  venueOptions
}: ProgramDetailsFormProps) => {
  const modeOfProgram = form.watch('modeOfProgram');
  const isPaymentRequired = form.watch('isPaymentRequired');
  const hasSeatLimit = form.watch('hasSeatLimit');
  const hasWaitlist = form.watch('hasWaitlist');
  const startDate = form.watch('startDate');
  const selectedCurrency = form.watch('currency');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Program Details</h2>
      </div>
      
      <div className={styles.grid}>
        {/* Program Name */}
        <FormField
          control={form.control}
          name="programName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={styles.label}>What's your program called?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter program name" 
                  className={styles.input}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Program Banner Upload */}
        <FormItem>
          <FormLabel className={styles.label}>Upload your program banner</FormLabel>
          <FormControl>
            <div className={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={onBannerUpload}
                className={styles.hiddenInput}
                id="banner-upload"
              />
              <label htmlFor="banner-upload" className={styles.uploadLabel}>
                <Upload className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  {uploadedBanner ? uploadedBanner.name : "Click to upload or drag and drop"}
                </p>
                <p className={styles.uploadSubtext}>PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          </FormControl>
        </FormItem>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className={styles.fullWidth}>
              <FormLabel className={styles.label}>Tell us about your program</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what makes your program special..."
                  className={styles.textarea}
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
            <FormItem className={styles.dateField}>
              <FormLabel className={styles.label}>When does your program begin?</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        styles.dateButton,
                        !field.value && styles.placeholder
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className={styles.calendarIcon} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverContent} align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
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
            <FormItem className={styles.dateField}>
              <FormLabel className={styles.label}>When does your program end?</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        styles.dateButton,
                        !field.value && styles.placeholder
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className={styles.calendarIcon} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverContent} align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => startDate && date < startDate}
                    initialFocus
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
            <FormItem className={styles.fullWidth}>
              <FormLabel className={styles.label}>How will your program be delivered?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={styles.radioGroup}
                >
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="online" id="online" className={styles.radioButton} />
                    <Label htmlFor="online" className={styles.radioLabel}>Online</Label>
                  </div>
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="offline" id="offline" className={styles.radioButton} />
                    <Label htmlFor="offline" className={styles.radioLabel}>In-person</Label>
                  </div>
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="hybrid" id="hybrid" className={styles.radioButton} />
                    <Label htmlFor="hybrid" className={styles.radioLabel}>Hybrid</Label>
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
            <FormItem className={styles.fullWidth}>
              <FormLabel className={styles.label}>Is there a fee for your program?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={styles.radioGroup}
                >
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="yes" id="payment-yes" className={styles.radioButton} />
                    <Label htmlFor="payment-yes" className={styles.radioLabel}>Yes</Label>
                  </div>
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="no" id="payment-no" className={styles.radioButton} />
                    <Label htmlFor="payment-no" className={styles.radioLabel}>No, it's free</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currency and Fee - Conditional */}
        <div className={cn(
          styles.paymentSection,
          isPaymentRequired === 'yes' ? styles.visible : styles.hidden
        )}>
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={styles.label}>What currency will you use?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value} className={styles.selectItem}>
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
                <FormLabel className={styles.label}>What's the program fee?</FormLabel>
                <FormControl>
                  <div className={styles.currencyInput}>
                    <span className={styles.currencySymbol}>
                      {getCurrencySymbol(selectedCurrency || 'INR')}
                    </span>
                    <Input 
                      placeholder="0.00" 
                      className={styles.feeInput}
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
            <FormItem className={styles.dateField}>
              <FormLabel className={styles.label}>When does registration open?</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        styles.dateButton,
                        !field.value && styles.placeholder
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className={styles.calendarIcon} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverContent} align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
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
              <FormLabel className={styles.label}>Registration start time</FormLabel>
              <FormControl>
                <Input type="time" className={styles.input} {...field} />
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
            <FormItem className={styles.dateField}>
              <FormLabel className={styles.label}>When does registration close?</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        styles.dateButton,
                        !field.value && styles.placeholder
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className={styles.calendarIcon} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className={styles.popoverContent} align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
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
              <FormLabel className={styles.label}>Registration end time</FormLabel>
              <FormControl>
                <Input type="time" className={styles.input} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Participants Limit Section */}
        <FormField
          control={form.control}
          name="hasSeatLimit"
          render={({ field }) => (
            <FormItem className={styles.fullWidth}>
              <FormLabel className={styles.label}>Is there a limit on participants?</FormLabel>
              <div className={styles.limitSection}>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className={styles.radioGroup}
                  >
                    <div className={styles.radioItem}>
                      <RadioGroupItem value="yes" id="limit-yes" className={styles.radioButton} />
                      <Label htmlFor="limit-yes" className={styles.radioLabel}>Yes, limit participants</Label>
                    </div>
                    <div className={styles.radioItem}>
                      <RadioGroupItem value="no" id="limit-no" className={styles.radioButton} />
                      <Label htmlFor="limit-no" className={styles.radioLabel}>No, unlimited participants</Label>
                    </div>
                  </RadioGroup>
                </FormControl>

                <div className={cn(
                  styles.conditionalField,
                  hasSeatLimit === 'yes' ? styles.visible : styles.hidden
                )}>
                  {hasSeatLimit === 'yes' && (
                    <FormField
                      control={form.control}
                      name="seatLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className={styles.seatLimitField}>
                              <Label className={styles.smallLabel}>Number of seats</Label>
                              <Input 
                                type="number" 
                                placeholder="Enter seats"
                                min="1"
                                className={styles.smallInput}
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

        {/* Waitlist Section */}
        <FormField
          control={form.control}
          name="hasWaitlist"
          render={({ field }) => (
            <FormItem className={styles.fullWidth}>
              <FormLabel className={styles.label}>Enable waitlist when full?</FormLabel>
              <div className={styles.limitSection}>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className={styles.radioGroup}
                  >
                    <div className={styles.radioItem}>
                      <RadioGroupItem value="yes" id="waitlist-yes" className={styles.radioButton} />
                      <Label htmlFor="waitlist-yes" className={styles.radioLabel}>Yes, allow waitlist</Label>
                    </div>
                    <div className={styles.radioItem}>
                      <RadioGroupItem value="no" id="waitlist-no" className={styles.radioButton} />
                      <Label htmlFor="waitlist-no" className={styles.radioLabel}>No waitlist</Label>
                    </div>
                  </RadioGroup>
                </FormControl>

                <div className={cn(
                  styles.conditionalField,
                  hasWaitlist === 'yes' ? styles.visible : styles.hidden
                )}>
                  {hasWaitlist === 'yes' && (
                    <FormField
                      control={form.control}
                      name="waitlistTriggerCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className={styles.seatLimitField}>
                              <Label className={styles.smallLabel}>Trigger count</Label>
                              <Input 
                                type="number" 
                                placeholder="Count"
                                min="1"
                                className={styles.smallInput}
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

        {/* Approval Required */}
        <FormField
          control={form.control}
          name="approvalRequired"
          render={({ field }) => (
            <FormItem className={styles.fullWidth}>
              <FormLabel className={styles.label}>Do you need to approve registrations?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className={styles.radioGroup}
                >
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="yes" id="approval-yes" className={styles.radioButton} />
                    <Label htmlFor="approval-yes" className={styles.radioLabel}>I'll approve each registration</Label>
                  </div>
                  <div className={styles.radioItem}>
                    <RadioGroupItem value="no" id="approval-no" className={styles.radioButton} />
                    <Label htmlFor="approval-no" className={styles.radioLabel}>Auto-approve registrations</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProgramDetailsForm;
