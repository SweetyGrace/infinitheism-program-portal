
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
}

interface SubProgram {
  id: string;
  name: string;
  fields: FormField[];
}

const AddProgramPage = () => {
  const activeTab = 'programs';
  const setActiveTab = () => {};
  const navigate = useNavigate();
  
  const [programFields, setProgramFields] = useState<FormField[]>([
    { id: '1', label: 'Program Name', type: 'text', value: '' },
    { id: '2', label: 'Description', type: 'textarea', value: '' },
    { id: '3', label: 'Start Date', type: 'date', value: '' },
    { id: '4', label: 'End Date', type: 'date', value: '' },
  ]);

  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([
    {
      id: '1',
      name: 'Sub-Program 1',
      fields: [
        { id: 'sp1-1', label: 'Title', type: 'text', value: '' },
        { id: 'sp1-2', label: 'Duration (weeks)', type: 'number', value: '' },
      ]
    }
  ]);

  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [fieldTargetSection, setFieldTargetSection] = useState<'program' | string>('program');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');

  const handleAddField = (section: 'program' | string) => {
    setFieldTargetSection(section);
    setIsAddFieldDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!newFieldLabel.trim()) return;

    const newField: FormField = {
      id: Date.now().toString(),
      label: newFieldLabel,
      type: newFieldType,
      value: '',
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

    setNewFieldLabel('');
    setNewFieldType('text');
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
        { id: `sp${Date.now()}-1`, label: 'Title', type: 'text', value: '' },
      ]
    };
    setSubPrograms(prev => [...prev, newSubProgram]);
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

  const renderField = (field: FormField, section: 'program' | string) => (
    <div key={field.id} className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRemoveField(field.id, section)}
          className="h-6 w-6 text-gray-400 hover:text-red-500"
        >
          <X size={14} />
        </Button>
      </div>
      {field.type === 'textarea' ? (
        <Textarea
          id={field.id}
          value={field.value}
          onChange={(e) => handleFieldValueChange(field.id, e.target.value, section)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
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
        <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 rounded-bl-3xl rounded-br-3xl shadow-sm">
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
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Programs</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Add HDB/MSD Program</BreadcrumbPage>
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
                    <div key={subProgram.id} className="border rounded-lg p-4">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fieldLabel">Field Label</Label>
              <Input
                id="fieldLabel"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="Enter field label"
              />
            </div>
            <div>
              <Label htmlFor="fieldType">Field Type</Label>
              <select
                id="fieldType"
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as FormField['type'])}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="textarea">Textarea</option>
                <option value="dropdown">Dropdown</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
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
