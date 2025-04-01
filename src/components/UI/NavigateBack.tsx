import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NavigateBack() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return <ArrowLeft onClick={handleGoBack} className="cursor-pointer" />;
}
