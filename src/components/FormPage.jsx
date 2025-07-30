import React, { useState, useRef, useCallback } from 'react';
import './FormPage.css';

// --- Icon Components (No change, kept for context) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>;

// --- Reusable Form Field Component ---
const FormField = ({ id, name, label, type = "text", value, onChange }) => (
  <div className="input-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      required
      className="input"
    />
  </div>
);

// --- Reusable Select Field Component ---
const SelectField = ({ id, name, label, value, onChange, options }) => (
    <div className="input-group">
        <label htmlFor={id}>{label}</label>
        <select
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            required
            className="select"
        >
            <option value="" disabled>Select an option</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);


// --- Encapsulated Image Uploader Component ---
const ImageUploader = ({ onFileChange }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef();

    const handleImageChange = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            onFileChange(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, [onFileChange]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    }, [handleImageChange]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleFileInput = (e) => {
        if (e.target.files?.[0]) {
            handleImageChange(e.target.files[0]);
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setImagePreview(null);
        onFileChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <div className="form-section-header">Profile Image</div>
            <div
                className={`image-upload ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current.click()}
            >
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                        <button onClick={handleRemoveImage} type="button" className="remove-image-btn">
                            Remove
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: '#60a5fa', fontWeight: '600' }}>
                        <UploadIcon/>
                        Drag & drop or click to upload
                        <div className="upload-note">PNG, JPG, GIF up to 10MB</div>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept="image/*"
                    className="hidden" // Assuming .hidden is display: none;
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};


// --- Main Form Component (Now much cleaner) ---
const FormPage = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        payAmount: '',
        year: '',
        lifeCoverAmount: '',
        monthlyIncome: '',
        forYear: '',
        maturityAmount: '',
        goldReturnAmount: '',
        contact: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageFileChange = (file) => {
        setFormData(prev => ({ ...prev, image: file }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
        console.log('Form Submitted:', formData); // For testing
    };

    const contactOptions = [
        { value: 'abraham', label: 'Abraham' },
        { value: 'Nibu', label: 'Nibu' },
        { value: 'George', label: 'George' }
    ];

    return (
        <div className="form-bg">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-title">Profile Form</div>
                <div className="form-sections">
                    {/* --- Left Column: Details --- */}
                    <div>
                        <div className="form-section-header">Personal Details</div>
                        <FormField id="name" name="name" label="Name" value={formData.name} onChange={handleChange} />
                        <FormField id="age" name="age" label="Age" type="number" value={formData.age} onChange={handleChange} />
                        <FormField id="year" name="year" label="Year" type="number" value={formData.year} onChange={handleChange} />
                        <SelectField id="contact" name="contact" label="Contact" value={formData.contact} onChange={handleChange} options={contactOptions}/>

                        <div className="form-section-header">Financial Details</div>
                        <FormField id="payAmount" name="payAmount" label="Pay Amount" type="number" value={formData.payAmount} onChange={handleChange} />
                        <FormField id="lifeCoverAmount" name="lifeCoverAmount" label="Life Cover Amount" type="number" value={formData.lifeCoverAmount} onChange={handleChange} />
                        <FormField id="monthlyIncome" name="monthlyIncome" label="Monthly Income" type="number" value={formData.monthlyIncome} onChange={handleChange} />
                        <FormField id="forYear" name="forYear" label="For Year" type="number" value={formData.forYear} onChange={handleChange} />
                        <FormField id="maturityAmount" name="maturityAmount" label="Maturity Amount" type="number" value={formData.maturityAmount} onChange={handleChange} />
                        <FormField id="goldReturnAmount" name="goldReturnAmount" label="Gold Return Amount" type="number" value={formData.goldReturnAmount} onChange={handleChange} />
                    </div>

                    {/* --- Right Column: Image --- */}
                    <ImageUploader onFileChange={handleImageFileChange} />
                </div>

                <button type="submit" className="submit-btn">Create Profile</button>
            </form>
        </div>
    );
};

export default FormPage;