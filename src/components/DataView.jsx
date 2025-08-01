import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';

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

// --- Icon Components ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="upload-icon-svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;


// --- Encapsulated Image Uploader Component ---
const ImageUploader = ({ onFileChange }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef();

    const handleImageChange = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                onFileChange(reader.result); // Pass data URL instead of File
            };
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
                            &times;
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', fontWeight: '600' }}>
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
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};


// --- Form Page Component ---
const contactOptions = [
    { value: 'Abraham K J : 9847365760', label: 'Abraham K J : 9847365760' },
    { value: 'Nibu Mathew : 9847175444', label: 'Nibu Mathew : 9847175444' },
    { value: 'George Thomas : 9995447498', label: 'George Thomas : 9995447498' }
];

const contactPhones = {
    'Abraham K J': '9847365760',
    'Nibu Mathew': '9847175444',
    'George Thomas': '9995447498'
};

console.debug('contactPhones:', contactPhones);

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
        swp_year: '',
        swp_amount: '',
        image: null // Will now be a data URL
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
    };

    return (
        <div className="form-bg">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-title">Create a Financial Poster</div>
                <div className="form-sections">
                    <div>
                        <div className="form-section-header">Personal Details</div>
                        <FormField id="name" name="name" label="Name" value={formData.name} onChange={handleChange} />
                        <FormField id="age" name="age" label="Age" type="number" value={formData.age} onChange={handleChange} />
                        <SelectField id="contact" name="contact" label="Contact Person" value={formData.contact} onChange={handleChange} options={contactOptions}/>

                        <div className="form-section-header">Financial Details</div>
                        <FormField id="payAmount" name="payAmount" label="Pay Amount (per year)" type="number" value={formData.payAmount} onChange={handleChange} />
                        <FormField id="forYear" name="forYear" label="Payment Term (Years)" type="number" value={formData.forYear} onChange={handleChange} />
                        <FormField id="lifeCoverAmount" name="lifeCoverAmount" label="Life Cover Amount" type="number" value={formData.lifeCoverAmount} onChange={handleChange} />
                        <FormField id="monthlyIncome" name="monthlyIncome" label="Guaranteed Monthly Income" type="number" value={formData.monthlyIncome} onChange={handleChange} />
                        <FormField id="maturityAmount" name="maturityAmount" label="Maturity Amount" type="number" value={formData.maturityAmount} onChange={handleChange} />
                        <FormField id="goldReturnAmount" name="goldReturnAmount" label="Total Gold Return" type="number" value={formData.goldReturnAmount} onChange={handleChange} />
                        <FormField id="swp_year" name="swp_year" label="SWP Term (Years)" type="number" value={formData.swp_year} onChange={handleChange} />
                        <FormField id="swp_amount" name="swp_amount" label="SWP Amount (per month)" type="number" value={formData.swp_amount} onChange={handleChange} />
                    </div>
                    <ImageUploader onFileChange={handleImageFileChange} />
                </div>
                <button type="submit" className="submit-btn">Create Profile</button>
            </form>
        </div>
    );
};


// --- Details Page / Poster Component ---
const warrenBuffettQuotes = [
  "Price is what you pay. Value is what you get.",
  "Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1.",
  "Risk comes from not knowing what you're doing.",
  "Someone's sitting in the shade today because someone planted a tree a long time ago.",
  "The most important investment you can make is in yourself.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "It is not necessary to do extraordinary things to get extraordinary results.",
  "Our favorite holding period is forever.",
  "The stock market is designed to transfer money from the Active to the Patient.",
  "Opportunities come infrequently. When it rains gold, put out the bucket, not the thimble."
];

