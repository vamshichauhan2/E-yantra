
import { Modal} from '@mui/material';
import './modalpopup.css'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 0,
  boxShadow: 'none',
  padding: 0,    // padding set to zero
  margin: 0,   
 
  outline: 'none',
  display: 'flex',        // flex container for vertical alignment
  flexDirection: 'column', 
  alignItems: 'center',   // horizontally center content
  justifyContent: 'center', // vertically center content
  textAlign: 'center',
};

const ModalPopup = ({ modalIsOpen, setModalIsOpen,value }) => {
  const closeModal = () => setModalIsOpen(false);

  return (
    <Modal open={modalIsOpen} onClose={closeModal}

     sx={{
    '& .MuiBackdrop-root': { margin: 0, padding: 0 },
    '& .MuiModal-root': { margin: 0, padding: 0 }
  }}
    >
      {
        value?(<img  className="eyantra-logo-popup" src="../eyantraLogo.jpeg" alt="eyantra"/>):(<img  className="eyantra-logo-popup" src="./eyantraLogo.jpeg" alt="eyantra"/>)
      }
       
    </Modal>
  );
};

export default ModalPopup;
