
import { UseFormReturn, Controller } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { 
  Paper, 
  Typography, 
  Grid2 as Grid, 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Select, 
  MenuItem, 
  InputLabel, 
  Box,
  Button,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Upload } from '@mui/icons-material';

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
  const { control, watch, formState: { errors } } = form;
  const modeOfProgram = watch('modeOfProgram');
  const isPaymentRequired = watch('isPaymentRequired');
  const hasSeatLimit = watch('hasSeatLimit');
  const hasWaitlist = watch('hasWaitlist');
  const startDate = watch('startDate');
  const selectedCurrency = watch('currency');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={1} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
          Program Details
        </Typography>
        
        <Grid container spacing={3}>
          {/* Program Name */}
          <Grid xs={12} md={6}>
            <Controller
              name="programName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="What's your program called?"
                  placeholder="Enter program name"
                  error={!!errors.programName}
                  helperText={errors.programName?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>

          {/* Program Banner Upload */}
          <Grid xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, color: 'text.primary' }}>Upload your program banner</FormLabel>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50'
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={onBannerUpload}
                  style={{ display: 'none' }}
                  id="banner-upload"
                />
                <label htmlFor="banner-upload" style={{ cursor: 'pointer' }}>
                  <Upload sx={{ fontSize: 40, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {uploadedBanner ? uploadedBanner.name : "Click to upload or drag and drop"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    PNG, JPG, GIF up to 10MB
                  </Typography>
                </label>
              </Box>
            </FormControl>
          </Grid>

          {/* Description */}
          <Grid xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Tell us about your program"
                  placeholder="Describe what makes your program special..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  variant="outlined"
                />
              )}
            />
          </Grid>

          {/* Program Start Date */}
          <Grid xs={12} md={6}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="When does your program begin?"
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate?.message
                    }
                  }}
                />
              )}
            />
          </Grid>

          {/* Program End Date */}
          <Grid xs={12} md={6}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="When does your program end?"
                  minDate={startDate || new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate?.message
                    }
                  }}
                />
              )}
            />
          </Grid>

          {/* Mode of Program */}
          <Grid xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                How will your program be delivered?
              </FormLabel>
              <Controller
                name="modeOfProgram"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="online" control={<Radio />} label="Online" />
                    <FormControlLabel value="offline" control={<Radio />} label="In-person" />
                    <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid" />
                  </RadioGroup>
                )}
              />
              {errors.modeOfProgram && (
                <FormHelperText error>{errors.modeOfProgram?.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Payment Required */}
          <Grid xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                Is there a fee for your program?
              </FormLabel>
              <Controller
                name="isPaymentRequired"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No, it's free" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>

          {/* Currency and Fee - Conditional */}
          {isPaymentRequired === 'yes' && (
            <>
              <Grid xs={12} md={6}>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>What currency will you use?</InputLabel>
                      <Select {...field} label="What currency will you use?">
                        {currencyOptions.map((currency) => (
                          <MenuItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <Controller
                  name="programFee"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="What's the program fee?"
                      placeholder="0.00"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {getCurrencySymbol(selectedCurrency || 'INR')}
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
            </>
          )}

          {/* Registration Start Date & Time */}
          <Grid xs={12} md={6}>
            <Controller
              name="registrationStartDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="When does registration open?"
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid xs={12} md={6}>
            <Controller
              name="registrationStartTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Registration start time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Registration End Date & Time */}
          <Grid xs={12} md={6}>
            <Controller
              name="registrationEndDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="When does registration close?"
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              )}
            />
          </Grid>

          <Grid xs={12} md={6}>
            <Controller
              name="registrationEndTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Registration end time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Participants Limit Section */}
          <Grid xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                Is there a limit on participants?
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Controller
                  name="hasSeatLimit"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes, limit participants" />
                      <FormControlLabel value="no" control={<Radio />} label="No, unlimited participants" />
                    </RadioGroup>
                  )}
                />
                
                {hasSeatLimit === 'yes' && (
                  <Controller
                    name="seatLimit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Number of seats"
                        placeholder="Enter seats"
                        sx={{ width: 150 }}
                        inputProps={{ min: 1 }}
                      />
                    )}
                  />
                )}
              </Box>
            </FormControl>
          </Grid>

          {/* Waitlist Section */}
          <Grid xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                Enable waitlist when full?
              </FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Controller
                  name="hasWaitlist"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel value="yes" control={<Radio />} label="Yes, allow waitlist" />
                      <FormControlLabel value="no" control={<Radio />} label="No waitlist" />
                    </RadioGroup>
                  )}
                />
                
                {hasWaitlist === 'yes' && (
                  <Controller
                    name="waitlistTriggerCount"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Trigger count"
                        placeholder="Count"
                        sx={{ width: 150 }}
                        inputProps={{ min: 1 }}
                      />
                    )}
                  />
                )}
              </Box>
            </FormControl>
          </Grid>

          {/* Approval Required */}
          <Grid xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                Do you need to approve registrations?
              </FormLabel>
              <Controller
                name="approvalRequired"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="yes" control={<Radio />} label="I'll approve each registration" />
                    <FormControlLabel value="no" control={<Radio />} label="Auto-approve registrations" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default ProgramDetailsForm;
