import { useState } from "react";
import { Label, Datepicker } from "flowbite-react";

export default function Home() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateChange = (date) => {
    console.log(date);
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    let setstartDate = new Date(startDate.toDateString());
    let setendDate = new Date(endDate.toDateString());
    const url = "/api/points/dateRange";
    let payload = {
      startDate: setstartDate.toISOString().split("T")[0],
      endDate: setendDate.toISOString().split("T")[0],
    };
    const data = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    try {
      const res = await fetch(url, data);
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `points-report-${payload.startDate}-to-${payload.endDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <div>
      <div className="mt-2 flex flex-row justify-center gap-2">
        <form onSubmit={submitForm}>
          <Label htmlFor="datepicker-range-start">Start Date</Label>
          <Datepicker
            id="datepicker-range-start"
            title="Start Date"
            onSelectedDateChanged={handleStartDateChange}
          />
          <Label htmlFor="datepicker-range-end">End Date</Label>
          <Datepicker
            id="datepicker-range-end"
            title="End Date"
            onSelectedDateChanged={handleEndDateChange}
          />
          <div className="mt-2 flex flex-row justify-center gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-1 px-4 rounded"
            >
              Generate Points Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
