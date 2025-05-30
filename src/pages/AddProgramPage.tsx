import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, User, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Sidebar from '../components/Sidebar';

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
}

const AddProgramPage = () => {
  const activeTab = 'programs';
  const setActiveTab = () => {};
  const navigate = useNavigate();
  const subProgramRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const [programFields, setProgramFields] = useState<FormField[]>([
    { id: '1', label: 'Program Name', type: 'text', value: 'HDB - 25', isRemovable: false },
    { id: '2', label: 'Description', type: 'textarea', value: '', isRemovable: false },
    { id: '3', label: 'Start Date', type: 'date', value: '', isRemovable: false },
    { id: '4', label: 'End Date', type: 'date', value: '', isRemovable: false },
  ]);

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

  // Get program name for breadcrumb
  const programName = programFields.find(field => field.label === 'Program Name')?.value || 'HDB - 25';

  useEffect(() => {
    // Clear highlight after 1.5 seconds
    const timer = setTimeout(() => {
      setSubPrograms(prev => prev.map(sp => ({ ...sp, isHighlighted: false })));
    }, 1500);

    return () => clearTimeout(timer);
  }, [subPrograms]);

  const handleAddField = (section: 'program' | string) => {
    setFieldTargetSection(section);
    setNewFieldLabel('');
    setNewFieldType('text');
    setNewFieldOptions(['']);
    setNewFieldIsMultiSelect(false);
    setIsAddFieldDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!newFieldLabel.trim()) return;

    const newField: FormField = {
      id: Date.now().toString(),
      label: newFieldLabel,
      type: newFieldType,
      value: '',
      isRemovable: true,
      ...(newFieldType === 'dropdown' && {
        options: newFieldOptions.filter(opt => opt.trim() !== ''),
        isMultiSelect: newFieldIsMultiSelect,
      }),
    };

    if (fieldTargetSection === 'program') {
      setProgramFields(prev => [...prev, newField]);
    } else {
      setSubPrograms(prev => prev.map(sp => 
        sp.id === fieldTargetSection 
          ? { ...sp, fields: [...sp.fields, newField] }
          : sp
      ));
    }

    setIsAddFieldDialogOpen(false);
  };

  const handleRemoveField = (fieldId: string, section: 'program' | string) => {
    if (section === 'program') {
      setProgramFields(prev => prev.filter(field => field.id !== fieldId));
    } else {
      setSubPrograms(prev => prev.map(sp => 
        sp.id === section 
          ? { ...sp, fields: sp.fields.filter(field => field.id !== fieldId) }
          : sp
      ));
    }
  };

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
    
    // Scroll to new subprogram after state update
    setTimeout(() => {
      const element = subProgramRefs.current[newSubProgram.id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleFieldValueChange = (fieldId: string, value: string, section: 'program' | string) => {
    if (section === 'program') {
      setProgramFields(prev => prev.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ));
    } else {
      setSubPrograms(prev => prev.map(sp => 
        sp.id === section 
          ? { ...sp, fields: sp.fields.map(field => 
              field.id === fieldId ? { ...field, value } : field
            )}
          : sp
      ));
    }
  };

  const handleSave = () => {
    console.log('Saving program...', { programFields, subPrograms });
    // Add save logic here
  };

  const handleCancel = () => {
    navigate('/choose-program');
  };

  const addOption = () => {
    setNewFieldOptions(prev => [...prev, '']);
  };

  const updateOption = (index: number, value: string) => {
    setNewFieldOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };

  const removeOption = (index: number) => {
    if (newFieldOptions.length > 1) {
      setNewFieldOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const renderField = (field: FormField, section: 'program' | string) => (
    <div key={field.id} className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field.id}>{field.label}</Label>
        {field.isRemovable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveField(field.id, section)}
            className="h-6 w-6 text-gray-400 hover:text-red-500"
          >
            <X size={14} />
          </Button>
        )}
      </div>
      {field.type === 'textarea' ? (
        <Textarea
          id={field.id}
          value={field.value}
          onChange={(e) => handleFieldValueChange(field.id, e.target.value, section)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      ) : field.type === 'dropdown' ? (
        <Select 
          value={field.value} 
          onValueChange={(value) => handleFieldValueChange(field.id, value, section)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={field.id}
          type={field.type}
          value={field.value}
          onChange={(e) => handleFieldValueChange(field.id, e.target.value, section)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      )}
    </div>
  );

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

            {/* Form */}
            <div className="space-y-12">
              {/* Program Details Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-gray-800">Program Details</h2>
                  <Button
                    variant="outline"
                    onClick={() => handleAddField('program')}
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Field
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programFields.map(field => renderField(field, 'program'))}
                </div>
              </div>

              {/* Sub-Program Details Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-gray-800">Sub-Program Details</h2>
                  <Button
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
                      className={`border rounded-lg p-4 transition-all duration-500 ease-in-out ${
                        subProgram.isHighlighted 
                          ? 'border-blue-500 border-2 shadow-lg bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-700">{subProgram.name}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddField(subProgram.id)}
                          className="flex items-center gap-2"
                        >
                          <Plus size={14} />
                          Add Field
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subProgram.fields.map(field => renderField(field, subProgram.id))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end space-x-4 mt-12 mb-8">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Program
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Field Dialog */}
      <Dialog open={isAddFieldDialogOpen} onOpenChange={setIsAddFieldDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fieldLabel">Field Label</Label>
              <Input
                id="fieldLabel"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="Enter field label"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fieldType">Field Type</Label>
              <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as FormField['type'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newFieldType === 'dropdown' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Dropdown Options</Label>
                  <div className="space-y-2">
                    {newFieldOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1"
                        />
                        {newFieldOptions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                            className="h-10 w-10 text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Selection Type</Label>
                  <Select 
                    value={newFieldIsMultiSelect ? 'multiple' : 'single'} 
                    onValueChange={(value) => setNewFieldIsMultiSelect(value === 'multiple')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Select</SelectItem>
                      <SelectItem value="multiple">Multiple Select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddFieldDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveField}>
                Add Field
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddProgramPage;
