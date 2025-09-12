import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Calendar, User } from "lucide-react";

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

interface PDFReportProps {
  patientData: {
    name: string;
    patientId: string;
    email: string;
    date: string;
  };
  annotations: {
    upperTeeth: Annotation[];
    frontTeeth: Annotation[];
    lowerTeeth: Annotation[];
  };
  imageUrls: {
    upperTeeth: string;
    frontTeeth: string;
    lowerTeeth: string;
  };
}

const annotationLabels = [
  { value: "inflammation", label: "Inflamed Gums", color: "#ef4444", treatment: "Anti-inflammatory treatment and improved oral hygiene" },
  { value: "cavity", label: "Cavity", color: "#f97316", treatment: "Dental filling or root canal treatment" },
  { value: "misalignment", label: "Misalignment", color: "#8b5cf6", treatment: "Orthodontic scaling and alignment therapy" },
  { value: "plaque", label: "Plaque Buildup", color: "#eab308", treatment: "Regular brushing, flossing, and professional cleaning" },
  { value: "healthy", label: "Healthy Area", color: "#16a34a", treatment: "Continue current oral hygiene routine" },
  { value: "attention", label: "Needs Attention", color: "#dc2626", treatment: "Immediate dental consultation required" },
];

export function PDFReport({ patientData, annotations, imageUrls }: PDFReportProps) {
  const { toast } = useToast();

  const getAllAnnotations = () => {
    return [
      ...annotations.upperTeeth,
      ...annotations.frontTeeth,
      ...annotations.lowerTeeth,
    ];
  };

  const getUniqueLabels = () => {
    const allAnnotations = getAllAnnotations();
    const uniqueLabels = [...new Set(allAnnotations.map(a => a.label))];
    return uniqueLabels.map(label => 
      annotationLabels.find(l => l.value === label) || annotationLabels[0]
    );
  };

  const generatePDF = () => {
    // In a real implementation, this would generate an actual PDF
    // For now, we'll create an HTML version that could be printed
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Oral Health Screening Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
            .patient-info { background: #f8fafc; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
            .images-section { margin-bottom: 30px; }
            .image-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .image-item { text-align: center; }
            .image-item img { width: 100%; max-width: 300px; border: 2px solid #e5e7eb; border-radius: 8px; }
            .legend { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .legend-item { display: inline-block; margin: 5px; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
            .treatments { background: #f9fafb; padding: 20px; border-radius: 8px; }
            .treatment-item { margin-bottom: 15px; padding: 10px; border-left: 4px solid #2563eb; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Oral Health Screening Report</h1>
            <p>Comprehensive Dental Assessment</p>
          </div>
          
          <div class="patient-info">
            <h2>Patient Information</h2>
            <p><strong>Name:</strong> ${patientData.name}</p>
            <p><strong>Patient ID:</strong> ${patientData.patientId}</p>
            <p><strong>Email:</strong> ${patientData.email}</p>
            <p><strong>Screening Date:</strong> ${patientData.date}</p>
          </div>
          
          <div class="images-section">
            <h2>Screening Report</h2>
            <div class="image-grid">
              <div class="image-item">
                <h3>Upper Teeth</h3>
                <img src="${imageUrls.upperTeeth}" alt="Upper Teeth" />
                <p>${annotations.upperTeeth.length} annotations</p>
              </div>
              <div class="image-item">
                <h3>Front Teeth</h3>
                <img src="${imageUrls.frontTeeth}" alt="Front Teeth" />
                <p>${annotations.frontTeeth.length} annotations</p>
              </div>
              <div class="image-item">
                <h3>Lower Teeth</h3>
                <img src="${imageUrls.lowerTeeth}" alt="Lower Teeth" />
                <p>${annotations.lowerTeeth.length} annotations</p>
              </div>
            </div>
          </div>
          
          <div class="legend">
            <h3>Annotation Legend</h3>
            ${getUniqueLabels().map(label => `
              <span class="legend-item" style="background-color: ${label.color}20; border: 1px solid ${label.color};">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${label.color}; border-radius: 50%; margin-right: 5px;"></span>
                ${label.label}
              </span>
            `).join('')}
          </div>
          
          <div class="treatments">
            <h3>Treatment Recommendations</h3>
            ${getUniqueLabels().map(label => `
              <div class="treatment-item">
                <strong>${label.label}:</strong> ${label.treatment}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oral-health-report-${patientData.patientId}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "PDF report has been downloaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Preview */}
      <Card className="medical-card">
        <CardHeader className="report-header">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Oral Health Screening Report
          </CardTitle>
          <p className="text-center text-white/90">Comprehensive Dental Assessment</p>
        </CardHeader>
        <CardContent className="p-6">
          {/* Patient Information */}
          <div className="bg-secondary/50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{patientData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="font-medium">{patientData.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{patientData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Screening Date</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {patientData.date}
                </p>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Screening Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-medium mb-2">Upper Teeth</h4>
                <img
                  src={imageUrls.upperTeeth}
                  alt="Upper Teeth"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {annotations.upperTeeth.length} annotations
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-medium mb-2">Front Teeth</h4>
                <img
                  src={imageUrls.frontTeeth}
                  alt="Front Teeth"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {annotations.frontTeeth.length} annotations
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-medium mb-2">Lower Teeth</h4>
                <img
                  src={imageUrls.lowerTeeth}
                  alt="Lower Teeth"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {annotations.lowerTeeth.length} annotations
                </p>
              </div>
            </div>
          </div>

          {/* Annotation Legend */}
          {getUniqueLabels().length > 0 && (
            <div className="bg-primary-light/20 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Annotation Legend</h3>
              <div className="flex flex-wrap gap-2">
                {getUniqueLabels().map((label) => (
                  <Badge
                    key={label.value}
                    variant="outline"
                    className="flex items-center gap-2"
                    style={{ borderColor: label.color }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Recommendations */}
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Treatment Recommendations</h3>
            <div className="space-y-4">
              {getUniqueLabels().map((label) => (
                <div
                  key={label.value}
                  className="p-4 rounded-lg border-l-4"
                  style={{ borderLeftColor: label.color }}
                >
                  <h4 className="font-medium text-foreground">{label.label}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{label.treatment}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate PDF Button */}
      <div className="text-center">
        <Button onClick={generatePDF} className="btn-medical px-8">
          <Download className="w-4 h-4 mr-2" />
          Download PDF Report
        </Button>
      </div>
    </div>
  );
}