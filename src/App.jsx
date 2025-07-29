import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import FormPage from './components/FormPage';
import DataView from './components/DataView';
import ScreenshotButton from './components/ScreenshotButton';
import './App.css';

function App() {
  const [submittedData, setSubmittedData] = useState(null);
  const [hideScreenshot, setHideScreenshot] = useState(false);
  const dataViewRef = useRef();

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
  };

  const handleScreenshot = async () => {
    setHideScreenshot(true);
    await new Promise((r) => setTimeout(r, 100)); // Wait for button to hide
    if (dataViewRef.current) {
      html2canvas(dataViewRef.current, { useCORS: true, backgroundColor: null, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'data-view.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
    setHideScreenshot(false);
  };

  return (
    <div className="app-container">
      {!submittedData ? (
        <FormPage onSubmit={handleFormSubmit} />
      ) : (
        <div style={{ position: 'relative' }}>
          <div ref={dataViewRef}>
            <DataView data={submittedData} hideScreenshot={hideScreenshot} />
          </div>
          {!hideScreenshot && <ScreenshotButton onClick={handleScreenshot} />}
        </div>
      )}
    </div>
  );
}

export default App;
