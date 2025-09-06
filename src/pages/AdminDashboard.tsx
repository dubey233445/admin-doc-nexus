import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, UserCheck, Clock, Trash2, Eye, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";  // ✅ Supabase client import

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Check if user is admin
    if (localStorage.getItem("userRole") !== "admin") {
      navigate("/");
      return;
    }
    loadData();
  }, [navigate]);

  // ✅ Load doctors & patients from Supabase
  const loadData = async () => {
    const { data: doctorData, error: doctorError } = await supabase.from("doctors").select("*");
    if (doctorError) {
      toast({ title: "Error", description: doctorError.message, variant: "destructive" });
    } else {
      setDoctors(doctorData || []);
    }

    const { data: patientData, error: patientError } = await supabase.from("patients").select("*");
    if (patientError) {
      toast({ title: "Error", description: patientError.message, variant: "destructive" });
    } else {
      setPatients(patientData || []);
    }
  };

  // ✅ Approve doctor
  const handleApproveDoctor = async (doctorId: string) => {
    const { error } = await supabase
      .from("doctors")
      .update({ status: "approved" })
      .eq("id", doctorId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Doctor Approved", description: "Doctor can now access the system" });
      loadData();
    }
  };

  // ✅ Reject doctor (delete)
  const handleRejectDoctor = async (doctorId: string) => {
    const { error } = await supabase.from("doctors").delete().eq("id", doctorId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Doctor Rejected", description: "Registration request removed", variant: "destructive" });
      loadData();
    }
  };

  // ✅ Delete doctor & their patients
  const handleDeleteDoctor = async (doctorId: string) => {
    await supabase.from("patients").delete().eq("doctor_id", doctorId);
    const { error } = await supabase.from("doctors").delete().eq("id", doctorId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Doctor Deleted", description: "Doctor and their patients removed", variant: "destructive" });
      loadData();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const pendingDoctors = doctors.filter((doc) => doc.status === "pending");
  const approvedDoctors = doctors.filter((doc) => doc.status === "approved");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground">Hospital Management System</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card><CardContent className="p-6 flex justify-between">
            <div><p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-2xl font-bold text-warning">{pendingDoctors.length}</p></div>
            <Clock className="w-8 h-8 text-warning" /></CardContent></Card>

          <Card><CardContent className="p-6 flex justify-between">
            <div><p className="text-sm text-muted-foreground">Approved Doctors</p>
            <p className="text-2xl font-bold text-success">{approvedDoctors.length}</p></div>
            <UserCheck className="w-8 h-8 text-success" /></CardContent></Card>

          <Card><CardContent className="p-6 flex justify-between">
            <div><p className="text-sm text-muted-foreground">Total Patients</p>
            <p className="text-2xl font-bold text-primary">{patients.length}</p></div>
            <Users className="w-8 h-8 text-primary" /></CardContent></Card>

          <Card><CardContent className="p-6 flex justify-between">
            <div><p className="text-sm text-muted-foreground">Total Doctors</p>
            <p className="text-2xl font-bold text-secondary">{doctors.length}</p></div>
            <Users className="w-8 h-8 text-secondary" /></CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="doctors">All Doctors</TabsTrigger>
            <TabsTrigger value="patients">All Patients</TabsTrigger>
          </TabsList>

          {/* Pending Approvals */}
          <TabsContent value="pending">
            <Card>
              <CardHeader><CardTitle>Doctor Registration Requests</CardTitle>
                <CardDescription>Approve or reject new registrations</CardDescription></CardHeader>
              <CardContent>
                {pendingDoctors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending requests</p>
                ) : (
                  <div className="space-y-4">
                    {pendingDoctors.map((doctor) => (
                      <div key={doctor.id} className="p-4 border rounded-lg flex justify-between">
                        <div>
                          <h3 className="font-semibold">{doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                          <p className="text-sm text-muted-foreground">{doctor.email}</p>
                          <p className="text-sm text-muted-foreground">{doctor.contact}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleApproveDoctor(doctor.id)} className="bg-success hover:bg-success/90">Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRejectDoctor(doctor.id)}>Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Doctors */}
          <TabsContent value="doctors">
            <Card>
              <CardHeader><CardTitle>Approved Doctors</CardTitle>
                <CardDescription>Manage doctors and view patients</CardDescription></CardHeader>
              <CardContent>
                {approvedDoctors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No approved doctors</p>
                ) : (
                  <div className="space-y-4">
                    {approvedDoctors.map((doctor) => {
                      const doctorPatients = patients.filter((p) => p.doctor_id === doctor.id);
                      return (
                        <div key={doctor.id} className="p-4 border rounded-lg flex justify-between">
                          <div>
                            <h3 className="font-semibold">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            <p className="text-sm text-muted-foreground">{doctor.email}</p>
                            <Badge variant="outline" className="text-success border-success">
                              {doctorPatients.length} Patients
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedDoctor(doctor)}>
                              <Eye className="w-4 h-4 mr-1" /> View Patients
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteDoctor(doctor.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Patients */}
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>All Patients</CardTitle>
                <CardDescription>
                  {selectedDoctor ? `Patients managed by Dr. ${selectedDoctor.name}` : "All patients in the system"}
                </CardDescription>
                {selectedDoctor && (
                  <Button variant="outline" size="sm" onClick={() => setSelectedDoctor(null)}>View All Patients</Button>
                )}
              </CardHeader>
              <CardContent>
                {(() => {
                  const displayPatients = selectedDoctor
                    ? patients.filter((p) => p.doctor_id === selectedDoctor.id)
                    : patients;

                  return displayPatients.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No patients found</p>
                  ) : (
                    <div className="space-y-4">
                      {displayPatients.map((patient) => {
                        const patientDoctor = doctors.find((d) => d.id === patient.doctor_id);
                        return (
                          <div key={patient.id} className="p-4 border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-semibold">{patient.name}</h3>
                                <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                                <p className="text-sm text-muted-foreground">Gender: {patient.gender}</p>
                                <p className="text-sm text-muted-foreground">Contact: {patient.contact}</p>
                              </div>
                              <div>
                                <p className="text-sm"><strong>Doctor:</strong> {patientDoctor?.name}</p>
                                <p className="text-sm"><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                                <p className="text-sm"><strong>Treatment:</strong> {patient.treatment}</p>
                                {patient.prescriptions && (
                                  <p className="text-sm"><strong>Prescriptions:</strong> {patient.prescriptions}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
