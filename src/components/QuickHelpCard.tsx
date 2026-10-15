import { useState } from 'react';
import {
  HandHelping,
  Phone,
  Info,
  ShieldAlert,
  Users,
  X,
  CheckCircle2,
} from 'lucide-react';

export function QuickHelpCard() {
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  function handleDemoRequest() {
    setShowModal(false);
    setFeedback(
      'Demo only: your request has not been sent to a caregiver.'
    );
  }

  return (
    <>
      <div className="card quick-help-card">
        <div className="card-header">
          <div className="card-header-icon red">
            <HandHelping />
          </div>
          <div>
            <h2>Emergency & Quick Help</h2>
            <p className="care-subtitle">
              Support when you need it
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-danger btn-lg btn-block"
          onClick={() => {
            setFeedback('');
            setShowModal(true);
          }}
        >
          <HandHelping size={20} />
          I need help
        </button>

        <div className="quick-help-secondary-actions">
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={() =>
              setFeedback(
                'Demo only: no phone call was placed. Use your phone to contact your caregiver.'
              )
            }
          >
            <Phone size={18} />
            Contact my caregiver
          </button>
        </div>

        {feedback && (
          <div className="quick-help-feedback" role="status">
            <Info size={18} />
            <span>{feedback}</span>
            <button
              type="button"
              onClick={() => setFeedback('')}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

       <div className="quick-help-note" role="note">
  <ShieldAlert size={20} />
  <span>
    <strong>Medical emergency?</strong> In India, call 112 for
    emergency assistance.
  </span>
</div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
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
                onClick={() => setShowModal(false)}
                aria-label="Close help panel"
              >
                <X />
              </button>
            </div>

            <h2 id="help-modal-title">How can we help?</h2>
            <p>
              Choose the option that best describes what you need.
            </p>

            <div className="emergency-help-options">
              <div className="emergency-help-option">
                <ShieldAlert size={22} />
                <div>
                  <strong>Immediate emergency</strong>
                  <p>
                    If someone is in immediate danger, call 112 directly
                    from your phone.
                  </p>
                </div>
              </div>

              <div className="emergency-help-option">
                <Users size={22} />
                <div>
                  <strong>Caregiver assistance</strong>
                  <p>
                    You can use the demo option below to preview a help
                    request. It will not contact anyone.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                onClick={handleDemoRequest}
              >
                <CheckCircle2 size={18} />
                Preview help request
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={() => setShowModal(false)}
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