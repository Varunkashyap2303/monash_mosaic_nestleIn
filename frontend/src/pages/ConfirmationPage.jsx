import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';

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
    <div className="min-h-screen artistic-bg-4 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed 🎉</h2>
          <p className="text-gray-700 text-lg mb-6">
            Your booking for <span className="font-semibold">Pod {booking.podId}</span> at
            <br />
            <span className="text-blue-600">{new Date(booking.timeSlot).toLocaleString()}</span> is confirmed.
          </p>
          {booking.pod && (
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                <strong>Location:</strong> {booking.pod.location.address}
              </p>
            </div>
          )}
        </div>
        
        {booking.pod && booking.pod.location && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Your Pod Location</h3>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <Map 
                location={booking.pod.location}
                podName={booking.pod.name}
                address={booking.pod.location.address}
              />
            </div>
          </div>
        )}
        
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
