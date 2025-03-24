import Alert from '@/components/UI/Alert';
import FileUpload from '@/components/UI/FileUpload';
import { countries } from '@/lib/countries';
import { useState } from 'react';

export default function KYC() {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [citizen, setCitizen] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [frontView, setFrontView] = useState<File | null>(null);
  const [backView, setBackView] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Validate the form
  const validateForm = (): boolean => {
    const validationErrors: string[] = [];
    if (!firstName) validationErrors.push('First name is required.');
    if (!lastName) validationErrors.push('Last name is required.');
    if (!dob) validationErrors.push('Date of birth is required.');
    if (!phoneNumber) validationErrors.push('Phone number is required.');
    if (!citizen) validationErrors.push('Please select your citizenship.');
    if (!documentType) validationErrors.push('Please select a document type.');
    if (!documentNumber) validationErrors.push('Document number is required.');
    if (!frontView)
      validationErrors.push('Front view of document is required.');
    if (!backView) validationErrors.push('Back view of document is required.');

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        firstName,
        lastName,
        dob,
        phoneNumber,
        citizen,
        documentType,
        documentNumber,
        frontView,
        backView,
      };
      console.log(formData);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white max-lg:bg-transparent p-5 max-lg:pt-10 rounded">
      <Alert
        type="simple"
        message="Complete the KYC information below to update your account. You'll be verified within 24 hours and gain full access."
      />

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

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
              <option key={i} value={country.code}>
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
            selectedFile={frontView}
            onChange={(e) =>
              setFrontView(e.target.files ? e.target.files[0] : null)
            }
          />
          <FileUpload
            label="Upload Document Back"
            selectedFile={backView}
            onChange={(e) =>
              setBackView(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <button
          type="button"
          className="text-sm px-6 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
