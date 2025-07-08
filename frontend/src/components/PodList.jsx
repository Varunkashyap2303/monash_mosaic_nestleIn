import { useEffect, useState } from 'react';
import PodCard from './PodCard';
import { getAvailablePods } from '../lib/api';

export default function PodList({ onSelectPod }) {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    getAvailablePods().then(setPods);
  }, []);

  return (
    <div className="space-y-4">
      {pods.map((pod) => (
        <PodCard key={pod.id} pod={pod} onBook={onSelectPod} />
      ))}
    </div>
  );
}
