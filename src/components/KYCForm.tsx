import Alert from '@/components/UI/Alert';
import FileUpload from '@/components/UI/FileUpload';
import { contextData } from '@/context/AuthContext';
import { countries } from '@/lib/countries';
import { sendRequest } from '@/lib/sendRequest';
import { useState } from 'react';

export default function KYCForm() {
  const { user, refreshUser } = contextData();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [citizen, setCitizen] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (!firstName) return setError('First name is required.');
    if (!lastName) return setError('Last name is required.');
    if (!dob) return setError('Date of birth is required.');
    if (!phoneNumber) return setError('Phone number is required.');
    if (!citizen) return setError('Please select your citizenship.');
    if (!documentType) return setError('Please select a document type.');
    if (!documentNumber) return setError('Document number is required.');
    if (!documentFront) return setError('Front view of document is required.');
    if (!documentBack) return setError('Back view of document is required.');

    if (documentFront.size > 5 * 1024 * 1024) {
      return setError('Front document exceeds the 5MB size limit.');
    }
    if (documentBack.size > 5 * 1024 * 1024) {
      return setError('Back document exceeds the 5MB size limit.');
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('dateOfBirth', dob);
    formData.append('phone', phoneNumber);
    formData.append('country', citizen);
    formData.append('documentType', documentType);
    formData.append('documentNumber', documentNumber);
    formData.append('documentFront', documentFront);
    formData.append('documentBack', documentBack);

    try {
      setIsSubmitting(true);
      // Send all data in one request
      const { message } = await sendRequest(
        '/auth/complete-kyc',
        'PUT',
        formData,
      );

      setSuccess(message);
      setTimeout(() => refreshUser(), 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white max-lg:bg-transparent p-5 max-lg:pt-10 rounded">
      <Alert
        type="simple"
        message="Complete the KYC information below to update your account. You'll be verified within 24 hours and gain full access."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">First name</label>
          <input
            type="text"
            className="input mb-4"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Last name</label>
          <input
            type="text"
            className="input mb-4"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Date of birth</label>
          <input
            type="date"
            className="input mb-4"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Phone number</label>
          <input
            type="text"
            className="input mb-4"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Citizen</label>
          <select
            className="input mb-4"
            value={citizen}
            onChange={(e) => setCitizen(e.target.value)}
          >
            <option value="" disabled>
              Choose citizen
            </option>
            {countries.map((country, i) => (
              <option key={i} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Document Type</label>
          <select
            className="input mb-4"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <option value="">Choose document</option>
            <option value="Driver Licence">Driver Licence</option>
            <option value="Passport">Passport</option>
            <option value="ID Card">ID Card</option>
          </select>
        </div>

        <div>
          <label className="label">Document number</label>
          <input
            type="text"
            className="input mb-4"
            placeholder="Enter document's number"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />
        </div>

        {/* Document upload front and back */}
        <div className="flex space-x-6">
          <FileUpload
            label="Upload Document Front"
            selectedFile={documentFront}
            onChange={(e) =>
              setDocumentFront(e.target.files ? e.target.files[0] : null)
            }
          />
          <FileUpload
            label="Upload Document Back"
            selectedFile={documentBack}
            onChange={(e) =>
              setDocumentBack(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        <button
          type="button"
          className="text-sm px-6 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
