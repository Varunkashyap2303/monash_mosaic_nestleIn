import React from 'react';
import Map from './Map';

const MapDemo = () => {
  const sampleLocation = {
    lat: -37.8136,
    lng: 144.9631,
    address: '123 Collins Street, Melbourne VIC 3000'
  };

  return (
    <div className="min-h-screen artistic-bg-5 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Map Demo</h2>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample Pod Location</h3>
        <Map 
          location={sampleLocation}
          podName="A"
          address={sampleLocation.address}
        />
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>✅ Free OpenStreetMap Integration</strong>
          </p>
          <ul className="text-sm text-green-700 mt-2 list-disc list-inside space-y-1">
            <li>No API key required</li>
            <li>Completely free to use</li>
            <li>Open-source mapping data</li>
            <li>Works immediately without setup</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapDemo; 