const DetailsPage = ({ data, onBack }) => {
  const posterRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showQuote, setShowQuote] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(() => warrenBuffettQuotes[Math.floor(Math.random() * warrenBuffettQuotes.length)]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const shuffleQuote = () => {
    let newQuote;
    do {
      newQuote = warrenBuffettQuotes[Math.floor(Math.random() * warrenBuffettQuotes.length)];
    } while (newQuote === currentQuote && warrenBuffettQuotes.length > 1);
    setCurrentQuote(newQuote);
    setShowQuote(true);
  };

  const hideQuote = () => setShowQuote(false);

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    setIsCapturing(true);

    setTimeout(async () => {
      try {
        const dataUrl = await toPng(posterRef.current, {
          cacheBust: true,
          quality: 1.0,
          pixelRatio: 3, // High resolution
        });
        const link = document.createElement('a');
        link.download = `${data.name || 'user'}-pru-gold-sip-plan.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to capture image', err);
      } finally {
        setIsCapturing(false);
      }
    }, 100);
  }, [data.name]);

  return (
    <div className="details-page-container">
      <div className="poster-wrapper" ref={posterRef}>
        <header className="poster-header">
          <span className="gold-text">I PRU Gold + SIP + SWP</span>
        </header>
        <main className="poster-content">
          <div className="details-section">
            <div style={{ fontSize: '1rem', color: '#666', fontWeight: 400, marginBottom: '0.5rem', letterSpacing: '0.1px' }}>
              Retirement plan prepared for <span style={{color:'#222'}}>{data.name}</span>
            </div>
            <p className="details-main-pitch">
              Pay ₹{formatCurrency(data.payAmount)} for {data.forYear || '10'} years, get:
            </p>
            <ul className="details-list">
              <li>Tax Free Returns</li>
              <li>Life Cover of ₹{formatCurrency(data.lifeCoverAmount)}</li>
              <li>Monthly Income of ₹{formatCurrency(data.monthlyIncome)} for 30 years and ₹{formatCurrency(data.maturityAmount)} at Maturity</li>
              <li>Total Gold Return - ₹{formatCurrency(data.goldReturnAmount)}</li>
              <li>Run SIP of ₹{formatCurrency(data.monthlyIncome)} per month for next 30 years without break</li>
              <li>Starting from the {data.swp_year}th year, a monthly withdrawal of ₹{formatCurrency(data.swp_amount)} will be made through SWP</li>
            </ul>
            {/* Warren Buffett Quote Section */}
            {showQuote && (
              <div style={{marginTop: '2rem', background: '#fffbe6', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
                <span style={{fontStyle: 'italic', color: '#8C1515', fontWeight: 500}}>
                  "{currentQuote}"<br/>
                  <span style={{fontWeight: 'bold', color: '#333'}}>– Warren Buffett</span>
                </span>
              </div>
            )}
          </div>
          <div className="image-section">
            {data.image && (
              <img
                src={data.image}
                alt={`${data.name}'s profile`}
                className="profile-image"
              />
            )}
            
          </div>
          <span></span>
          
        </main>
        <footer className="poster-footer">
            <span></span>
            <span>Contact {contactOptions.find(opt => opt.value === data.contact)?.label || data.contact}</span>
        </footer>
      </div>
      {!isCapturing && (
          <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap'}}>
            <button onClick={onBack} className="download-button" style={{backgroundColor: '#6c757d'}}>Back to Edit</button>
            <button onClick={handleDownload} className="download-button">
              <DownloadIcon />
              Download Poster
            </button>
            <button className="download-button" style={{backgroundColor: '#FFD700', color: '#333', fontWeight: 600}} onClick={shuffleQuote}>
              Shuffle Quote
            </button>
            <button className="download-button" style={{backgroundColor: '#6c757d'}} onClick={hideQuote}>
              Hide Quote
            </button>
          </div>
      )}
      {/* Copyright Footer */}
      <div style={{width: '100%', textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '0.95rem', letterSpacing: '0.5px'}}>
        © 2025 All rights belong to Joe Abraham K
      </div>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
  };

  const handleGoBack = () => {
      setSubmittedData(null);
  }

  return (
    <div className="App">
      {submittedData ? (
        <DetailsPage data={submittedData} onBack={handleGoBack} />
      ) : (
        <FormPage onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}
