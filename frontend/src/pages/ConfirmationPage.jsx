import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfirmationPage() {
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('lastBooking');
    if (stored) {
      setBooking(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-200 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed 🎉</h2>
        <p className="text-gray-700 text-lg mb-6">
          Your booking for <span className="font-semibold">Pod {booking.podId}</span> at
          <br />
          <span className="text-blue-600">{new Date(booking.timeSlot).toLocaleString()}</span> is confirmed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
