import { useRef, useState, MouseEvent } from 'react';
import './modal.scss';

type Props = {
  modalTitle: string, modalContent: string
};

export const Modal = ({ modalTitle, modalContent }: Props): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeModal = () => setShowModal(false);

  const clickHandler = (event: MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(event.target as Element)) {
      closeModal();
    }
  };

  return (
  <>
    <button className="modal-button" onClick={() => setShowModal(!showModal)}>Modal Link</button>
    <div onClick={(event) => clickHandler(event)} className={`modal-container${showModal ? ' modal-content__show' : ''} `}>
      <div ref={contentRef} className="modal-content">
        <button className="modal-content__close-button" onClick={closeModal}>Close</button>
        <div className="modal-content__block">
          <h6>{modalTitle}</h6>
          {modalContent}
        </div>
      </div>
    </div>
  </>
  );
};
