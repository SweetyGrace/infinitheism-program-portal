import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { AddFieldDialog, CustomField } from '@/components/AddFieldDialog';
import { CustomFieldRenderer } from '@/components/CustomFieldRenderer';
import { SubProgramTypeDialog } from '@/components/SubProgramTypeDialog';

interface SubProgram {
  id: string;
  title: string;
  type: 'HDB' | 'MSD';
  banner: string;
  description: string;
  dateRange: DateRange | undefined;
  mode: 'online' | 'offline' | 'hybrid';
  fee: string;
  paymentMethod: string;
  customFields: Record<string, any>;
}

const AddProgramPage = () => {
  const navigate = useNavigate();
  
  // Program-level state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState('');
  const [hdbFee, setHdbFee] = useState('');
  const [msdFee, setMsdFee] = useState('');
  const [programCustomFields, setProgramCustomFields] = useState<CustomField[]>([]);
  const [programCustomFieldValues, setProgramCustomFieldValues] = useState<Record<string, any>>({});

  // Sub-programs state
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([
    {
      id: 'hdb1',
      title: 'HDB 1',
      type: 'HDB',
      banner: '',
      description: '',
      dateRange: undefined,
      mode: 'online',
      fee: '',
      paymentMethod: '',
      customFields: {}
    },
    {
      id: 'hdb2',
      title: 'HDB 2',
      type: 'HDB',
      banner: '',
      description: '',
      dateRange: undefined,
      mode: 'online',
      fee: '',
      paymentMethod: '',
      customFields: {}
    },
    {
      id: 'hdb3',
      title: 'HDB 3',
      type: 'HDB',
      banner: '',
      description: '',
      dateRange: undefined,
      mode: 'online',
      fee: '',
      paymentMethod: '',
      customFields: {}
    },
    {
      id: 'msd1',
      title: 'MSD 1',
      type: 'MSD',
      banner: '',
      description: '',
      dateRange: undefined,
      mode: 'online',
      fee: '',
      paymentMethod: '',
      customFields: {}
    },
    {
      id: 'msd2',
      title: 'MSD 2',
      type: 'MSD',
      banner: '',
      description: '',
      dateRange: undefined,
      mode: 'online',
      fee: '',
      paymentMethod: '',
      customFields: {}
    }
  ]);

  const [subProgramCustomFields, setSubProgramCustomFields] = useState<Record<string, CustomField[]>>({});

  // Dialog states
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [isSubProgramTypeDialogOpen, setIsSubProgramTypeDialogOpen] = useState(false);
  const [activeSubProgramForField, setActiveSubProgramForField] = useState<string | null>(null);

  // Pre-fill logic for banner and description
  React.useEffect(() => {
    // Pre-fill banner to all sub-programs
    setSubPrograms(prev => prev.map(subProgram => ({
      ...subProgram,
      banner: banner
    })));

    // Pre-fill description to all sub-programs
    setSubPrograms(prev => prev.map(subProgram => ({
      ...subProgram,
      description: description
    })));
  }, [banner, description]);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBanner = e.target.value;
    setBanner(newBanner);
    
    // Pre-fill banner to all sub-programs
    setSubPrograms(prev => prev.map(subProgram => ({
      ...subProgram,
      banner: subProgram.banner || newBanner
    })));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    
    // Pre-fill description to all sub-programs
    setSubPrograms(prev => prev.map(subProgram => ({
      ...subProgram,
      description: subProgram.description || newDescription
    })));
  };

  const handleHdbFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFee = e.target.value;
    setHdbFee(newFee);
    
    // Pre-fill fee to HDB sub-programs
    setSubPrograms(prev => prev.map(subProgram => ({
      ...subProgram,
      fee: subProgram.type === 'HDB' ? newFee : subProgram.fee
    })));
  };

  const handleMsdFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFee = e.target.value;
    setMsdFee(newFee);
    
    // Pre-fill fee to MSD sub-programs
    setSubPrograms(prev => prev.map(subProgram => ({
      ...subProgram,
      fee: subProgram.type === 'MSD' ? newFee : subProgram.fee
    })));
  };

  // Custom fields handlers
  const handleAddProgramField = (field: CustomField, applyToSubPrograms?: boolean) => {
    setProgramCustomFields(prev => [...prev, field]);
    
    if (applyToSubPrograms) {
      // Add this field to all sub-programs
      const updatedSubProgramFields = { ...subProgramCustomFields };
      subPrograms.forEach(subProgram => {
        if (!updatedSubProgramFields[subProgram.id]) {
          updatedSubProgramFields[subProgram.id] = [];
        }
        updatedSubProgramFields[subProgram.id].push(field);
      });
      setSubProgramCustomFields(updatedSubProgramFields);
    }
  };

  const handleAddSubProgramField = (field: CustomField) => {
    if (activeSubProgramForField) {
      setSubProgramCustomFields(prev => ({
        ...prev,
        [activeSubProgramForField]: [...(prev[activeSubProgramForField] || []), field]
      }));
    }
  };

  // Sub-program handlers
  const updateSubProgram = (id: string, updates: Partial<SubProgram>) => {
    setSubPrograms(prev => prev.map(subProgram => 
      subProgram.id === id ? { ...subProgram, ...updates } : subProgram
    ));
  };

  const getNextSubProgramNumber = (type: 'HDB' | 'MSD') => {
    const existingNumbers = subPrograms
      .filter(sp => sp.type === type)
      .map(sp => parseInt(sp.title.split(' ')[1]))
      .filter(num => !isNaN(num));
    
    return Math.max(...existingNumbers, 0) + 1;
  };

  const handleAddSubProgram = (type: 'HDB' | 'MSD') => {
    const nextNumber = getNextSubProgramNumber(type);
    const newSubProgram: SubProgram = {
      id: `${type.toLowerCase()}${Date.now()}`,
      title: `${type} ${nextNumber}`,
      type,
      banner: banner, // Pre-fill from program
      description: description, // Pre-fill from program
      dateRange: undefined,
      mode: 'online',
      fee: type === 'HDB' ? hdbFee : msdFee, // Pre-fill appropriate fee
      paymentMethod: '',
      customFields: {}
    };

    setSubPrograms(prev => [...prev, newSubProgram]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Program Data:', {
      title,
      description,
      banner,
      hdbFee,
      msdFee,
      programCustomFields: programCustomFieldValues,
      subPrograms: subPrograms.map(sp => ({
        ...sp,
        customFields: sp.customFields
      }))
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Program</h1>
          <p className="text-gray-600">Fill in the details for your new program and configure sub-programs.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Program Details Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Program Details</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveSubProgramForField(null);
                  setIsAddFieldDialogOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Program Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter program title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter program description"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="banner">Banner Image URL</Label>
                <Input
                  id="banner"
                  type="url"
                  value={banner}
                  onChange={handleBannerChange}
                  placeholder="Enter banner image URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hdb-fee">HDB Fee</Label>
                  <Input
                    id="hdb-fee"
                    value={hdbFee}
                    onChange={handleHdbFeeChange}
                    placeholder="Enter HDB fee"
                  />
                </div>
                <div>
                  <Label htmlFor="msd-fee">MSD Fee</Label>
                  <Input
                    id="msd-fee"
                    value={msdFee}
                    onChange={handleMsdFeeChange}
                    placeholder="Enter MSD fee"
                  />
                </div>
              </div>

              {/* Program Custom Fields */}
              {programCustomFields.map((field) => (
                <CustomFieldRenderer
                  key={field.id}
                  field={field}
                  value={programCustomFieldValues[field.id]}
                  onChange={(value) => setProgramCustomFieldValues(prev => ({
                    ...prev,
                    [field.id]: value
                  }))}
                />
              ))}
            </CardContent>
          </Card>

          {/* Sub-Programs Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sub-Programs</CardTitle>
              <Button
                type="button"
                onClick={() => setIsSubProgramTypeDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Sub-Program
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {subPrograms.map((subProgram) => (
                <div key={subProgram.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{subProgram.title}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveSubProgramForField(subProgram.id);
                        setIsAddFieldDialogOpen(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Field
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Banner Image URL</Label>
                      <Input
                        value={subProgram.banner}
                        onChange={(e) => updateSubProgram(subProgram.id, { banner: e.target.value })}
                        placeholder="Banner URL"
                      />
                    </div>

                    <div>
                      <Label>Mode</Label>
                      <Select
                        value={subProgram.mode}
                        onValueChange={(value: 'online' | 'offline' | 'hybrid') => 
                          updateSubProgram(subProgram.id, { mode: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Fee</Label>
                      <Input
                        value={subProgram.fee}
                        onChange={(e) => updateSubProgram(subProgram.id, { fee: e.target.value })}
                        placeholder="Enter fee"
                      />
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <Input
                        value={subProgram.paymentMethod}
                        onChange={(e) => updateSubProgram(subProgram.id, { paymentMethod: e.target.value })}
                        placeholder="Enter payment method"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={subProgram.description}
                      onChange={(e) => updateSubProgram(subProgram.id, { description: e.target.value })}
                      placeholder="Enter description"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>Date Range</Label>
                    <DatePickerWithRange
                      date={subProgram.dateRange}
                      onDateChange={(dateRange) => updateSubProgram(subProgram.id, { dateRange })}
                    />
                  </div>

                  {/* Sub-Program Custom Fields */}
                  {(subProgramCustomFields[subProgram.id] || []).map((field) => (
                    <CustomFieldRenderer
                      key={field.id}
                      field={field}
                      value={subProgram.customFields[field.id]}
                      onChange={(value) => updateSubProgram(subProgram.id, {
                        customFields: { ...subProgram.customFields, [field.id]: value }
                      })}
                    />
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit">Create Program</Button>
          </div>
        </form>

        {/* Dialogs */}
        <AddFieldDialog
          isOpen={isAddFieldDialogOpen}
          onClose={() => {
            setIsAddFieldDialogOpen(false);
            setActiveSubProgramForField(null);
          }}
          onSave={activeSubProgramForField ? handleAddSubProgramField : handleAddProgramField}
          isSubProgram={!!activeSubProgramForField}
        />

        <SubProgramTypeDialog
          isOpen={isSubProgramTypeDialogOpen}
          onClose={() => setIsSubProgramTypeDialogOpen(false)}
          onSelect={handleAddSubProgram}
        />
      </div>
    </div>
  );
};

export default AddProgramPage;
