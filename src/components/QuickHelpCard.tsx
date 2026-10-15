import { useState } from 'react';
import {
  HandHelping,
  Phone,
  Info,
} from 'lucide-react';

/**
 * Quick Help card — prominent "I need help" button, secondary call action,
 * and a note about emergency services. No false claims of dispatch.
 */
export function QuickHelpCard() {
  const [showModal, setShowModal] = useState(false);
  const [callConfirmed, setCallConfirmed] = useState(false);

  const handleNeedHelp = () => setShowModal(true);

  const handleCallContact = () => {
    setCallConfirmed(true);
    setTimeout(() => setCallConfirmed(false), 4000);
  };

  return (
    <>
      <div className="card quick-help-card">
        <div className="card-header">
          <div className="card-header-icon red">
            <HandHelping />
          </div>
          <h2>Quick Help</h2>
        </div>

        <div className="quick-help-actions">
          <button
            className="btn btn-danger btn-lg btn-block"
            onClick={handleNeedHelp}
            id="btn-need-help"
          >
            <HandHelping />
            I need help
          </button>

          <button
            className="btn btn-outline btn-block"
            onClick={handleCallContact}
            id="btn-call-contact"
          >
            <Phone />
            {callConfirmed ? 'Opening phone for Sarah…' : 'Call my care contact'}
          </button>
        </div>

        <div className="quick-help-note" role="note">
          <Info size={18} />
          <span>
            If you are in immediate danger or having a medical emergency,
            please call <strong>911</strong> (or your local emergency number) directly.
          </span>
        </div>
      </div>

      {/* Help modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 id="help-modal-title">How can we help?</h2>
            <p>
              Your care contact, Sarah Johnson, will be notified that you
              need assistance. This is a demo — no real message will be sent.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={() => {
                  setShowModal(false);
                  setCallConfirmed(true);
                  setTimeout(() => setCallConfirmed(false), 4000);
                }}
                id="btn-confirm-help"
              >
                <Phone />
                Notify Sarah (demo)
              </button>
              <button
                className="btn btn-ghost btn-block"
                onClick={() => setShowModal(false)}
                id="btn-cancel-help"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
