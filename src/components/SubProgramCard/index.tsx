
import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Paper, 
  Typography, 
  Grid, 
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
  Chip,
  InputAdornment,
  Collapse
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Upload, Delete } from '@mui/icons-material';

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

interface SubProgramCardProps {
  subProgram: SubProgram;
  uploadedBanner: File | null;
  programDescription: string;
  currencyOptions: Array<{ value: string; label: string; symbol: string }>;
  venueOptions: string[];
  onSubProgramChange: (subProgramId: string, field: keyof SubProgram, value: any) => void;
  onSubProgramVenueChange: (subProgramId: string, venues: string[]) => void;
  onSubProgramBannerUpload: (subProgramId: string, file: File | null) => void;
  onDeleteSubProgram: (subProgramId: string) => void;
  getCurrencySymbol: (currency: string) => string;
  isDateWithinProgramRange: (date: Date) => boolean;
  startDate?: Date;
  endDate?: Date;
}

const SubProgramCard = ({
  subProgram,
  uploadedBanner,
  programDescription,
  currencyOptions,
  venueOptions,
  onSubProgramChange,
  onSubProgramVenueChange,
  onSubProgramBannerUpload,
  onDeleteSubProgram,
  getCurrencySymbol,
  isDateWithinProgramRange,
  startDate,
  endDate
}: SubProgramCardProps) => {
  const getHighlightSx = () => {
    if (!subProgram.isHighlighted) {
      return {};
    }

    switch (subProgram.highlightPhase) {
      case 'fade-in':
        return {
          transform: 'scale(1.02)',
          boxShadow: 3,
          border: '2px solid',
          borderColor: 'primary.main',
          transition: 'all 0.2s ease-in-out',
          opacity: 0.8
        };
      case 'visible':
        return {
          transform: 'scale(1.02)',
          boxShadow: 3,
          border: '2px solid',
          borderColor: 'primary.main',
          transition: 'all 0.2s ease-in-out',
          opacity: 1
        };
      case 'fade-out':
        return {
          transform: 'scale(1)',
          boxShadow: 1,
          border: '1px solid',
          borderColor: 'grey.200',
          transition: 'all 0.4s ease-in-out',
          opacity: 0.9
        };
      default:
        return {
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: 3
        };
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          ...getHighlightSx()
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {subProgram.title}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Delete />}
            onClick={() => onDeleteSubProgram(subProgram.id)}
            color="error"
          >
            Delete
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {/* Sub-Program Title */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sub-program title"
              value={subProgram.title}
              onChange={(e) => onSubProgramChange(subProgram.id, 'title', e.target.value)}
              placeholder="Enter sub-program title"
              variant="outlined"
            />
          </Grid>

          {/* Sub-Program Banner Upload */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1, color: 'text.primary' }}>Upload sub-program banner</FormLabel>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 3,
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
                  onChange={(e) => onSubProgramBannerUpload(subProgram.id, e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id={`banner-upload-${subProgram.id}`}
                />
                <label htmlFor={`banner-upload-${subProgram.id}`} style={{ cursor: 'pointer' }}>
                  <Upload sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {subProgram.banner ? subProgram.banner.name : (uploadedBanner ? `Using: ${uploadedBanner.name}` : "Click to upload")}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    PNG, JPG, GIF up to 10MB
                  </Typography>
                </label>
              </Box>
            </FormControl>
          </Grid>

          {/* Sub-Program Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tell us about this sub-program"
              value={subProgram.description}
              onChange={(e) => onSubProgramChange(subProgram.id, 'description', e.target.value)}
              placeholder={programDescription ? `Pre-filled: ${programDescription.slice(0, 50)}...` : "Describe this sub-program..."}
              variant="outlined"
            />
          </Grid>

          {/* Sub-Program Start Date */}
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Sub-program start date"
              value={subProgram.startDate}
              onChange={(date) => onSubProgramChange(subProgram.id, 'startDate', date)}
              shouldDisableDate={(date) => !isDateWithinProgramRange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: startDate && endDate ? `Must be between ${format(startDate, "PPP")} and ${format(endDate, "PPP")}` : undefined
                }
              }}
            />
          </Grid>

          {/* Sub-Program End Date */}
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Sub-program end date"
              value={subProgram.endDate}
              onChange={(date) => onSubProgramChange(subProgram.id, 'endDate', date)}
              shouldDisableDate={(date) => 
                !isDateWithinProgramRange(date) || 
                (subProgram.startDate && date < subProgram.startDate)
              }
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />
          </Grid>

          {/* Mode of Sub-Program */}
          <Grid item xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                How will this sub-program be delivered?
              </FormLabel>
              <RadioGroup
                value={subProgram.modeOfProgram}
                onChange={(e) => onSubProgramChange(subProgram.id, 'modeOfProgram', e.target.value as 'online' | 'offline' | 'hybrid')}
                row
              >
                <FormControlLabel value="online" control={<Radio />} label="Online" />
                <FormControlLabel value="offline" control={<Radio />} label="In-person" />
                <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Conditional Fields - Venue Address */}
          <Collapse in={subProgram.modeOfProgram === 'offline' || subProgram.modeOfProgram === 'hybrid'}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Where will this sub-program take place?</InputLabel>
                  <Select
                    value=""
                    onChange={(e) => onSubProgramVenueChange(subProgram.id, [...subProgram.venueAddress, e.target.value])}
                    label="Where will this sub-program take place?"
                  >
                    {venueOptions.map((venue) => (
                      <MenuItem key={venue} value={venue}>
                        {venue}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {subProgram.venueAddress && subProgram.venueAddress.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {subProgram.venueAddress.map((venue, index) => (
                      <Chip
                        key={index}
                        label={venue}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Custom Venue Input */}
              <Collapse in={subProgram.showCustomVenue}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Add your custom venue"
                    value={subProgram.customVenue}
                    onChange={(e) => onSubProgramChange(subProgram.id, 'customVenue', e.target.value)}
                    placeholder="Enter venue address"
                    variant="outlined"
                  />
                </Grid>
              </Collapse>

              {/* Travel Required */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                    Will participants need to travel?
                  </FormLabel>
                  <RadioGroup
                    value={subProgram.isTravelRequired}
                    onChange={(e) => onSubProgramChange(subProgram.id, 'isTravelRequired', e.target.value as 'yes' | 'no')}
                    row
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Residential */}
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                    Is this a residential sub-program?
                  </FormLabel>
                  <RadioGroup
                    value={subProgram.isResidential}
                    onChange={(e) => onSubProgramChange(subProgram.id, 'isResidential', e.target.value as 'yes' | 'no')}
                    row
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>

          {/* Payment Required */}
          <Grid item xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
                Is there a fee for this sub-program?
              </FormLabel>
              <RadioGroup
                value={subProgram.isPaymentRequired}
                onChange={(e) => onSubProgramChange(subProgram.id, 'isPaymentRequired', e.target.value as 'yes' | 'no')}
                row
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No, it's free" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Currency and Fee - Conditional */}
          <Collapse in={subProgram.isPaymentRequired === 'yes'}>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>What currency will you use?</InputLabel>
                  <Select
                    value={subProgram.currency}
                    onChange={(e) => onSubProgramChange(subProgram.id, 'currency', e.target.value)}
                    label="What currency will you use?"
                  >
                    {currencyOptions.map((currency) => (
                      <MenuItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="What's the sub-program fee?"
                  value={subProgram.programFee}
                  onChange={(e) => onSubProgramChange(subProgram.id, 'programFee', e.target.value)}
                  placeholder="0.00"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {getCurrencySymbol(subProgram.currency || 'INR')}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default SubProgramCard;
