// components/DobSelector.tsx
import { useState, useEffect } from "react";

interface DobSelectorProps {
  editedValues: {
    pan_josn: {
      dob?: string;
      [key: string]: any;
    };
    user_json: {
      dob?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  setEditedValues: React.Dispatch<React.SetStateAction<any>>;
}

const DobSelector: React.FC<DobSelectorProps> = ({ editedValues, setEditedValues }) => {
  const [dob, setDob] = useState({ year: "", month: "", day: "" });

  useEffect(() => {
    const [year, month, day] = (editedValues.pan_josn?.dob || "").split("-");
    setDob({
      year: year || "",
      month: month || "",
      day: day || "",
    });
  }, [editedValues.pan_josn?.dob]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => `${currentYear - i}`);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

  const handleDobChange = (value: string, part: "year" | "month" | "day") => {
    const updated = {
      ...dob,
      [part]: value,
    };
    setDob(updated);

    const formattedDob = `${updated.year}-${updated.month}-${updated.day}`;

    setEditedValues((prev: any) => ({
      ...prev,
      user_json: {
        ...prev.user_json,
        dob: formattedDob,
      },
      pan_josn: {
        ...prev.pan_josn,
        dob: formattedDob,
      },
    }));
  };

  return (
    <div className="w-full flex items-center gap-2">
      <div className="flex flex-col w-full">
        <label className="block text-sm font-medium text-gray-700">DOB</label>
        <div className="flex gap-4 mt-1">
          {/* Year */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1" htmlFor="dob-year">Year</label>
            <select
              id="dob-year"
              value={dob.year}
              onChange={(e) => handleDobChange(e.target.value, "year")}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="">YYYY</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1" htmlFor="dob-month">Month</label>
            <select
              id="dob-month"
              value={dob.month}
              onChange={(e) => handleDobChange(e.target.value, "month")}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="">MM</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1" htmlFor="dob-day">Day</label>
            <select
              id="dob-day"
              value={dob.day}
              onChange={(e) => handleDobChange(e.target.value, "day")}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="">DD</option>
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DobSelector;
