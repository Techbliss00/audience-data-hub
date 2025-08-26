import { useState } from "react";
import { LeadSearchForm, SearchFormData } from "@/components/LeadSearchForm";
import { LeadsTable, Lead } from "@/components/LeadsTable";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock leads for demonstration - replace with actual webhook response
  const mockLeads: Lead[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      companyName: "TechCorp Inc",
      companyWebsite: "https://techcorp.com",
      phoneNumber: "+1 (555) 123-4567",
      email: "john.smith@techcorp.com",
      phoneCampaign: false,
      emailCampaign: true
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Johnson",
      companyName: "Digital Solutions LLC",
      companyWebsite: "https://digitalsolutions.com",
      phoneNumber: "+1 (555) 987-6543",
      email: "sarah.johnson@digitalsolutions.com",
      phoneCampaign: true,
      emailCampaign: false
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Brown",
      companyName: "Innovation Hub",
      companyWebsite: "https://innovationhub.io",
      phoneNumber: "+1 (555) 456-7890",
      email: "michael.brown@innovationhub.io",
      phoneCampaign: false,
      emailCampaign: false
    }
  ];

  const handleSearch = async (formData: SearchFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual n8n webhook call
      const webhookUrl = "YOUR_N8N_WEBHOOK_URL"; // Replace with your actual webhook URL
      
      // Simulate API call with timeout for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, using mock data - replace with actual webhook response
      setLeads(mockLeads);
      
      toast({
        title: "Search completed",
        description: `Found ${mockLeads.length} qualified leads`,
      });
      
      /* Uncomment and modify for actual webhook integration:
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data = await response.json();      
      setLeads(data.leads || []);
      */
      
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCampaignStatus = (leadId: string, type: 'phone' | 'email', value: boolean) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, [`${type}Campaign`]: value }
          : lead
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Lead Generation Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find qualified leads for your business with AI-powered data extraction
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <LeadSearchForm onSearch={handleSearch} isLoading={isLoading} />
          <LeadsTable 
            leads={leads} 
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
