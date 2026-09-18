import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HR & Workforce Analytics',
    short_name: 'Workforce Analytics',
    description:
      'Employee performance and workforce analytics platform',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [],
  };
}