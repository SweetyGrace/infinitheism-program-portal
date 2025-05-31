
import { SubProgram, CurrencyOption } from '../types/program';

export const venueOptions = [
  'Leonia Holistic Destination, Bommarasipet, Shamirpet Mandal, Medchal-Malkajgiri District, Hyderabad - 500078',
  'ITC Kohenur, Hyderabad',
  'Marriott Hotel, Bangalore',
  'Add Custom Venue'
];

export const currencyOptions: CurrencyOption[] = [
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'SGD', label: 'SGD (S$)', symbol: 'S$' },
];

export const getCurrencySymbol = (currency: string) => {
  return currencyOptions.find(c => c.value === currency)?.symbol || '₹';
};

export const getInitialSubPrograms = (): SubProgram[] => [
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
];

export const prefillSubProgramFields = (
  subProgram: SubProgram,
  programDescription: string,
  uploadedBanner: File | null,
  modeOfProgram: 'online' | 'offline' | 'hybrid',
  selectedCurrency: string,
  isPaymentRequired: 'yes' | 'no'
): SubProgram => {
  return {
    ...subProgram,
    description: subProgram.description || programDescription || '',
    banner: subProgram.banner || uploadedBanner,
    modeOfProgram: subProgram.modeOfProgram || modeOfProgram || 'online',
    currency: subProgram.currency || selectedCurrency || 'INR',
    isPaymentRequired: subProgram.isPaymentRequired || isPaymentRequired || 'yes',
  };
};
