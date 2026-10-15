
import { useState } from 'react';
import {
  HandHelping,
  Phone,
  MapPin,
  ShieldAlert,
  Users,
  X,
  MessageCircle,
  Send,
  Navigation,
  LoaderCircle,
} from 'lucide-react';

export function QuickHelpCard() {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const emergencyMessage =
    'I need help. Please contact me as soon as possible.';

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Location is not supported by this browser.');
      return;
    }

    setLoadingLocation(true);
    setLocationStatus('Getting your current location...');
    setLocation(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationStatus('Location acquired successfully');
        setLoadingLocation(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? 'Location permission denied. Allow location access in your browser.'
            : error.code === error.TIMEOUT
              ? 'Location request timed out. Please try again.'
              : 'Could not get your location. Check your device location settings.';

        setLocationStatus(message);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const openHelp = () => {
    setShowModal(true);
    setLocation(null);
    setLocationStatus('');
    getLocation();
  };

  const closeHelp = () => {
    setShowModal(false);
    setLoadingLocation(false);
  };

  const mapsUrl = location
    ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : '';

  const messageWithLocation = location
    ? `${emergencyMessage}\nMy current location: ${mapsUrl}`
    : emergencyMessage;

  return (
    <>
      <div className="card quick-help-card">
        <div className="card-header">
          <div className="card-header-icon red">
            <HandHelping />
          </div>
          <div>
            <h2>Emergency &amp; Quick Help</h2>
            <p className="care-subtitle">Support when you need it</p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-danger btn-lg btn-block"
          onClick={openHelp}
        >
          <HandHelping size={20} />
          I need help
        </button>

        <div className="quick-help-note" role="note">
          <ShieldAlert size={20} />
          <span>
            <strong>We're here for you.</strong>{' '}
            Get help from your care circle when you need support.
          </span>
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeHelp}
        >
          <div
            className="modal emergency-help-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="emergency-help-modal-heading">
              <div className="card-header-icon red">
                <HandHelping />
              </div>

              <button
                type="button"
                className="emergency-help-close"
                onClick={closeHelp}
                aria-label="Close emergency assistance"
              >
                <X />
              </button>
            </div>

            <h2 id="help-modal-title">Emergency assistance</h2>
            <p>Your care and safety matter.</p>

            <div className="emergency-help-options">
              <div className="emergency-help-option">
                <Users size={22} />
                <div>
                  <strong>Emergency contact</strong>
                  <p>Family caregiver</p>
                </div>
                <Phone size={18} />
              </div>

              <div className="emergency-help-option">
                <MapPin size={22} />
                <div>
                  <strong>Current GPS location</strong>
                  <p>{locationStatus || 'Waiting for location...'}</p>

                  {loadingLocation && (
                    <LoaderCircle size={18} />
                  )}

                  {location && (
                    <>
                      <p>
                        Latitude: {location.latitude.toFixed(6)}
                      </p>
                      <p>
                        Longitude: {location.longitude.toFixed(6)}
                      </p>
                      <p>
                        Accuracy: approximately{' '}
                        {Math.round(location.accuracy)} metres
                      </p>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View location on Google Maps
                      </a>
                    </>
                  )}

                  {!location && !loadingLocation && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={getLocation}
                    >
                      <Navigation size={16} />
                      Try again
                    </button>
                  )}
                </div>
              </div>

              <div className="emergency-help-option">
                <MessageCircle size={22} />
                <div>
                  <strong>Emergency message</strong>
                  <p>{messageWithLocation}</p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <a
                href={`sms:?body=${encodeURIComponent(messageWithLocation)}`}
                className="btn btn-primary btn-lg btn-block"
                style={{ textDecoration: 'none' }}
              >
                <Send size={18} />
                Open emergency message
              </a>

              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={closeHelp}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
