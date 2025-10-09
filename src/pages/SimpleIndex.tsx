import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import cloudnynLogo from "@/assets/cloudnyn-logo.svg";

const SimpleIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm">
            <img src={cloudnynLogo} alt="CloudNyn" className="h-4 w-auto" />
            <span>AI-Powered Social Media Strategy</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
            Know exactly what to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">post next</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI analyzes your account performance and tells you exactly what content
            to create, when to post it, and which hashtags to use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
            >
              <img src={cloudnynLogo} alt="CloudNyn" className="mr-2 h-5 w-auto" />
              Get Started Free
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              View Demo
            </Button>
          </div>

          <p className="text-sm text-gray-400">
            No credit card required • 7-day free trial
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-400 text-xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Past Performance</h3>
              <p className="text-gray-300">
                Deep dive into your engagement, reach, and top-performing content
                with beautiful visualizations.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-400 text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Current Trends</h3>
              <p className="text-gray-300">
                Discover patterns in audience activity, retention rates, and content
                type performance.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-400 text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Action Plan</h3>
              <p className="text-gray-300">
                Get a complete 7-day content calendar with topics, hashtags, and
                optimal posting times.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleIndex;

