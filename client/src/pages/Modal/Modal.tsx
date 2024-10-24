import React from 'react';
import './Modal.css';


interface ModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    body: string;
  }

const Modal:React.FC<ModalProps> = ({ show, onClose, onConfirm, title, body }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-title">
                        <h1>{title}</h1>
                    </div>
                    <div className="modal-body">
                        <p>{body}</p>
                    </div>
                    <div className="modal-actions ">
                        <button onClick={onClose} className="modal-close">Cancel</button>
                        <button onClick={onConfirm} className="modal-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;