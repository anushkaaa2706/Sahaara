import { useRef, useState } from 'react';
import { CareCircleCard } from '../components/CareCircleCard';
import { Link } from 'react-router-dom';
import {
  Heart,
  Pill,
  Calendar,
  ArrowLeft,
  Camera,
  Upload,
  RotateCcw,
  ScanText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  BookOpen,
  Footprints,
Mountain,
Clock3,
TrendingUp,
} from 'lucide-react';
import { createWorker } from 'tesseract.js';


interface PlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
}

function PlaceholderLayout({
  title,
  description,
  icon: Icon,
}: PlaceholderProps) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        <Icon size={40} />
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link
        to="/dashboard"
        className="btn btn-outline"
        id={`link-back-from-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
}

export function HealthPage() {
  const weeklySteps = [
    { day: 'Thu', steps: 4200 },
    { day: 'Fri', steps: 6100 },
    { day: 'Sat', steps: 7800 },
    { day: 'Sun', steps: 5300 },
    { day: 'Mon', steps: 7200 },
    { day: 'Tue', steps: 5900 },
    { day: 'Wed', steps: 6842 },
  ];

  const steps = 6842;
  const goal = 8000;
  const progress = Math.min((steps / goal) * 100, 100);

  return (
    <div className="page-content health-activity-page">
      <div className="health-demo-banner">
        DEMO PREVIEW · SAMPLE ACTIVITY DATA
      </div>

      <div className="health-activity-heading">
        <div>
          <p className="health-eyebrow">YOUR WELLNESS</p>
          <h1>Health & Activity</h1>
          <p>Your daily movement, at a glance.</p>
        </div>
        <div className="health-heading-icon">
          <Heart size={27} />
        </div>
      </div>

      <section className="health-activity-feature">
        <div className="health-feature-copy">
          <span className="health-feature-label">TODAY'S STEPS</span>
          <h2>{steps.toLocaleString('en-IN')}</h2>
          <p>of {goal.toLocaleString('en-IN')} steps goal</p>
          <div className="health-progress-track">
            <div
              className="health-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <strong>{Math.round(progress)}% of daily goal</strong>
        </div>

        <div
          className="health-step-ring"
          style={{
            background: `conic-gradient(#65b99b ${progress}%, #e6eee9 ${progress}% 100%)`,
          }}
        >
          <div className="health-step-ring-inner">
            <Footprints size={30} />
            <strong>{Math.round(progress)}%</strong>
          </div>
        </div>
      </section>

      <div className="health-metric-grid">
        <div className="health-metric-card">
          <div className="health-metric-icon stairs">
            <Mountain size={22} />
          </div>
          <p>Floors climbed</p>
          <h3>8 <span>floors</span></h3>
          <small>Keep moving safely</small>
        </div>

        <div className="health-metric-card">
          <div className="health-metric-icon active">
            <Clock3 size={22} />
          </div>
          <p>Active minutes</p>
          <h3>32 <span>min</span></h3>
          <small>Daily movement adds up</small>
        </div>
      </div>

      <section className="health-weekly-card">
        <div className="health-weekly-heading">
          <div>
            <h2>Weekly activity</h2>
            <p>Your movement over the last 7 days</p>
          </div>
          <TrendingUp size={23} />
        </div>

        <div className="health-weekly-chart">
          {weeklySteps.map((item) => (
            <div className="health-chart-day" key={item.day}>
              <span className="health-chart-value">
                {(item.steps / 1000).toFixed(1)}k
              </span>
              <div className="health-chart-bar-area">
                <div
                  className={`health-chart-bar ${
                    item.day === 'Wed' ? 'today' : ''
                  }`}
                  style={{
                    height: `${(item.steps / 8000) * 100}%`,
                  }}
                />
              </div>
              <span className="health-chart-day-label">{item.day}</span>
            </div>
          ))}
        </div>

        <div className="health-weekly-footer">
          <span>Daily goal: 8,000 steps</span>
          <span>Latest: 6,842 steps</span>
        </div>
      </section>

      <section className="health-wellness-note">
        <div className="health-note-icon">
          <Heart size={21} />
        </div>
        <div>
          <h3>Every step matters</h3>
          <p>
            Gentle, regular movement can support everyday wellbeing.
            Take breaks and use handrails when climbing stairs.
          </p>
        </div>
      </section>

      <p className="health-demo-disclaimer">
        Illustrative sample data for demonstration only. No activity tracker
        or health sensor is connected.
      </p>
    </div>
  );
}

