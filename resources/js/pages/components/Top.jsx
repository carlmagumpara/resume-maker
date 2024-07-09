import React, { useLayoutEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaChevronUp } from 'react-icons/fa';

function Top() {
  const [scrollPosition, setPosition] = useState(0);
  
  useLayoutEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition > 100 ? (
    <div className="position-fixed" style={{ bottom: 10, right: 10 }}>
      <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <FaChevronUp />
      </Button>
    </div>
  ) : null;
}

export default Top;