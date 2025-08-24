import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Search from "../components/searchBar";
import { Card } from "flowbite-react";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Search & Discovery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through tournaments, players, and bars to find exactly what
            you're looking for.
          </p>
        </div>

        {/* Search Section */}
        <Card className="shadow-lg max-w-4xl mx-auto">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Advanced Search
              </h2>
              <p className="text-gray-600">
                Use the search tools below to find tournaments, players, or
                bars.
              </p>
            </div>

            <Search />
          </div>
        </Card>
      </div>
    </div>
  );
}
