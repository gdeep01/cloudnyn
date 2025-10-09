import { Button } from "@/components/ui/button";

const Test = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">CloudNyn Test</h1>
        <p className="text-gray-600 mb-4">If you can see this, the basic setup is working!</p>
        <Button>Test Button</Button>
      </div>
    </div>
  );
};

export default Test;

