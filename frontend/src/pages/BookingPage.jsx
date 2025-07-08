import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PodList from '../components/PodList';
import BookingForm from '../components/BookingForm';
import { getAvailablePods, bookPod } from '../lib/api';

export default function BookingPage() {
  const [selectedPod, setSelectedPod] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Book a Sleeping Pod";
  }, []);

  const handlePodSelect = (pod) => {
    setSelectedPod(pod);
  };

  const handleBookingSubmit = (podId, timeSlot) => {
    bookPod(podId, timeSlot).then((res) => {
      if (res.success) {
        localStorage.setItem('lastBooking', JSON.stringify({ podId, timeSlot }));
        navigate('/confirmation');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Book a Sleeping Pod</h2>
        {!selectedPod ? (
          <PodList onSelectPod={handlePodSelect} />
        ) : (
          <BookingForm pod={selectedPod} onSubmit={handleBookingSubmit} />
        )}
      </div>
    </div>
  );
}
