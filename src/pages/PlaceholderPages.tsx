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
  return (
    <PlaceholderLayout
      title="Health"
      description="Your full health history, readings, and records will appear here. This screen is coming soon."
      icon={Heart}
    />
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