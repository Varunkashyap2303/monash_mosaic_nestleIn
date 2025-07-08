export default function PodCard({ pod, onBook }) {
  return (
    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800">Pod {pod.name}</h3>
      <button
        onClick={() => onBook(pod)}
        disabled={!pod.available}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          pod.available
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        {pod.available ? 'Book Now' : 'Unavailable'}
      </button>
    </div>
  );
}
