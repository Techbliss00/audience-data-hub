import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Globe, Users, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeadSearchFormProps {
  onSearch: (formData: SearchFormData) => void;
  isLoading: boolean;
}

export interface SearchFormData {
  website: string;
  niche: string;
  targetAudience: string;
  about: string;
}

export const LeadSearchForm = ({ onSearch, isLoading }: LeadSearchFormProps) => {
  const [formData, setFormData] = useState<SearchFormData>({
    website: "",
    niche: "",
    targetAudience: "",
    about: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.website || !formData.niche || !formData.targetAudience || !formData.about) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSearch(formData);
  };

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-hero bg-clip-text text-transparent">
              Lead Generation
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Find qualified leads based on your target criteria
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <Label htmlFor="website" className="text-sm font-medium">
                  Website URL *
                </Label>
              </div>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <Label htmlFor="niche" className="text-sm font-medium">
                  Niche/Industry *
                </Label>
              </div>
              <Input
                id="niche"
                placeholder="e.g., SaaS, E-commerce, Healthcare"
                value={formData.niche}
                onChange={(e) => handleInputChange("niche", e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <Label htmlFor="targetAudience" className="text-sm font-medium">
                Target Audience *
              </Label>
            </div>
            <Input
              id="targetAudience"
              placeholder="e.g., Marketing Directors, CTOs, Small Business Owners"
              value={formData.targetAudience}
              onChange={(e) => handleInputChange("targetAudience", e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="about" className="text-sm font-medium">
              Description of Required Data *
            </Label>
            <Textarea
              id="about"
              placeholder="Describe the specific lead data you need and any additional criteria..."
              value={formData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors min-h-[100px] resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300 text-white font-medium py-6 text-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Finding Leads...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Leads
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};