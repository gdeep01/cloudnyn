import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Target, Calendar, Instagram } from "lucide-react";
import { ProtectedRouteSimple } from "@/components/ProtectedRouteSimple";
import { useAuthSimple } from "@/hooks/useAuthSimple";

const SimpleDashboard = () => {
  const { user, signOut } = useAuthSimple();

  return (
    <ProtectedRouteSimple>
      <div className="min-h-screen p-6 md:p-8 bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {user?.email}!
              </h1>
              <p className="text-gray-300">
                Your AI-powered social media dashboard
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={signOut}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Sign Out
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Engagement</h3>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-2">12,847</p>
              <p className="text-sm text-green-400">↑ 12.5% vs last week</p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Reach</h3>
              </div>
              <p className="text-3xl font-bold text-purple-400 mb-2">45,230</p>
              <p className="text-sm text-green-400">↑ 8.3% vs last week</p>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Posts This Week</h3>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-2">7</p>
              <p className="text-sm text-green-400">↑ 2 more than last week</p>
            </Card>
          </div>

          {/* Instagram Section */}
          <Card className="bg-gray-800/50 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Instagram Analytics</h2>
            </div>
            
            <div className="text-center py-8">
              <div className="bg-gray-700/50 rounded-lg p-6 max-w-md mx-auto">
                <Instagram className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Connect Instagram</h3>
                <p className="text-gray-300 mb-4">
                  Connect your Instagram Business account to see detailed analytics and AI-powered insights.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                  Connect Instagram
                </Button>
              </div>
            </div>
          </Card>

          {/* AI Insights Section */}
          <Card className="bg-gray-800/50 border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">AI Content Suggestions</h2>
            </div>
            
            <div className="grid gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Monday</h4>
                  <span className="text-sm text-gray-400">6:00 PM</span>
                </div>
                <p className="text-gray-300">
                  <span className="text-blue-400 font-medium">Reel:</span> Behind-the-scenes content
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded-full text-blue-400">#BehindTheScenes</span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded-full text-blue-400">#CreatorLife</span>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">Tuesday</h4>
                  <span className="text-sm text-gray-400">2:00 PM</span>
                </div>
                <p className="text-gray-300">
                  <span className="text-purple-400 font-medium">Carousel:</span> Tips & tricks in your niche
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded-full text-purple-400">#ProTips</span>
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded-full text-purple-400">#Tutorial</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRouteSimple>
  );
};

export default SimpleDashboard;

