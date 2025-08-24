import { Link } from "react-router-dom";
import { Button, Card } from "flowbite-react";

export default function Lost() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="p-12">
            {/* 404 Icon */}
            <div className="text-8xl mb-6">🚫</div>

            {/* Error Message */}
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-700 mb-6">
              Page Not Found
            </h2>

            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have
              been moved, deleted, or you entered the wrong URL.
            </p>

            {/* Navigation Options */}
            <div className="space-y-4">
              <Button color="blue" size="lg" className="w-full py-3">
                <Link to="/" className="w-full">
                  🏠 Go to Homepage
                </Link>
              </Button>

              <div className="flex gap-3 justify-center">
                <Button color="gray" size="sm" outline>
                  <Link to="/tournaments">🏆 Tournaments</Link>
                </Button>
                <Button color="gray" size="sm" outline>
                  <Link to="/players">👥 Players</Link>
                </Button>
                <Button color="gray" size="sm" outline>
                  <Link to="/bars">🏪 Bars</Link>
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If you believe this is an error, please contact support or check
                the URL again.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
