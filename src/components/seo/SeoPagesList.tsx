
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusSquare, BarChart4 } from "lucide-react";
import { SeoPage } from "@/lib/mock-data";
import { fetchSeoPages } from "@/lib/api";
import { Card, CardContent } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";

export function SeoPagesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: pages = [], isLoading, refetch } = useQuery({
    queryKey: ["seoPages"],
    queryFn: fetchSeoPages,
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('seo_pages_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes (insert, update, delete)
          schema: 'public',
          table: 'seo_pages',
        },
        () => {
          // Refetch pages when any change occurs
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-700 hover:bg-green-500/30";
      case "draft":
        return "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30";
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || page.publishStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-3/4 bg-muted animate-pulse-slow rounded"></div>
        <div className="h-10 w-full bg-muted animate-pulse-slow rounded"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-full bg-muted animate-pulse-slow rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pages..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link to="/seo-pages/new">
              <PlusSquare className="mr-2 h-4 w-4" />
              New Page
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Page Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Analytics</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length > 0 ? (
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
                      <Badge className={getStatusColor(page.publishStatus)} variant="outline">
                        {page.publishStatus.charAt(0).toUpperCase() + page.publishStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        {page.lastPosition && page.lastImpressions ? (
                          <>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">Position</span>
                              <span className="font-semibold">{page.lastPosition}</span>
                            </div>
                            <div className="h-8 w-px bg-border"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-xs text-muted-foreground">Impressions</span>
                              <span className="font-semibold">{page.lastImpressions.toLocaleString()}</span>
                            </div>
                            <Button size="sm" variant="ghost" className="ml-2">
                              <BarChart4 size={16} />
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">No data</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No SEO pages found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default SeoPagesList;
