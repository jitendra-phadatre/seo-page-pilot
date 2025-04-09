
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Link as LinkIcon, ExternalLink, Trash2 } from "lucide-react";

// Mock data for internal links
const mockInternalLinks = [
  {
    id: "1",
    sourcePageId: "1",
    sourcePageTitle: "Homepage",
    sourcePageSlug: "home",
    targetPageId: "2",
    targetPageTitle: "About Us",
    targetPageSlug: "about-us",
    anchorText: "Learn more about our company",
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    sourcePageId: "1",
    sourcePageTitle: "Homepage",
    sourcePageSlug: "home",
    targetPageId: "3",
    targetPageTitle: "Services",
    targetPageSlug: "services",
    anchorText: "Check our services",
    createdAt: "2023-06-16T11:20:00Z",
  },
  {
    id: "3",
    sourcePageId: "2",
    sourcePageTitle: "About Us",
    sourcePageSlug: "about-us",
    targetPageId: "4",
    targetPageTitle: "Contact",
    targetPageSlug: "contact",
    anchorText: "Get in touch",
    createdAt: "2023-06-17T09:45:00Z",
  },
  {
    id: "4",
    sourcePageId: "3",
    sourcePageTitle: "Services",
    sourcePageSlug: "services",
    targetPageId: "5",
    targetPageTitle: "Pricing",
    targetPageSlug: "pricing",
    anchorText: "View our pricing plans",
    createdAt: "2023-06-18T14:10:00Z",
  },
  {
    id: "5",
    sourcePageId: "5",
    sourcePageTitle: "Pricing",
    sourcePageSlug: "pricing",
    targetPageId: "1",
    targetPageTitle: "Homepage",
    targetPageSlug: "home",
    anchorText: "Back to home",
    createdAt: "2023-06-19T16:30:00Z",
  },
];

export function InternalLinksList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [links, setLinks] = useState(mockInternalLinks);
  
  const filteredLinks = links.filter((link) => 
    link.sourcePageTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    link.targetPageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.anchorText.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteLink = (linkId: string) => {
    if (window.confirm("Are you sure you want to delete this internal link?")) {
      setLinks(links.filter(link => link.id !== linkId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Internal Links</CardTitle>
        <CardDescription>
          View and manage all internal links across your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search links..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From Page</TableHead>
                <TableHead>To Page</TableHead>
                <TableHead>Anchor Text</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="font-medium">{link.sourcePageTitle}</div>
                      <div className="text-xs text-muted-foreground font-mono">/{link.sourcePageSlug}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{link.targetPageTitle}</div>
                      <div className="text-xs text-muted-foreground font-mono">/{link.targetPageSlug}</div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center">
                        <LinkIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        {link.anchorText}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No internal links found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InternalLinksList;