export function MedicinesPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detectedText, setDetectedText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const [medicineQuery, setMedicineQuery] = useState('');
  const [medicineResults, setMedicineResults] = useState<
    { title: string; url: string }[]
  >([]);
  const [isSearchingMedicine, setIsSearchingMedicine] = useState(false);
  const [medicineSearchError, setMedicineSearchError] = useState('');
  const [medicineDisclaimer, setMedicineDisclaimer] = useState('');


  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(
    null,
  );
  
  

  function selectImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    if (imageUrl) URL.revokeObjectURL(imageUrl);

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setDetectedText('');
    setError('');
    setReviewed(false);
    setCameraError('');
  }

  async function openCamera() {
    setCameraError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Camera access is not available in this browser. Please upload a photo instead.',
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });

      streamRef.current = stream;
      setShowCamera(true);
      setCameraActive(true);

      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play().catch(() => {
            setCameraError('Unable to start the camera preview. Try uploading an image.');
          });
        }
      }, 100);
    } catch {
      setCameraError(
        'Camera permission was denied or the camera is unavailable. You can still upload a photo.',
      );
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
    setShowCamera(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError('Camera is not ready yet. Please try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      setCameraError('Unable to capture the image. Please upload a photo instead.');
      return;
    }

    context.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        selectImage(new File([blob], 'medicine-photo.jpg', { type: 'image/jpeg' }));
        stopCamera();
      } else {
        setCameraError('Photo capture failed. Please try again.');
      }
    }, 'image/jpeg', 0.92);
  }

  async function scanImage() {
    if (!imageFile) {
      setError('Take a photo or upload an image first.');
      return;
    }

    setIsScanning(true);
    setError('');
    setDetectedText('');
    setReviewed(false);

    try {
      

const worker = await createWorker('eng');
workerRef.current = worker;


const result = await worker.recognize(imageFile);

setDetectedText(result.data.text.trim());

await worker.terminate();
workerRef.current = null;


      if (!result.data.text.trim()) {
        setError(
          'No readable text was detected. Try a clearer, well-lit photo with the text in focus.',
        );
      }
    } catch {
      setError(
        'Text recognition could not finish. Check your internet connection and try again, or upload a clearer image.',
      );
      if (workerRef.current) {
        try {
          await workerRef.current.terminate();
        } catch {
          // Ignore cleanup errors.
        }
        workerRef.current = null;
      }
    } finally {
      setIsScanning(false);
    }
  }

  function resetScan() {
    stopCamera();
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl('');
    setImageFile(null);
    setDetectedText('');
    setError('');
    setReviewed(false);
    setCameraError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function searchMedicine() {
    const medicine = medicineQuery.trim();

    if (!medicine) {
      setMedicineSearchError('Please enter a medicine name.');
      return;
    }

    setIsSearchingMedicine(true);
    setMedicineSearchError('');
    setMedicineResults([]);
    setMedicineDisclaimer('');

    try {
      const response = await fetch('/api/medicine-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicine }),
      });

      const responseText = await response.text();

let data: {
  results?: { title: string; url: string }[];
  disclaimer?: string;
  error?: string;
};

try {
  data = JSON.parse(responseText);
} catch {
  throw new Error(
    `Medicine search returned an invalid response (HTTP ${response.status}). Check the API server.`
  );
}

if (!response.ok) {
  throw new Error(
    data.error || `Medicine search failed (HTTP ${response.status}).`
  );
}

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to search for medicine information.',
        );
      }

      setMedicineResults(
        Array.isArray(data.results) ? data.results : [],
      );
      setMedicineDisclaimer(data.disclaimer || '');
    } catch (error) {
      setMedicineSearchError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSearchingMedicine(false);
    }
  }


  return (
    <div className="page-content medicine-vision">
      <div className="medicine-hero">
        <div className="medicine-hero-icon">
          <Pill size={30} />
        </div>
        <div>
          <p className="medicine-eyebrow">SAHAARA ACCESSIBILITY TOOL</p>
          <h1>Medicine Companion</h1>
          <p>
            Read medicine packaging more easily. Scan a photo, review the
            detected text, and check it against the original packaging or prescription.
          </p>
        </div>
      </div>

      <div className="medicine-safety-note">
        <ShieldCheck size={22} />
        <div>
          <strong>Your safety comes first</strong>
          <p>
            This tool reads visible text only. It cannot confirm a medicine's
            identity, authenticity, suitability, or dosage.
          </p>
        </div>
      </div>

      <section className="medicine-panel">
        <div className="medicine-section-heading">
          <span className="medicine-step">1</span>
          <div>
            <h2>Scan your medicine packaging</h2>
            <p>Use a clear photo with good lighting and readable text.</p>
          </div>
        </div>

        <div className="medicine-actions">
          <button
            className="medicine-primary-button"
            type="button"
            onClick={() => void openCamera()}
            disabled={isScanning}
          >
            <Camera size={19} />
            Open Camera
          </button>
          <button
            className="medicine-secondary-button"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
          >
            <Upload size={19} />
            Upload Photo
          </button>
          <input
            ref={fileInputRef}
            className="medicine-file-input"
            type="file"
            accept="image/*"
            onChange={(event) => selectImage(event.target.files?.[0])}
            aria-label="Upload a medicine packaging photo"
          />
        </div>

        {cameraError && (
          <p className="medicine-inline-warning" role="alert">
            <AlertCircle size={18} />
            {cameraError}
          </p>
        )}

        {showCamera && (
          <div className="medicine-camera">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              aria-label="Live camera preview of medicine packaging"
            />
            <div className="medicine-actions">
              <button
                type="button"
                className="medicine-primary-button"
                onClick={capturePhoto}
                disabled={!cameraActive}
              >
                <Camera size={18} />
                Capture Photo
              </button>
              <button
                type="button"
                className="medicine-secondary-button"
                onClick={stopCamera}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="medicine-preview">
            <img src={imageUrl} alt="Selected medicine packaging preview" />
            <p>{imageFile?.name || 'Captured medicine photo'}</p>
            <button
              type="button"
              className="medicine-text-button"
              onClick={resetScan}
            >
              <RotateCcw size={16} />
              Start again
            </button>
          </div>
        )}

        {imageFile && (
          <button
            type="button"
            className="medicine-primary-button medicine-scan-button"
            onClick={() => void scanImage()}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <LoaderCircle size={19} className="medicine-spinner" />
                Reading text…
              </>
            ) : (
              <>
                <ScanText size={19} />
                Extract Text from Photo
              </>
            )}
          </button>
        )}

        {isScanning && (
          <p className="medicine-helper">
            Text recognition may take a little time, especially on the first scan.
          </p>
        )}

        {error && (
          <p className="medicine-inline-warning" role="alert">
            <AlertCircle size={18} />
            {error}
          </p>
        )}
      </section>

      {detectedText && (
        <>
          <section className="medicine-panel">
            <div className="medicine-section-heading">
              <span className="medicine-step">2</span>
              <div>
                <h2>Text detected from packaging</h2>
                <p>
                  This is raw text recognition. Some words, numbers, or units
                  may be incorrect.
                </p>
              </div>
            </div>

            <div className="medicine-detected-text">{detectedText}</div>

            <div className="medicine-reading-tip">
              <BookOpen size={20} />
              <p>
                <strong>Read it simply:</strong> Start by identifying the
                printed product name and strength on the original package.
                If the text is unclear, do not guess.
              </p>
            </div>
          </section>

          <section className="medicine-panel medicine-verification-panel">
            <div className="medicine-section-heading">
              <span className="medicine-step">3</span>
              <div>
                <h2>Verify with the original packaging</h2>
                <p>
                  Compare every important detail with the packaging and the
                  prescription or pharmacist's instructions.
                </p>
              </div>
            </div>

            <ul className="medicine-checklist">
              <li>Medicine name and strength match the original label.</li>
              <li>Expiry date and packaging details are readable.</li>
              <li>Instructions match the current prescription.</li>
            </ul>

            <label className="medicine-review-check">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(event) => setReviewed(event.target.checked)}
              />
              <span>
                I have compared the detected text with the original packaging
                or asked a caregiver/pharmacist to help.
              </span>
            </label>

            {reviewed ? (
              <p className="medicine-review-status">
                <CheckCircle2 size={19} />
                Review acknowledged — this is not an automatic medical verification.
              </p>
            ) : (
              <p className="medicine-review-status medicine-review-pending">
                <AlertCircle size={19} />
                Not yet reviewed. Do not rely on the extracted text alone.
              </p>
            )}
          </section>
        </>
      )}


      <section className="medicine-panel">
        <div className="medicine-section-heading">
          <span className="medicine-step">4</span>
          <div>
            <h2>Medicine Information Search</h2>
            <p>
              Find information sources about a medicine for you or your
              caregiver to review.
            </p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void searchMedicine();
          }}
        >
          <label htmlFor="medicine-search">
            Medicine name
          </label>

          <input
            id="medicine-search"
            type="text"
            value={medicineQuery}
            onChange={(event) => setMedicineQuery(event.target.value)}
            placeholder="e.g. paracetamol"
            maxLength={100}
            required
          />

          <button
            type="submit"
            className="medicine-primary-button"
            disabled={isSearchingMedicine}
          >
            {isSearchingMedicine
              ? 'Searching...'
              : 'Search Information'}
          </button>
        </form>

        {medicineSearchError && (
          <p className="medicine-inline-warning" role="alert">
            {medicineSearchError}
          </p>
        )}

        {medicineResults.length > 0 && (
          <div>
            <h3>Information sources</h3>
            <ul>
              {medicineResults.map((result, index) => (
                <li key={`${result.url}-${index}`}>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {medicineDisclaimer && (
          <p className="medicine-helper">
            {medicineDisclaimer}
          </p>
        )}

        {!isSearchingMedicine &&
          !medicineSearchError &&
          medicineResults.length === 0 &&
          medicineDisclaimer !== '' && (
            <p>No information sources were found. Try another search.</p>
          )}
      </section>

      <div className="medicine-footer-note">
        If you are unsure what a medicine is or how to take it, ask a
        pharmacist or healthcare professional. Do not take an unidentified
        medicine based on OCR results.
      </div>
    </div>
  );
}

export function AppointmentsPage() {
  return (
    <PlaceholderLayout
      title="Appointments"
      description="Your upcoming appointments and past visit notes will appear here. This screen is coming soon."
      icon={Calendar}
    />
  );
}

export function CareCirclePage() {
  return (
    <div className="page-content">
      <CareCircleCard />
    </div>
  );
}