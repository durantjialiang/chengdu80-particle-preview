'use client';

import CityNodes, { type LabelElements } from '@/components/Hero/CityNodes';
import DataStreams from '@/components/Hero/DataStreams';
import type { LayerProps } from '@/components/Hero/scene-config';

// Network composition retained at the existing entry point; render layers are independent.
export default function ParticleNetwork(props: LayerProps & { labels: LabelElements }) {
  return <group><CityNodes {...props} /><DataStreams {...props} /></group>;
}
