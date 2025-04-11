
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAnalyticsSettings, connectGoogleSearchConsole, AnalyticsSettings } from "@/lib/settings-api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data for analytics charts
const mockSearchData = [
  { date: '2023-01', clicks: 120, impressions: 1800, position: 12.3 },
  { date: '2023-02', clicks: 145, impressions: 2200, position: 10.8 },
  { date: '2023-03', clicks: 180, impressions: 2600, position: 9.4 },
  { date: '2023-04', clicks: 210, impressions: 3100, position: 8.7 },
  { date: '2023-05', clicks: 250, impressions: 3800, position: 7.2 },
  { date: '2023-06', clicks: 290, impressions: 4200, position: 6.5 },
];

const mockKeywordData = [
  { keyword: 'travel destinations', clicks: 86, impressions: 1200, position: 4.2 },
  { keyword: 'best vacation spots', clicks: 72, impressions: 950, position: 5.1 },
  { keyword: 'travel planning', clicks: 65, impressions: 820, position: 6.3 },
  { keyword: 'budget travel', clicks: 58, impressions: 680, position: 7.8 },
  { keyword: 'luxury vacations', clicks: 45, impressions: 520, position: 8.4 },
];

const formatDate = (date: string | null) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleString();
};

const Analytics = () => {
  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'pages'>('overview');

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const settings = await getAnalyticsSettings();
        setAnalyticsSettings(settings);
      } catch (error) {
        console.error("Error loading analytics settings:", error);
        toast.error("Failed to load analytics settings");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, []);

  const handleConnectGSC = async () => {
    setIsConnecting(true);
    try {
      const updatedSettings = await connectGoogleSearchConsole();
      setAnalyticsSettings(updatedSettings);
    } catch (error) {
      console.error("Error connecting to Google Search Console:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="content-area">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle mb-6">Loading analytics data...</p>
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="content-area">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle mb-6">
          Track and analyze your SEO performance metrics
        </p>
        
        {analyticsSettings?.googleSearchConsoleConnected ? (
          <>
            <div className="mb-6">
              <Card className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Google Search Console</CardTitle>
                    <CardDescription>
                      Connected • Last sync: {formatDate(analyticsSettings.lastSyncDate)}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleConnectGSC} disabled={isConnecting}>
                    {isConnecting ? "Syncing..." : "Sync Data"}
                  </Button>
                </CardHeader>
              </Card>
              
              <div className="flex space-x-2 mb-4">
                <Button 
                  variant={activeTab === 'overview' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </Button>
                <Button 
                  variant={activeTab === 'keywords' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('keywords')}
                >
                  Keywords
                </Button>
                <Button 
                  variant={activeTab === 'pages' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('pages')}
                >
                  Pages
                </Button>
              </div>
              
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Search Performance</CardTitle>
                      <CardDescription>
                        Clicks and impressions over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={mockSearchData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="clicks" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="impressions" 
                            stroke="#82ca9d" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Position</CardTitle>
                      <CardDescription>
                        Average position in search results over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={mockSearchData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis reversed domain={[1, 'dataMax']} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="position" 
                            stroke="#ff7300" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'keywords' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Keywords</CardTitle>
                    <CardDescription>
                      Performance data for your top ranking keywords
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Keyword</th>
                            <th className="text-right py-3 px-4">Clicks</th>
                            <th className="text-right py-3 px-4">Impressions</th>
                            <th className="text-right py-3 px-4">Avg. Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockKeywordData.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 px-4">{item.keyword}</td>
                              <td className="text-right py-3 px-4">{item.clicks}</td>
                              <td className="text-right py-3 px-4">{item.impressions}</td>
                              <td className="text-right py-3 px-4">{item.position.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === 'pages' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Page Performance</CardTitle>
                    <CardDescription>
                      Performance metrics by page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { page: '/home', clicks: 145 },
                          { page: '/destinations', clicks: 120 },
                          { page: '/travel-guide', clicks: 95 },
                          { page: '/hotels', clicks: 85 },
                          { page: '/flights', clicks: 75 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="page" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="clicks" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Google Search Console Integration</CardTitle>
              <CardDescription>
                Connect your Google Search Console account to view detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Connect Google Search Console</h3>
                <p className="text-muted-foreground mb-4">
                  Link your Google Search Console account to access search analytics data
                </p>
                <Button 
                  className="bg-[#4285F4] text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-[#3367d6] transition-colors"
                  onClick={handleConnectGSC}
                  disabled={isConnecting}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" className="mr-2">
                    <path d="M12.545 12.151L12.542 12.147L12.551 12.156L12.545 12.151Z"></path>
                    <path d="M11.9999 4.99998C13.6999 4.99998 15.1999 5.69998 16.2999 6.69998L19.5999 3.39998C17.4999 1.49998 14.8999 0.199982 11.9999 0.199982C7.49994 0.199982 3.59994 2.99998 1.59994 6.99998L5.29994 9.89998C6.29994 7.09998 8.89994 4.99998 11.9999 4.99998Z" fill="#EA4335"></path>
                    <path d="M23.49 12.27C23.49 11.48 23.41 10.73 23.27 9.99998H11.99V14.51H18.47C18.22 15.99 17.4 17.25 16.12 18.08L19.74 20.94C21.94 18.89 23.49 15.84 23.49 12.27Z" fill="#4285F4"></path>
                    <path d="M5.29994 14.1C5.06994 13.44 4.93994 12.73 4.93994 12C4.93994 11.28 5.06994 10.58 5.28994 9.92998L1.58994 7.02998C0.889941 8.53998 0.499941 10.22 0.499941 12C0.499941 13.78 0.889941 15.46 1.58994 16.97L5.29994 14.1Z" fill="#FBBC05"></path>
                    <path d="M12.0001 23.8C15.0001 23.8 17.5801 22.79 19.7401 20.94L16.1201 18.08C15.0401 18.81 13.6401 19.25 12.0001 19.25C8.90005 19.25 6.30005 17.15 5.30005 14.35L1.60005 17.25C3.60005 21.25 7.50005 23.8 12.0001 23.8Z" fill="#34A853"></path>
                  </svg>
                  {isConnecting ? "Connecting..." : "Connect with Google"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Analytics Features Coming Soon</CardTitle>
            <CardDescription>
              Upcoming features for the analytics dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Advanced keyword performance tracking with historical data</li>
              <li>AI-powered content optimization recommendations</li>
              <li>Competitor analysis and benchmarking</li>
              <li>Custom reporting and exports</li>
              <li>Integration with Google Analytics for advanced user behavior insights</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
