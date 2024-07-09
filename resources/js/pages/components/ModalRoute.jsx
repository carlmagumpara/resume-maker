import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

export function ModalRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const pages = {
    // 'add-your-business': {
    //   title: 'CREATE YOUR BUSINESS',
    //   component: <CreateBusiness />,
    //   size: 'xl',
    //   centered: false,
    // },
  };

  return (
    <Modal 
      size={pages[id].size}
      show={true} 
      onHide={() => navigate({ ...location.state?.previousLocation, state: { previousLocation: location } })}
      animation={false}
      backdrop="static"
      keyboard={false}
      centered={pages[id].centered}
    >
      <Modal.Header className="border-0" closeButton>
        <Modal.Title as="h5" className="llu-text-primary olive-days">{pages[id].title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pages[id].component}
      </Modal.Body>
    </Modal>
  )
}