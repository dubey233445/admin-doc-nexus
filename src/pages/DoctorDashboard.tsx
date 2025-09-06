import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Users, Plus, Edit, Trash2, LogOut, User, Phone, Calendar, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctorName, setDoctorName] = useState("");
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    medicalHistory: "",
    diagnosis: "",
    treatment: "",
    prescriptions: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is doctor
    if (localStorage.getItem("userRole") !== "doctor") {
      navigate("/");
      return;
    }

    const name = localStorage.getItem("doctorName") || "Doctor";
    setDoctorName(name);
    loadPatients();
  }, [navigate]);

  const loadPatients = () => {
    const doctorId = localStorage.getItem("userId");
    const allPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    const doctorPatients = allPatients.filter((p: any) => p.doctorId === doctorId);
    setPatients(doctorPatients);
  };

  const resetForm = () => {
    setPatientForm({
      name: "",
      age: "",
      gender: "",
      contact: "",
      medicalHistory: "",
      diagnosis: "",
      treatment: "",
      prescriptions: "",
    });
    setEditingPatient(null);
  };

  const handleAddPatient = () => {
    const doctorId = localStorage.getItem("userId");
    const patientId = Date.now().toString();
    
    const newPatient = {
      id: patientId,
      doctorId,
      ...patientForm,
      createdDate: new Date().toISOString(),
    };

    const allPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    allPatients.push(newPatient);
    localStorage.setItem("patients", JSON.stringify(allPatients));
    
    setPatients(prev => [...prev, newPatient]);
    resetForm();
    setIsAddingPatient(false);
    
    toast({
      title: "Patient Added",
      description: "Patient record has been created successfully",
      variant: "default",
    });
  };

  const handleEditPatient = () => {
    const allPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    const updatedPatients = allPatients.map((p: any) => 
      p.id === editingPatient.id ? { ...p, ...patientForm } : p
    );
    
    localStorage.setItem("patients", JSON.stringify(updatedPatients));
    loadPatients();
    resetForm();
    
    toast({
      title: "Patient Updated",
      description: "Patient record has been updated successfully",
      variant: "default",
    });
  };

  const handleDeletePatient = (patientId: string) => {
    const allPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    const updatedPatients = allPatients.filter((p: any) => p.id !== patientId);
    
    localStorage.setItem("patients", JSON.stringify(updatedPatients));
    setPatients(prev => prev.filter(p => p.id !== patientId));
    
    toast({
      title: "Patient Deleted",
      description: "Patient record has been removed",
      variant: "destructive",
    });
  };

  const openEditDialog = (patient: any) => {
    setEditingPatient(patient);
    setPatientForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact,
      medicalHistory: patient.medicalHistory || "",
      diagnosis: patient.diagnosis || "",
      treatment: patient.treatment || "",
      prescriptions: patient.prescriptions || "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("doctorName");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary">Welcome, {doctorName}</h1>
              <p className="text-muted-foreground">Patient Management Dashboard</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-secondary">{patients.length}</p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recent Patients</p>
                  <p className="text-2xl font-bold text-primary">
                    {patients.filter(p => {
                      const createdDate = new Date(p.createdDate);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return createdDate > weekAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-center">
              <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                    <DialogDescription>
                      Enter patient information to create a new medical record
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={patientForm.name}
                        onChange={(e) => setPatientForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Patient full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={patientForm.age}
                        onChange={(e) => setPatientForm(prev => ({ ...prev, age: e.target.value }))}
                        placeholder="Patient age"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={patientForm.gender}
                        onValueChange={(value) => setPatientForm(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        value={patientForm.contact}
                        onChange={(e) => setPatientForm(prev => ({ ...prev, contact: e.target.value }))}
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="medicalHistory">Medical History</Label>
                      <Textarea
                        id="medicalHistory"
                        value={patientForm.medicalHistory}
                        onChange={(e) => setPatientForm(prev => ({ ...prev, medicalHistory: e.target.value }))}
                        placeholder="Previous medical conditions, allergies, surgeries..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="diagnosis">Current Diagnosis</Label>
                      <Textarea
                        id="diagnosis"
                        value={patientForm.diagnosis}
                        onChange={(e) => setPatientForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                        placeholder="Current medical diagnosis"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="treatment">Treatment Plan</Label>
                      <Textarea
                        id="treatment"
                        value={patientForm.treatment}
                        onChange={(e) => setPatientForm(prev => ({ ...prev, treatment: e.target.value }))}
                        placeholder="Recommended treatment and procedures"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="prescriptions">Prescriptions</Label>
                      <Textarea
                        id="prescriptions"
                        value={patientForm.prescriptions}
                        onChange={(e) => setPatientForm(prev => ({ ...prev, prescriptions: e.target.value }))}
                        placeholder="Medications and dosage instructions"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setIsAddingPatient(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddPatient} className="bg-success hover:bg-success/90">
                      Add Patient
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>My Patients</span>
            </CardTitle>
            <CardDescription>Manage your patient records and medical information</CardDescription>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No patients yet</p>
                <p className="text-sm text-muted-foreground mb-4">Start by adding your first patient</p>
                <Button onClick={() => setIsAddingPatient(true)} className="bg-secondary hover:bg-secondary-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {patients.map((patient) => (
                  <Card key={patient.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">{patient.age} years old • {patient.gender}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(patient)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{patient.contact}</span>
                          </div>
                          {patient.diagnosis && (
                            <div className="flex items-start space-x-2 text-sm">
                              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <span><strong>Diagnosis:</strong> {patient.diagnosis}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {patient.treatment && (
                            <div className="text-sm">
                              <strong>Treatment:</strong> {patient.treatment}
                            </div>
                          )}
                          {patient.prescriptions && (
                            <div className="text-sm">
                              <strong>Prescriptions:</strong> {patient.prescriptions}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Patient Dialog */}
        <Dialog open={!!editingPatient} onOpenChange={() => setEditingPatient(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Patient Record</DialogTitle>
              <DialogDescription>
                Update patient information and medical records
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={patientForm.name}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-age">Age</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={patientForm.age}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={patientForm.gender}
                  onValueChange={(value) => setPatientForm(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact</Label>
                <Input
                  id="edit-contact"
                  value={patientForm.contact}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-medicalHistory">Medical History</Label>
                <Textarea
                  id="edit-medicalHistory"
                  value={patientForm.medicalHistory}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, medicalHistory: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-diagnosis">Diagnosis</Label>
                <Textarea
                  id="edit-diagnosis"
                  value={patientForm.diagnosis}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-treatment">Treatment</Label>
                <Textarea
                  id="edit-treatment"
                  value={patientForm.treatment}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, treatment: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-prescriptions">Prescriptions</Label>
                <Textarea
                  id="edit-prescriptions"
                  value={patientForm.prescriptions}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, prescriptions: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingPatient(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditPatient} className="bg-secondary hover:bg-secondary-hover">
                Update Patient
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DoctorDashboard;