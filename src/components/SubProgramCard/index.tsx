
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const getHighlightClasses = () => {
    if (!subProgram.isHighlighted) {
      return styles.container;
    }

    switch (subProgram.highlightPhase) {
      case 'fade-in':
        return `${styles.container} ${styles.highlighted} ${styles.fadeIn}`;
      case 'visible':
        return `${styles.container} ${styles.highlighted} ${styles.visible}`;
      case 'fade-out':
        return `${styles.container} ${styles.highlighted} ${styles.fadeOut}`;
      default:
        return `${styles.container} ${styles.highlighted}`;
    }
  };

  return (
    <div className={getHighlightClasses()}>
      <div className={styles.header}>
        <h3 className={styles.title}>{subProgram.title}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onDeleteSubProgram(subProgram.id)}
          className={styles.deleteButton}
        >
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
      
      <div className={styles.grid}>
        {/* Sub-Program Title */}
        <div className={styles.field}>
          <Label className={styles.label}>Sub-program title</Label>
          <Input
            value={subProgram.title}
            onChange={(e) => onSubProgramChange(subProgram.id, 'title', e.target.value)}
            placeholder="Enter sub-program title"
            className={styles.input}
          />
        </div>

        {/* Sub-Program Banner Upload */}
        <div className={styles.field}>
          <Label className={styles.label}>Upload sub-program banner</Label>
          <div className={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onSubProgramBannerUpload(subProgram.id, e.target.files?.[0] || null)}
              className={styles.hiddenInput}
              id={`banner-upload-${subProgram.id}`}
            />
            <label htmlFor={`banner-upload-${subProgram.id}`} className={styles.uploadLabel}>
              <Upload className={styles.uploadIcon} />
              <p className={styles.uploadText}>
                {subProgram.banner ? subProgram.banner.name : (uploadedBanner ? `Using: ${uploadedBanner.name}` : "Click to upload")}
              </p>
              <p className={styles.uploadSubtext}>PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        </div>

        {/* Sub-Program Description */}
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <Label className={styles.label}>Tell us about this sub-program</Label>
          <Textarea 
            value={subProgram.description}
            onChange={(e) => onSubProgramChange(subProgram.id, 'description', e.target.value)}
            placeholder={programDescription ? `Pre-filled: ${programDescription.slice(0, 50)}...` : "Describe this sub-program..."}
            className={styles.textarea}
          />
        </div>

        {/* Sub-Program Start Date */}
        <div className={styles.dateField}>
          <Label className={styles.label}>Sub-program start date</Label>
          <Calendar
            mode="single"
            selected={subProgram.startDate || undefined}
            onSelect={(date) => onSubProgramChange(subProgram.id, 'startDate', date)}
            disabled={(date) => !isDateWithinProgramRange(date)}
            className={styles.calendar}
          />
          {startDate && endDate && (
            <p className={styles.dateHint}>Must be between {format(startDate, "PPP")} and {format(endDate, "PPP")}</p>
          )}
        </div>

        {/* Sub-Program End Date */}
        <div className={styles.dateField}>
          <Label className={styles.label}>Sub-program end date</Label>
          <Calendar
            mode="single"
            selected={subProgram.endDate || undefined}
            onSelect={(date) => onSubProgramChange(subProgram.id, 'endDate', date)}
            disabled={(date) => 
              !isDateWithinProgramRange(date) || 
              (subProgram.startDate && date < subProgram.startDate)
            }
            className={styles.calendar}
          />
        </div>

        {/* Mode of Sub-Program */}
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <Label className={styles.label}>How will this sub-program be delivered?</Label>
          <RadioGroup
            value={subProgram.modeOfProgram}
            onValueChange={(value) => onSubProgramChange(subProgram.id, 'modeOfProgram', value as 'online' | 'offline' | 'hybrid')}
            className={styles.radioGroup}
          >
            <div className={styles.radioItem}>
              <RadioGroupItem value="online" id={`online-${subProgram.id}`} className={styles.radioButton} />
              <Label htmlFor={`online-${subProgram.id}`} className={styles.radioLabel}>Online</Label>
            </div>
            <div className={styles.radioItem}>
              <RadioGroupItem value="offline" id={`offline-${subProgram.id}`} className={styles.radioButton} />
              <Label htmlFor={`offline-${subProgram.id}`} className={styles.radioLabel}>In-person</Label>
            </div>
            <div className={styles.radioItem}>
              <RadioGroupItem value="hybrid" id={`hybrid-${subProgram.id}`} className={styles.radioButton} />
              <Label htmlFor={`hybrid-${subProgram.id}`} className={styles.radioLabel}>Hybrid</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Conditional Fields - Venue Address */}
        <div className={cn(
          styles.venueSection,
          (subProgram.modeOfProgram === 'offline' || subProgram.modeOfProgram === 'hybrid') 
            ? styles.visible : styles.hidden
        )}>
          <div className={styles.venueFields}>
            <div className={styles.field}>
              <Label className={styles.label}>Where will this sub-program take place?</Label>
              <Select onValueChange={(value) => onSubProgramVenueChange(subProgram.id, [...subProgram.venueAddress, value])}>
                <SelectTrigger className={styles.select}>
                  <SelectValue placeholder="Select venue(s)" />
                </SelectTrigger>
                <SelectContent>
                  {venueOptions.map((venue) => (
                    <SelectItem key={venue} value={venue} className={styles.selectItem}>
                      {venue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {subProgram.venueAddress && subProgram.venueAddress.length > 0 && (
                <div className={styles.venueTags}>
                  {subProgram.venueAddress.map((venue, index) => (
                    <span key={index} className={styles.venueTag}>
                      {venue}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Venue Input */}
            <div className={cn(
              styles.customVenueField,
              subProgram.showCustomVenue ? styles.visible : styles.hidden
            )}>
              <div className={styles.field}>
                <Label className={styles.label}>Add your custom venue</Label>
                <Input 
                  value={subProgram.customVenue}
                  onChange={(e) => onSubProgramChange(subProgram.id, 'customVenue', e.target.value)}
                  placeholder="Enter venue address" 
                  className={styles.input}
                />
              </div>
            </div>

            {/* Travel Required */}
            <div className={styles.field}>
              <Label className={styles.label}>Will participants need to travel?</Label>
              <RadioGroup
                value={subProgram.isTravelRequired}
                onValueChange={(value) => onSubProgramChange(subProgram.id, 'isTravelRequired', value as 'yes' | 'no')}
                className={styles.radioGroup}
              >
                <div className={styles.radioItem}>
                  <RadioGroupItem value="yes" id={`travel-yes-${subProgram.id}`} className={styles.radioButton} />
                  <Label htmlFor={`travel-yes-${subProgram.id}`} className={styles.radioLabel}>Yes</Label>
                </div>
                <div className={styles.radioItem}>
                  <RadioGroupItem value="no" id={`travel-no-${subProgram.id}`} className={styles.radioButton} />
                  <Label htmlFor={`travel-no-${subProgram.id}`} className={styles.radioLabel}>No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Residential */}
            <div className={styles.field}>
              <Label className={styles.label}>Is this a residential sub-program?</Label>
              <RadioGroup
                value={subProgram.isResidential}
                onValueChange={(value) => onSubProgramChange(subProgram.id, 'isResidential', value as 'yes' | 'no')}
                className={styles.radioGroup}
              >
                <div className={styles.radioItem}>
                  <RadioGroupItem value="yes" id={`residential-yes-${subProgram.id}`} className={styles.radioButton} />
                  <Label htmlFor={`residential-yes-${subProgram.id}`} className={styles.radioLabel}>Yes</Label>
                </div>
                <div className={styles.radioItem}>
                  <RadioGroupItem value="no" id={`residential-no-${subProgram.id}`} className={styles.radioButton} />
                  <Label htmlFor={`residential-no-${subProgram.id}`} className={styles.radioLabel}>No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Payment Required */}
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <Label className={styles.label}>Is there a fee for this sub-program?</Label>
          <RadioGroup
            value={subProgram.isPaymentRequired}
            onValueChange={(value) => onSubProgramChange(subProgram.id, 'isPaymentRequired', value as 'yes' | 'no')}
            className={styles.radioGroup}
          >
            <div className={styles.radioItem}>
              <RadioGroupItem value="yes" id={`payment-yes-${subProgram.id}`} className={styles.radioButton} />
              <Label htmlFor={`payment-yes-${subProgram.id}`} className={styles.radioLabel}>Yes</Label>
            </div>
            <div className={styles.radioItem}>
              <RadioGroupItem value="no" id={`payment-no-${subProgram.id}`} className={styles.radioButton} />
              <Label htmlFor={`payment-no-${subProgram.id}`} className={styles.radioLabel}>No, it's free</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Currency and Fee - Conditional */}
        <div className={cn(
          styles.paymentSection,
          subProgram.isPaymentRequired === 'yes' ? styles.visible : styles.hidden
        )}>
          <div className={styles.field}>
            <Label className={styles.label}>What currency will you use?</Label>
            <Select 
              value={subProgram.currency} 
              onValueChange={(value) => onSubProgramChange(subProgram.id, 'currency', value)}
            >
              <SelectTrigger className={styles.select}>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value} className={styles.selectItem}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={styles.field}>
            <Label className={styles.label}>What's the sub-program fee?</Label>
            <div className={styles.currencyInput}>
              <span className={styles.currencySymbol}>
                {getCurrencySymbol(subProgram.currency || 'INR')}
              </span>
              <Input 
                value={subProgram.programFee}
                onChange={(e) => onSubProgramChange(subProgram.id, 'programFee', e.target.value)}
                placeholder="0.00" 
                className={styles.feeInput}
                type="number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProgramCard;
