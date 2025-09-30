import React from 'react';

const options = ['applied', 'interview', 'offer', 'rejected'];

const StatusDropdown = ({ currentStatus, onChange }) => {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onChange(e, e.target.value)}
      className="
        border
        border-[#64748B]
        rounded-md
        px-3
        py-1.5
        text-sm
        text-[#1E293B]
        placeholder:text-[#94A3B8]
        focus:outline-none
        focus:ring-2
        focus:ring-[#3B82F6]
        focus:border-[#3B82F6]
        transition
        duration-200
        cursor-pointer
      "
    >
      {options.map((status) => (
        <option key={status} value={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
