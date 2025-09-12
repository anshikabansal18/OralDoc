import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnnotationCanvas } from "@/components/annotation/AnnotationCanvas";
import { PDFReport } from "@/components/reports/PDFReport";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, FileText, Image as ImageIcon, Settings } from "lucide-react";

interface Annotation {
  id: string;
  type: "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<"dashboard" | "annotate" | "report">("dashboard");
  const [annotations, setAnnotations] = useState<{
    upperTeeth: Annotation[];
    frontTeeth: Annotation[];
    lowerTeeth: Annotation[];
  }>({
    upperTeeth: [],
    frontTeeth: [],
    lowerTeeth: [],
  });
  
  const [annotatedImages, setAnnotatedImages] = useState<{
    upperTeeth: string;
    frontTeeth: string;
    lowerTeeth: string;
  } | null>(null);
  
  // Mock data for demonstration
  const patientData = {
    name: "John Doe",
    patientId: "P12345",
    email: "john.doe@email.com",
    date: new Date().toLocaleDateString(),
  };

  const mockImageUrls = {
    upperTeeth: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop",
    frontTeeth: "https://images.unsplash.com/photo-1609840112855-9ab5ad8be4c3?w=400&h=300&fit=crop",
    lowerTeeth: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop",
  };

const [imageUrls, setImageUrls] = useState(mockImageUrls);

useEffect(() => {
  try {
    const raw = localStorage.getItem("oralvis_submissions");
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) {
        const latest = arr[arr.length - 1];
        if (latest?.images) {
          setImageUrls({
            upperTeeth: latest.images.upperTeeth,
            frontTeeth: latest.images.frontTeeth,
            lowerTeeth: latest.images.lowerTeeth,
          });
        }
      }
    }
  } catch (e) {
    console.error("Failed to load submissions from localStorage", e);
  }
}, []);

const { toast } = useToast();

  const handleAnnotationSave = (imageType: keyof typeof annotations) => (imageAnnotations: Annotation[], annotatedImageUrl: string) => {
    setAnnotations(prev => ({
      ...prev,
      [imageType]: imageAnnotations,
    }));
    
    setAnnotatedImages(prev => ({
      upperTeeth: prev?.upperTeeth || imageUrls.upperTeeth,
      frontTeeth: prev?.frontTeeth || imageUrls.frontTeeth,
      lowerTeeth: prev?.lowerTeeth || imageUrls.lowerTeeth,
      ...prev,
      [imageType]: annotatedImageUrl,
    }));
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    window.location.href = "/login";
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">7</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">17</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">John Doe (P12345)</p>
                  <p className="text-sm text-muted-foreground">Submitted today</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setCurrentView("annotate")}
                  className="btn-medical"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Annotate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentView("report")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnnotation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Image Annotation</h2>
          <p className="text-muted-foreground">Patient: {patientData.name} ({patientData.patientId})</p>
        </div>
        <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-8">
        <AnnotationCanvas
          imageUrl={imageUrls.upperTeeth}
          imageName="Upper Teeth"
          onSave={handleAnnotationSave("upperTeeth")}
        />
        <AnnotationCanvas
          imageUrl={imageUrls.frontTeeth}
          imageName="Front Teeth"
          onSave={handleAnnotationSave("frontTeeth")}
        />
        <AnnotationCanvas
          imageUrl={imageUrls.lowerTeeth}
          imageName="Lower Teeth"
          onSave={handleAnnotationSave("lowerTeeth")}
        />
      </div>

      <div className="text-center">
        <Button
          className="btn-medical px-8"
          onClick={() => setCurrentView("report")}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Patient Report</h2>
          <p className="text-muted-foreground">Generated report for {patientData.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("annotate")}>
            Back to Annotation
          </Button>
          <Button variant="outline" onClick={() => setCurrentView("dashboard")}>
            Dashboard
          </Button>
        </div>
      </div>

      <PDFReport
        patientData={patientData}
        annotations={annotations}
        imageUrls={annotatedImages || imageUrls}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-secondary">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">OralVis Healthcare Management</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {currentView === "dashboard" && renderDashboard()}
        {currentView === "annotate" && renderAnnotation()}
        {currentView === "report" && renderReport()}
      </div>
    </div>
  );
};

export default AdminDashboard;