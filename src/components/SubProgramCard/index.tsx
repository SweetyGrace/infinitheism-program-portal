
import React from 'react';
import { Controller } from 'react-hook-form';
import { 
  Paper, 
  Typography, 
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
  IconButton,
  InputAdornment,
  Stack
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
  index: number;
  onSubProgramChange: (subProgramId: string, field: keyof SubProgram, value: any) => void;
  onSubProgramVenueChange: (subProgramId: string, venues: string[]) => void;
  onSubProgramBannerUpload: (subProgramId: string, file: File | null) => void;
  onDeleteSubProgram: (subProgramId: string) => void;
  getCurrencySymbol: (currency: string) => string;
  currencyOptions: Array<{ value: string; label: string; symbol: string }>;
  venueOptions: string[];
  isDateWithinProgramRange: (date: Date) => boolean;
}

const SubProgramCard = ({
  subProgram,
  index,
  onSubProgramChange,
  onSubProgramVenueChange,
  onSubProgramBannerUpload,
  onDeleteSubProgram,
  getCurrencySymbol,
  currencyOptions,
  venueOptions,
  isDateWithinProgramRange
}: SubProgramCardProps) => {
  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onSubProgramBannerUpload(subProgram.id, file);
  };

  const getHighlightSx = () => {
    if (!subProgram.isHighlighted) return {};
    
    const baseStyle = {
      transition: 'all 0.4s ease-in-out',
      transform: 'scale(1.02)',
    };

    switch (subProgram.highlightPhase) {
      case 'fade-in':
        return {
          ...baseStyle,
          bgcolor: 'primary.50',
          boxShadow: '0 0 20px rgba(25, 118, 210, 0.3)',
          opacity: 0.7,
        };
      case 'visible':
        return {
          ...baseStyle,
          bgcolor: 'primary.50',
          boxShadow: '0 0 20px rgba(25, 118, 210, 0.3)',
          opacity: 1,
        };
      case 'fade-out':
        return {
          ...baseStyle,
          bgcolor: 'primary.50',
          boxShadow: '0 0 20px rgba(25, 118, 210, 0.3)',
          opacity: 0.7,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          position: 'relative',
          ...getHighlightSx()
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Sub-Program {index + 1}
          </Typography>
          <IconButton 
            onClick={() => onDeleteSubProgram(subProgram.id)}
            color="error"
            sx={{ '&:hover': { bgcolor: 'error.50' } }}
          >
            <Delete />
          </IconButton>
        </Box>
        
        <Stack spacing={3}>
          {/* Title and Banner Row */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Sub-program title"
                value={subProgram.title}
                onChange={(e) => onSubProgramChange(subProgram.id, 'title', e.target.value)}
                variant="outlined"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1, color: 'text.primary' }}>Upload banner (optional)</FormLabel>
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
                    onChange={handleBannerUpload}
                    style={{ display: 'none' }}
                    id={`sub-banner-upload-${subProgram.id}`}
                  />
                  <label htmlFor={`sub-banner-upload-${subProgram.id}`} style={{ cursor: 'pointer' }}>
                    <Upload sx={{ fontSize: 30, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {subProgram.banner ? subProgram.banner.name : "Upload banner"}
                    </Typography>
                  </label>
                </Box>
              </FormControl>
            </Box>
          </Box>

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={subProgram.description}
            onChange={(e) => onSubProgramChange(subProgram.id, 'description', e.target.value)}
            placeholder="Describe this sub-program..."
            variant="outlined"
          />

          {/* Dates Row */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <DatePicker
                label="Start date"
                value={subProgram.startDate}
                onChange={(date) => onSubProgramChange(subProgram.id, 'startDate', date)}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: subProgram.startDate && !isDateWithinProgramRange(subProgram.startDate),
                    helperText: subProgram.startDate && !isDateWithinProgramRange(subProgram.startDate) 
                      ? "Date should be within program range" 
                      : ""
                  }
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <DatePicker
                label="End date"
                value={subProgram.endDate}
                onChange={(date) => onSubProgramChange(subProgram.id, 'endDate', date)}
                minDate={subProgram.startDate || new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: subProgram.endDate && !isDateWithinProgramRange(subProgram.endDate),
                    helperText: subProgram.endDate && !isDateWithinProgramRange(subProgram.endDate) 
                      ? "Date should be within program range" 
                      : ""
                  }
                }}
              />
            </Box>
          </Box>

          {/* Mode of Program */}
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
              Delivery mode
            </FormLabel>
            <RadioGroup 
              value={subProgram.modeOfProgram} 
              onChange={(e) => onSubProgramChange(subProgram.id, 'modeOfProgram', e.target.value)}
              row
            >
              <FormControlLabel value="online" control={<Radio />} label="Online" />
              <FormControlLabel value="offline" control={<Radio />} label="In-person" />
              <FormControlLabel value="hybrid" control={<Radio />} label="Hybrid" />
            </RadioGroup>
          </FormControl>

          {/* Payment */}
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ color: 'text.primary', mb: 1 }}>
              Payment required?
            </FormLabel>
            <RadioGroup 
              value={subProgram.isPaymentRequired} 
              onChange={(e) => onSubProgramChange(subProgram.id, 'isPaymentRequired', e.target.value)}
              row
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No, it's free" />
            </RadioGroup>
          </FormControl>

          {/* Currency and Fee - Conditional */}
          {subProgram.isPaymentRequired === 'yes' && (
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select 
                    value={subProgram.currency} 
                    onChange={(e) => onSubProgramChange(subProgram.id, 'currency', e.target.value)}
                    label="Currency"
                  >
                    {currencyOptions.map((currency) => (
                      <MenuItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Program fee"
                  type="number"
                  value={subProgram.programFee}
                  onChange={(e) => onSubProgramChange(subProgram.id, 'programFee', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {getCurrencySymbol(subProgram.currency)}
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Box>
          )}
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
};

export default SubProgramCard;
