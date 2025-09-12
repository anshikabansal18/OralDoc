import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/patient/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, LogOut, User } from "lucide-react";

interface ImageUpload {
  upperTeeth: File | null;
  frontTeeth: File | null;
  lowerTeeth: File | null;
}

const PatientDashboard = () => {
  const [uploadedImages, setUploadedImages] = useState<ImageUpload | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (images: ImageUpload) => {
    // Run async work without changing the prop type (void)
    void (async () => {
      setUploadedImages(images);
      setShowUpload(false);

      try {
        const read = (file: File | null) =>
          new Promise<string>((resolve, reject) => {
            if (!file) return resolve("");
            const r = new FileReader();
            r.onload = () => resolve(String(r.result));
            r.onerror = reject;
            r.readAsDataURL(file);
          });

        const [upper, front, lower] = await Promise.all([
          read(images.upperTeeth),
          read(images.frontTeeth),
          read(images.lowerTeeth),
        ]);

        const submission = {
          id: `${Date.now()}`,
          date: new Date().toISOString(),
          patient: { name: "John Doe", patientId: "P12345" },
          images: { upperTeeth: upper, frontTeeth: front, lowerTeeth: lower },
          status: "pending",
        };

        const key = "oralvis_submissions";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push(submission);
        localStorage.setItem(key, JSON.stringify(existing));

        toast({
          title: "Upload Successful",
          description: "Your dental images have been submitted for review",
        });
      } catch (e) {
        console.error("Failed to save submission", e);
        toast({
          title: "Upload stored locally failed",
          description: "Please try again",
        });
      }
    })();
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    window.location.href = "/login";
  };

  if (showUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-secondary p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Upload Dental Images</h1>
            <Button
              variant="outline"
              onClick={() => setShowUpload(false)}
            >
              Back to Dashboard
            </Button>
          </div>
          <ImageUpload onUpload={handleImageUpload} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/20 to-secondary">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Patient Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, John Doe</p>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Upload New Images */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload new dental images for professional screening
              </p>
              <Button 
                className="btn-medical w-full"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                New Upload
              </Button>
            </CardContent>
          </Card>

          {/* Recent Submission */}
          {uploadedImages && (
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Recent Submission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Submitted: {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Status: Under Review
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Upper Teeth:</span>
                    <span className="text-accent">✓ Uploaded</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Front Teeth:</span>
                    <span className="text-accent">✓ Uploaded</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Lower Teeth:</span>
                    <span className="text-accent">✓ Uploaded</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                View Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📧 Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="medical-card mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Upload Images</h3>
                <p className="text-sm text-muted-foreground">
                  Upload clear photos of your upper, front, and lower teeth
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. Professional Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our dental professionals will review and annotate your images
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. Get Report</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a detailed report with recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;