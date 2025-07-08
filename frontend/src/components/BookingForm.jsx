import { useState } from 'react';

export default function BookingForm({ pod, onSubmit }) {
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pod.id, time);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Book Pod {pod.name}</h4>
        <label htmlFor="datetime" className="block text-gray-600 text-sm mb-1">
          Select Date & Time:
        </label>
        <input
          id="datetime"
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        Confirm Booking
      </button>
    </form>
  );
}
