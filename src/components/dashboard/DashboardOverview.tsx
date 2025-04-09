
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { AnalyticsData, SeoPage, mockSeoPages } from "@/lib/mock-data";
import { fetchAnalyticsData } from "@/lib/api";
import { ArrowRight, ArrowUpRight, FileText, Globe, Search, TrendingUp } from "lucide-react";

export function DashboardOverview() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentPages, setRecentPages] = useState<SeoPage[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAnalyticsData();
        setAnalyticsData(data);
        
        // Get 5 most recent pages
        const sortedPages = [...mockSeoPages].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 5);
        setRecentPages(sortedPages);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-3/4 bg-muted animate-pulse-slow rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse-slow rounded"></div>
          ))}
        </div>
        <div className="h-80 bg-muted animate-pulse-slow rounded"></div>
        <div className="h-64 bg-muted animate-pulse-slow rounded"></div>
      </div>
    );
  }

  // Calculate totals
  const totalImpressions = analyticsData.reduce((sum, item) => sum + item.impressions, 0);
  const totalClicks = analyticsData.reduce((sum, item) => sum + item.clicks, 0);
  const averagePosition = analyticsData.reduce((sum, item) => sum + item.position, 0) / analyticsData.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome to your SEO management dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link to="/seo-pages/new">
              <FileText className="mr-2 h-4 w-4" />
              New SEO Page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{averagePosition.toFixed(1)}</div>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Search Performance</CardTitle>
            <CardDescription>
              Impressions and clicks over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="impressions" fill="hsl(var(--primary))" name="Impressions" />
                  <Bar yAxisId="right" dataKey="clicks" fill="hsl(var(--secondary))" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Average Position</CardTitle>
            <CardDescription>
              Average ranking position over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 10]} reversed/>
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="position" 
                    stroke="hsl(var(--primary))" 
                    activeDot={{ r: 8 }} 
                    name="Position" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <div>
            <CardTitle>Recently Updated Pages</CardTitle>
            <CardDescription>
              Your most recently edited SEO pages
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/seo-pages">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPages.map((page) => (
              <div key={page.id} className="flex justify-between items-center border-b last:border-0 pb-3 last:pb-0">
                <div className="space-y-1">
                  <Link to={`/seo-pages/${page.id}`} className="font-medium hover:underline hover:text-primary">
                    {page.title}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    /{page.slug}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {page.lastPosition && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-1">{page.lastPosition}</span>
                      <span className="text-muted-foreground">position</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date(page.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardOverview;
