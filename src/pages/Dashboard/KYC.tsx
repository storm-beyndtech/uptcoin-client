import { contextData } from '@/context/AuthContext';
import KYCStatus from '@/components/KYCStatus';
import KYCForm from '@/components/KycForm';

export default function KYC() {
  const { user } = contextData();

  if (user.kycStatus === 'notSubmitted') {
    return <KYCForm />;
  } else {
    return <KYCStatus user={user} />;
  }
}
