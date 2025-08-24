import { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";

export default function DateRangeFilter({ onDateRangeChange, onReset }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      onDateRangeChange({ startDate, endDate });
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onReset();
  };

  const isFilterActive = startDate || endDate;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2">
            📅 Start Date
          </Label>
          <TextInput
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex-1">
          <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2">
            📅 End Date
          </Label>
          <TextInput
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            color="blue"
            size="sm"
            onClick={handleApplyFilter}
            disabled={!startDate || !endDate}
            className="whitespace-nowrap"
          >
            🔍 Apply Filter
          </Button>
          
          {isFilterActive && (
            <Button
              color="gray"
              size="sm"
              outline
              onClick={handleReset}
              className="whitespace-nowrap"
            >
              🗑️ Clear
            </Button>
          )}
        </div>
      </div>
      
      {isFilterActive && (
        <div className="mt-3 text-sm text-gray-600">
          📊 Showing players with tournament activity from{" "}
          <span className="font-medium">{startDate}</span> to{" "}
          <span className="font-medium">{endDate}</span>
        </div>
      )}
    </div>
  );
}
