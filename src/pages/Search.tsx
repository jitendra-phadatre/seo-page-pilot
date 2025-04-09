
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search as SearchIcon, FileText, Link as LinkIcon, Globe, Shield } from "lucide-react";
import { SeoPage } from "@/lib/mock-data";
import { searchPages } from "@/lib/api";

const Search = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<SeoPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = async (q: string) => {
    if (!q) return setSearchResults([]);
    
    setIsLoading(true);
    try {
      const results = await searchPages(q);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    performSearch(query);
  }, [query]);

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
