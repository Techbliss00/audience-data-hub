import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, Mail, Download, Building } from "lucide-react";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  companyWebsite: string;
  phoneNumber: string;
  email: string;
  phoneCampaign: boolean;
  emailCampaign: boolean;
}

interface LeadsTableProps {
  leads: Lead[];
  onUpdateCampaignStatus: (leadId: string, type: 'phone' | 'email', value: boolean) => void;
}

export const LeadsTable = ({ leads, onUpdateCampaignStatus }: LeadsTableProps) => {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(leads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    const newSelected = new Set(selectedLeads);
    if (checked) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const exportLeads = () => {
    const selectedLeadData = leads.filter(lead => selectedLeads.has(lead.id));
    const csvContent = [
      ['First Name', 'Last Name', 'Company', 'Website', 'Phone', 'Email', 'Phone Campaign', 'Email Campaign'],
      ...selectedLeadData.map(lead => [
        lead.firstName,
        lead.lastName,
        lead.companyName,
        lead.companyWebsite,
        lead.phoneNumber,
        lead.email,
        lead.phoneCampaign ? 'Yes' : 'No',
        lead.emailCampaign ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (leads.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-muted/20 mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No leads found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Submit your search criteria above to generate qualified leads for your business.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">
                Generated Leads ({leads.length})
              </CardTitle>
              <CardDescription>
                {selectedLeads.size} of {leads.length} leads selected
              </CardDescription>
            </div>
          </div>
          
          <Button
            onClick={exportLeads}
            disabled={selectedLeads.size === 0}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.size === leads.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Campaigns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.has(lead.id)}
                      onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {lead.firstName} {lead.lastName}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{lead.companyName}</span>
                      </div>
                      {lead.companyWebsite && (
                        <a
                          href={lead.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          {lead.companyWebsite}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-2">
                      {lead.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{lead.phoneNumber}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                            {lead.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`phone-${lead.id}`}
                          checked={lead.phoneCampaign}
                          onCheckedChange={(checked) => 
                            onUpdateCampaignStatus(lead.id, 'phone', checked as boolean)
                          }
                        />
                        <label htmlFor={`phone-${lead.id}`} className="text-sm cursor-pointer">
                          <Badge variant="outline" className="gap-1">
                            <Phone className="h-3 w-3" />
                            Phone
                          </Badge>
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`email-${lead.id}`}
                          checked={lead.emailCampaign}
                          onCheckedChange={(checked) => 
                            onUpdateCampaignStatus(lead.id, 'email', checked as boolean)
                          }
                        />
                        <label htmlFor={`email-${lead.id}`} className="text-sm cursor-pointer">
                          <Badge variant="outline" className="gap-1">
                            <Mail className="h-3 w-3" />
                            Email
                          </Badge>
                        </label>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};