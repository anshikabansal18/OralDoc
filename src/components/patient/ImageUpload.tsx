import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, Check } from "lucide-react";

interface ImageUpload {
  upperTeeth: File | null;
  frontTeeth: File | null;
  lowerTeeth: File | null;
}

interface ImageUploadProps {
  onUpload: (images: ImageUpload) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [images, setImages] = useState<ImageUpload>({
    upperTeeth: null,
    frontTeeth: null,
    lowerTeeth: null,
  });
  const [previews, setPreviews] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const handleFileChange = (type: keyof ImageUpload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImages(prev => ({ ...prev, [type]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({ ...prev, [type]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!images.upperTeeth || !images.frontTeeth || !images.lowerTeeth) {
      toast({
        title: "Missing Images",
        description: "Please upload all three dental images",
        variant: "destructive",
      });
      return;
    }

    onUpload(images);
    toast({
      title: "Images Uploaded",
      description: "All dental images have been uploaded successfully",
    });
  };

  const renderUploadCard = (
    type: keyof ImageUpload,
    title: string,
    description: string
  ) => (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="w-5 h-5" />
          {title}
          {images[type] && <Check className="w-5 h-5 text-accent ml-auto" />}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor={type}>Upload Image</Label>
            <Input
              id={type}
              type="file"
              accept="image/*"
              onChange={handleFileChange(type)}
              className="mt-2"
            />
          </div>
          
          {previews[type] && (
            <div className="mt-4">
              <img
                src={previews[type]}
                alt={title}
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Upload Dental Images
        </h2>
        <p className="text-muted-foreground">
          Please upload clear photos of your upper teeth, front teeth, and lower teeth
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {renderUploadCard(
          "upperTeeth",
          "Upper Teeth",
          "Photo showing your upper teeth clearly"
        )}
        {renderUploadCard(
          "frontTeeth",
          "Front Teeth",
          "Photo of your front teeth (smile view)"
        )}
        {renderUploadCard(
          "lowerTeeth",
          "Lower Teeth",
          "Photo showing your lower teeth clearly"
        )}
      </div>

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          className="btn-medical px-8"
          disabled={!images.upperTeeth || !images.frontTeeth || !images.lowerTeeth}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload All Images
        </Button>
      </div>
    </div>
  );
}