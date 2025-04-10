
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search as SearchIcon, FileText, Link as LinkIcon, Globe, Shield, SlidersHorizontal } from "lucide-react";
import { SeoPage } from "@/lib/mock-data";
import { searchPages } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<SeoPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: {
      published: true,
      draft: true,
      archived: true,
    },
    sortBy: "relevance" as "relevance" | "date" | "title",
  });

  const performSearch = async (q: string) => {
    if (!q) return setSearchResults([]);
    
    setIsLoading(true);
    try {
      const results = await searchPages(q);
      
      // Apply filters
      let filteredResults = results.filter(page => 
        (filters.status.published && page.publishStatus === "published") ||
        (filters.status.draft && page.publishStatus === "draft") ||
        (filters.status.archived && page.publishStatus === "archived")
      );
      
      // Apply sorting
      if (filters.sortBy === "date") {
        filteredResults.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      } else if (filters.sortBy === "title") {
        filteredResults.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performSearch(query);
  }, [query, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    // Update URL without refreshing the page
    const newUrl = `/search?q=${encodeURIComponent(searchQuery)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const getIconForResult = (type: string) => {
    switch (type) {
      case "page":
        return <FileText className="h-5 w-5" />;
      case "link":
        return <LinkIcon className="h-5 w-5" />;
      case "sitemap":
        return <Globe className="h-5 w-5" />;
      case "schema":
        return <Shield className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const toggleFilter = (category: keyof typeof filters.status, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [category]: value,
      }
    }));
  };

  const setSortBy = (value: "relevance" | "date" | "title") => {
    setFilters(prev => ({
      ...prev,
      sortBy: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="content-area">
        <div className="mb-6">
          <h1 className="page-title">Search</h1>
          {query && <p className="page-subtitle">Results for "{query}"</p>}
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search pages, keywords, content..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" type="button">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.status.published}
                    onCheckedChange={(value) => toggleFilter("published", !!value)}
                  >
                    Published
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.draft}
                    onCheckedChange={(value) => toggleFilter("draft", !!value)}
                  >
                    Draft
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.archived}
                    onCheckedChange={(value) => toggleFilter("archived", !!value)}
                  >
                    Archived
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.sortBy === "relevance"}
                    onCheckedChange={() => setSortBy("relevance")}
                  >
                    Relevance
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.sortBy === "date"}
                    onCheckedChange={() => setSortBy("date")}
                  >
                    Last Updated
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.sortBy === "title"}
                    onCheckedChange={() => setSortBy("title")}
                  >
                    Title (A-Z)
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-4 flex">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    {getIconForResult("page")}
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/seo-pages/${result.id}`} 
                      className="text-lg font-medium hover:underline"
                    >
                      {result.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {result.metaDescription || "No description available"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        /{result.slug}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.publishStatus.charAt(0).toUpperCase() + result.publishStatus.slice(1)}
                      </Badge>
                      {result.keywords.slice(0, 3).map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">No results found</h2>
            <p className="text-muted-foreground">Try a different search term or filter</p>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Search;
