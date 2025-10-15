import React from 'react';
import { useRouter } from 'next/navigation';

// This page has been replaced by PublisherOfferPage
// Keeping this file to avoid breaking imports
const PublisherContractsPage: React.FC = () => {
  const router = useRouter();
  
  React.useEffect(() => {
    // Redirect to the new page
    router.push('/publisher/offer');
  }, [router]);
  
  return <div>Redirecting...</div>;
};

export default PublisherContractsPage;