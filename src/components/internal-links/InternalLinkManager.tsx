
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchSeoPages } from "@/lib/api";
import { SeoPage } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Link as LinkIcon, ExternalLink } from "lucide-react";
import InternalLinkForm from "./InternalLinkForm";
import InternalLinksList from "./InternalLinksList";
import LinkVisualizer from "./LinkVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InternalLinkManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState<SeoPage | null>(null);
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ["seoPages"],
    queryFn: fetchSeoPages
  });
  
  const filteredPages = pages?.filter((page) => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPage = (page: SeoPage) => {
    setSelectedPage(page);
    setShowLinkForm(true);
  };

  const handleCloseForm = () => {
    setShowLinkForm(false);
    setSelectedPage(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
        <div className="h-64 w-full bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="pages">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="visualize">Visualize</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Select Page to Link</CardTitle>
              <CardDescription>Choose a page to add internal links to or from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search pages..."
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
                      <TableHead>Page Title</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages && filteredPages.length > 0 ? (
                      filteredPages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">
                            <Link to={`/seo-pages/${page.id}`} className="hover:text-primary hover:underline">
                              {page.title}
                            </Link>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            /{page.slug}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSelectPage(page)}
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              Manage Links
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6">
                          No pages found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {showLinkForm && selectedPage && (
            <InternalLinkForm page={selectedPage} onClose={handleCloseForm} />
          )}
        </TabsContent>
        
        <TabsContent value="links">
          <InternalLinksList />
        </TabsContent>
        
        <TabsContent value="visualize">
          <LinkVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default InternalLinkManager;
