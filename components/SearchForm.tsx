import React, { useState } from "react";

interface SearchFormValues {
  from: string;
  to: string;
  date: string;
}

interface SearchFormProps {
  initialValues: SearchFormValues;
  onSearch: (values: SearchFormValues) => void;
}

export default function SearchForm({ initialValues, onSearch }: SearchFormProps) {
  const [values, setValues] = useState<SearchFormValues>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 md:items-end"
    >
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">From</label>
        <input
          type="text"
          name="from"
          value={values.from}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">To</label>
        <input
          type="text"
          name="to"
          value={values.to}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={values.date}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
      >
        Search
      </button>
    </form>
  );
}