import React from 'react';

const DataView = ({ data, hideScreenshot }) => {
  return (
    <div className="data-view flex flex-col items-center gap-4 p-6 rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Submitted Data</h2>
      <div className="w-full flex flex-col gap-2 text-gray-700">
        <div><span className="font-bold">Name:</span> {data.name}</div>
        <div><span className="font-bold">Age:</span> {data.age}</div>
        <div><span className="font-bold">Year:</span> {data.year}</div>
      </div>
      {data.image && (
        <img
          src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
          alt="Uploaded"
          className="mt-4 rounded-lg border border-gray-200 max-w-xs max-h-48"
        />
      )}
      {/* Screenshot button placeholder, hidden in screenshot */}
      {!hideScreenshot && <div id="screenshot-btn-placeholder" />}
    </div>
  );
};

export default DataView;
