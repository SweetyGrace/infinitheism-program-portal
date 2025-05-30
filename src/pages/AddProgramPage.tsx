
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/DateRangePicker';
import { AddFieldDialog, CustomField } from '@/components/AddFieldDialog';
import { CustomFieldRenderer } from '@/components/CustomFieldRenderer';
import { DeleteSubProgramDialog } from '@/components/DeleteSubProgramDialog';

interface SubProgram {
  id: string;
  title: string;
  banner: string;
  description: string;
  dateRange: DateRange | undefined;
  mode: 'online' | 'offline' | 'hybrid' | '';
  fee: string;
  paymentMethod: string;
  customFields: Record<string, any>;
}

interface ProgramData {
  title: string;
  banner: string;
  description: string;
  hdbFee: string;
  msdFee: string;
  customFields: Record<string, any>;
}

const AddProgramPage = () => {
  const navigate = useNavigate();
  
  // Main program data
  const [programData, setProgramData] = useState<ProgramData>({
    title: '',
    banner: '',
    description: '',
    hdbFee: '',
    msdFee: '',
    customFields: {},
  });

  // Custom fields for program and sub-programs
  const [programCustomFields, setProgramCustomFields] = useState<CustomField[]>([]);
  const [subProgramCustomFields, setSubProgramCustomFields] = useState<CustomField[]>([]);

  // Sub-programs with default ones
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([
    { id: '1', title: 'HDB 1', banner: '', description: '', dateRange: undefined, mode: '', fee: '', paymentMethod: '', customFields: {} },
    { id: '2', title: 'HDB 2', banner: '', description: '', dateRange: undefined, mode: '', fee: '', paymentMethod: '', customFields: {} },
    { id: '3', title: 'HDB 3', banner: '', description: '', dateRange: undefined, mode: '', fee: '', paymentMethod: '', customFields: {} },
    { id: '4', title: 'MSD 1', banner: '', description: '', dateRange: undefined, mode: '', fee: '', paymentMethod: '', customFields: {} },
    { id: '5', title: 'MSD 2', banner: '', description: '', dateRange: undefined, mode: '', fee: '', paymentMethod: '', customFields: {} },
  ]);

  // Dialog states
  const [addFieldDialog, setAddFieldDialog] = useState({ isOpen: false, isSubProgram: false, subProgramId: '' });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, subProgramId: '', subProgramTitle: '' });

  const updateProgramData = (field: keyof ProgramData, value: any) => {
    setProgramData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill sub-program fees when program fees change
    if (field === 'hdbFee' || field === 'msdFee') {
      setSubPrograms(prev => prev.map(sub => {
        if (field === 'hdbFee' && sub.title.toLowerCase().includes('hdb')) {
          return { ...sub, fee: value };
        }
        if (field === 'msdFee' && sub.title.toLowerCase().includes('msd')) {
          return { ...sub, fee: value };
        }
        return sub;
      }));
    }

    // Auto-fill banner and description to all sub-programs
    if (field === 'banner' || field === 'description') {
      setSubPrograms(prev => prev.map(sub => ({
        ...sub,
        [field]: value
      })));
    }
  };

  const updateSubProgram = (id: string, field: keyof SubProgram, value: any) => {
    setSubPrograms(prev => prev.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const handleAddField = (field: CustomField, applyToSubPrograms?: boolean) => {
    if (addFieldDialog.isSubProgram) {
      // Add field to specific sub-program or all sub-programs
      if (addFieldDialog.subProgramId) {
        // Add to specific sub-program
        setSubProgramCustomFields(prev => [...prev, field]);
        setSubPrograms(prev => prev.map(sub => 
          sub.id === addFieldDialog.subProgramId 
            ? { ...sub, customFields: { ...sub.customFields, [field.id]: field.defaultValue || '' } }
            : sub
        ));
      } else {
        // Add to all sub-programs
        setSubProgramCustomFields(prev => [...prev, field]);
        setSubPrograms(prev => prev.map(sub => ({
          ...sub,
          customFields: { ...sub.customFields, [field.id]: field.defaultValue || '' }
        })));
      }
    } else {
      // Add field to program
      setProgramCustomFields(prev => [...prev, field]);
      setProgramData(prev => ({ 
        ...prev, 
        customFields: { ...prev.customFields, [field.id]: field.defaultValue || '' } 
      }));

      // Apply to all sub-programs if requested
      if (applyToSubPrograms) {
        setSubPrograms(prev => prev.map(sub => ({
          ...sub,
          customFields: { ...sub.customFields, [field.id]: field.defaultValue || '' }
        })));
      }
    }
  };

  const handleDeleteSubProgram = (id: string) => {
    setSubPrograms(prev => prev.filter(sub => sub.id !== id));
    setDeleteDialog({ isOpen: false, subProgramId: '', subProgramTitle: '' });
    toast({ title: "Sub-program deleted successfully" });
  };

  const handleAddSubProgram = () => {
    const newSubProgram: SubProgram = {
      id: Date.now().toString(),
      title: `Sub Program ${subPrograms.length + 1}`,
      banner: programData.banner, // Pre-fill from program
      description: programData.description, // Pre-fill from program
      dateRange: undefined,
      mode: '',
      fee: '',
      paymentMethod: '',
      customFields: {}
    };

    // Add any existing custom fields
    subProgramCustomFields.forEach(field => {
      newSubProgram.customFields[field.id] = field.defaultValue || '';
    });

    setSubPrograms(prev => [...prev, newSubProgram]);
    toast({ title: "Sub-program added successfully" });
  };

  const openDeleteDialog = (id: string, title: string) => {
    setDeleteDialog({ isOpen: true, subProgramId: id, subProgramTitle: title });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>, isSubProgram: boolean = false, subProgramId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (isSubProgram && subProgramId) {
          updateSubProgram(subProgramId, 'banner', result);
        } else {
          updateProgramData('banner', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!programData.title || !programData.description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    console.log('Saving program data:', { programData, subPrograms, programCustomFields, subProgramCustomFields });
    toast({ title: "Program saved successfully!" });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Add New Program</h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Program</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Program Details */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-900">Program Details</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAddFieldDialog({ isOpen: true, isSubProgram: false, subProgramId: '' })}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Program Title *</Label>
                  <Input
                    id="title"
                    value={programData.title}
                    onChange={(e) => updateProgramData('title', e.target.value)}
                    placeholder="Enter program title"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Program Description *</Label>
                  <Textarea
                    id="description"
                    value={programData.description}
                    onChange={(e) => updateProgramData('description', e.target.value)}
                    placeholder="Enter program description"
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="banner">Program Banner</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBannerUpload(e)}
                      className="h-11"
                    />
                    {programData.banner && (
                      <img src={programData.banner} alt="Banner preview" className="w-16 h-16 object-cover rounded" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hdbFee">HDB Program Fee</Label>
                    <Input
                      id="hdbFee"
                      type="number"
                      value={programData.hdbFee}
                      onChange={(e) => updateProgramData('hdbFee', e.target.value)}
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="msdFee">MSD Program Fee</Label>
                    <Input
                      id="msdFee"
                      type="number"
                      value={programData.msdFee}
                      onChange={(e) => updateProgramData('msdFee', e.target.value)}
                      placeholder="0.00"
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Render Program Custom Fields */}
                {programCustomFields.map((field) => (
                  <CustomFieldRenderer
                    key={field.id}
                    field={field}
                    value={programData.customFields[field.id]}
                    onChange={(value) => setProgramData(prev => ({
                      ...prev,
                      customFields: { ...prev.customFields, [field.id]: value }
                    }))}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sub-Programs Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-gray-900">Sub-Program Configuration</CardTitle>
                <p className="text-gray-600 mt-1">Configure individual sub-programs within this program.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAddFieldDialog({ isOpen: true, isSubProgram: true, subProgramId: '' })}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Field to All</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleAddSubProgram}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Sub Program</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {subPrograms.map((subProgram) => (
                <Card key={subProgram.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-800">{subProgram.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setAddFieldDialog({ isOpen: true, isSubProgram: true, subProgramId: subProgram.id })}
                          className="flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Field</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(subProgram.id, subProgram.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={subProgram.title}
                        onChange={(e) => updateSubProgram(subProgram.id, 'title', e.target.value)}
                        placeholder="Enter sub-program title"
                        className="h-10"
                      />
                    </div>

                    <div>
                      <Label>Banner</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBannerUpload(e, true, subProgram.id)}
                          className="h-10"
                        />
                        {subProgram.banner && (
                          <img src={subProgram.banner} alt="Banner preview" className="w-12 h-12 object-cover rounded" />
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={subProgram.description}
                        onChange={(e) => updateSubProgram(subProgram.id, 'description', e.target.value)}
                        placeholder="Enter sub-program description"
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <DateRangePicker
                      value={subProgram.dateRange}
                      onChange={(range) => updateSubProgram(subProgram.id, 'dateRange', range)}
                      label="Sub-Program Duration"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Mode</Label>
                        <Select value={subProgram.mode} onValueChange={(value: 'online' | 'offline' | 'hybrid') => updateSubProgram(subProgram.id, 'mode', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select mode" />
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
                          type="number"
                          value={subProgram.fee}
                          onChange={(e) => updateSubProgram(subProgram.id, 'fee', e.target.value)}
                          placeholder="0.00"
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <Input
                        value={subProgram.paymentMethod}
                        onChange={(e) => updateSubProgram(subProgram.id, 'paymentMethod', e.target.value)}
                        placeholder="Enter payment method"
                        className="h-10"
                      />
                    </div>

                    {/* Render Sub-Program Custom Fields */}
                    {subProgramCustomFields.map((field) => (
                      <CustomFieldRenderer
                        key={field.id}
                        field={field}
                        value={subProgram.customFields[field.id]}
                        onChange={(value) => updateSubProgram(subProgram.id, 'customFields', {
                          ...subProgram.customFields,
                          [field.id]: value
                        })}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Field Dialog */}
      <AddFieldDialog
        isOpen={addFieldDialog.isOpen}
        onClose={() => setAddFieldDialog({ isOpen: false, isSubProgram: false, subProgramId: '' })}
        onSave={handleAddField}
        isSubProgram={addFieldDialog.isSubProgram}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteSubProgramDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, subProgramId: '', subProgramTitle: '' })}
        onConfirm={() => handleDeleteSubProgram(deleteDialog.subProgramId)}
        subProgramTitle={deleteDialog.subProgramTitle}
      />
    </div>
  );
};

export default AddProgramPage;
