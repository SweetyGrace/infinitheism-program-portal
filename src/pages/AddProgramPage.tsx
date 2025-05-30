
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/DateRangePicker';
import { AddFieldDialog, CustomField } from '@/components/AddFieldDialog';
import { CustomFieldRenderer } from '@/components/CustomFieldRenderer';
import { DeleteSubProgramDialog } from '@/components/DeleteSubProgramDialog';

interface SubProgram {
  id: string;
  title: string;
  description: string;
  dateRange: DateRange | undefined;
  fee: string;
  customFields: Record<string, any>;
}

interface ProgramData {
  title: string;
  description: string;
  dateRange: DateRange | undefined;
  hdbFee: string;
  msdFee: string;
  customFields: Record<string, any>;
}

const AddProgramPage = () => {
  const navigate = useNavigate();
  
  // Main program data
  const [programData, setProgramData] = useState<ProgramData>({
    title: '',
    description: '',
    dateRange: undefined,
    hdbFee: '',
    msdFee: '',
    customFields: {},
  });

  // Custom fields for program and sub-programs
  const [programCustomFields, setProgramCustomFields] = useState<CustomField[]>([]);
  const [subProgramCustomFields, setSubProgramCustomFields] = useState<CustomField[]>([]);

  // Sub-programs with default ones
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([
    { id: '1', title: 'HDB 1', description: '', dateRange: undefined, fee: '', customFields: {} },
    { id: '2', title: 'HDB 2', description: '', dateRange: undefined, fee: '', customFields: {} },
    { id: '3', title: 'HDB 3', description: '', dateRange: undefined, fee: '', customFields: {} },
    { id: '4', title: 'MSD 1', description: '', dateRange: undefined, fee: '', customFields: {} },
    { id: '5', title: 'MSD 2', description: '', dateRange: undefined, fee: '', customFields: {} },
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
  };

  const updateSubProgram = (id: string, field: keyof SubProgram, value: any) => {
    setSubPrograms(prev => prev.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const handleAddField = (field: CustomField, applyToSubPrograms?: boolean) => {
    if (addFieldDialog.isSubProgram) {
      // Add field to specific sub-program
      setSubProgramCustomFields(prev => [...prev, field]);
      setSubPrograms(prev => prev.map(sub => 
        sub.id === addFieldDialog.subProgramId 
          ? { ...sub, customFields: { ...sub.customFields, [field.id]: field.defaultValue || '' } }
          : sub
      ));
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

  const openDeleteDialog = (id: string, title: string) => {
    setDeleteDialog({ isOpen: true, subProgramId: id, subProgramTitle: title });
  };

  const isDateRangeValid = (subDateRange: DateRange | undefined) => {
    if (!programData.dateRange?.from || !programData.dateRange?.to || !subDateRange?.from || !subDateRange?.to) {
      return true; // Allow if not fully set
    }
    return subDateRange.from >= programData.dateRange.from && subDateRange.to <= programData.dateRange.to;
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

              <div>
                <DateRangePicker
                  value={programData.dateRange}
                  onChange={(range) => updateProgramData('dateRange', range)}
                  label="Program Duration *"
                />
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAddFieldDialog({ isOpen: true, isSubProgram: true, subProgramId: '' })}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field to All</span>
              </Button>
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
                      <Label>Description</Label>
                      <Textarea
                        value={subProgram.description}
                        onChange={(e) => updateSubProgram(subProgram.id, 'description', e.target.value)}
                        placeholder="Enter sub-program description"
                        className="min-h-[80px] resize-none"
                      />
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

                    <DateRangePicker
                      value={subProgram.dateRange}
                      onChange={(range) => updateSubProgram(subProgram.id, 'dateRange', range)}
                      label="Sub-Program Duration"
                      minDate={programData.dateRange?.from}
                      maxDate={programData.dateRange?.to}
                      disabled={!programData.dateRange?.from || !programData.dateRange?.to}
                    />

                    {!isDateRangeValid(subProgram.dateRange) && (
                      <p className="text-red-500 text-sm">
                        Sub-program dates must be within the program duration.
                      </p>
                    )}

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
