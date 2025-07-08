// ✅ Multiple mock pods
const pods = [
  { id: 1, name: 'A', available: true },
  { id: 2, name: 'B', available: true },
  { id: 3, name: 'C', available: false },
  { id: 4, name: 'D', available: true },
  { id: 5, name: 'E', available: true },
  { id: 6, name: 'F', available: true },
  { id: 7, name: 'G', available: false },
  { id: 8, name: 'H', available: true },
];

// ✅ Returns all pods (you can filter for availability if needed)
export function getAvailablePods() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pods); // use pods.filter(p => p.available) to show only available
    }, 300);
  });
}

// ✅ Simulate booking
export function bookPod(podId, timeSlot) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pod = pods.find((p) => p.id === podId);
      if (pod) {
        pod.available = false;
      }
      resolve({ success: true, podId, timeSlot });
    }, 500);
  });
}
