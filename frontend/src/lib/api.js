// ✅ Multiple mock pods with location data
const pods = [
  { 
    id: 1, 
    name: 'A', 
    available: true,
    location: {
      lat: -37.8136,
      lng: 144.9631,
      address: '123 Collins Street, Melbourne VIC 3000'
    }
  },
  { 
    id: 2, 
    name: 'B', 
    available: true,
    location: {
      lat: -37.8140,
      lng: 144.9635,
      address: '125 Collins Street, Melbourne VIC 3000'
    }
  },
  { 
    id: 3, 
    name: 'C', 
    available: false,
    location: {
      lat: -37.8138,
      lng: 144.9633,
      address: '127 Collins Street, Melbourne VIC 3000'
    }
  },
  { 
    id: 4, 
    name: 'D', 
    available: true,
    location: {
      lat: -37.8134,
      lng: 144.9629,
      address: '129 Collins Street, Melbourne VIC 3000'
    }
  },
  { 
    id: 5, 
    name: 'E', 
    available: true,
    location: {
      lat: -37.8132,
      lng: 144.9627,
      address: '131 Collins Street, Melbourne VIC 3000'
    }
  },
  { 
    id: 6, 
    name: 'F', 
    available: true,
    location: {
      lat: -37.8130,
      lng: 144.9625,
      address: '133 Collins Street, Melbourne VIC 3000'
    }
  },
  { 
    id: 7, 
    name: 'G', 
    available: false,
    location: {
      lat: -37.8128,
      lng: 144.9623,
      address: '135 Collins Street, Melbourne VIC 3000'
    }
  },
  { 
    id: 8, 
    name: 'H', 
    available: true,
    location: {
      lat: -37.8126,
      lng: 144.9621,
      address: '137 Collins Street, Melbourne VIC 3000'
    }
  },
];

// ✅ Returns all pods (you can filter for availability if needed)
export function getAvailablePods() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pods); // use pods.filter(p => p.available) to show only available
    }, 300);
  });
}

// ✅ Get a specific pod by ID
export function getPodById(podId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pod = pods.find((p) => p.id === podId);
      resolve(pod);
    }, 100);
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
      resolve({ success: true, podId, timeSlot, pod });
    }, 500);
  });
}
