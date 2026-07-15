import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom';

const ProjectCard = ({ portfolio }) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  const images = portfolio?.images || [];
  const firstImage = images[0];
  const restImages = images.slice(1);

  return (
    <>
      <div className='container col-12 border-top border-2 border-black rounded-4 p-3 py-4'>
        <div className="row align-items-center">
          <div className="col-12 col-lg-4 mb-4 mb-lg-0">
            <div className="card-image border rounded-2 overflow-hidden">
              {firstImage ? (
                <img src={firstImage} alt={portfolio?.title} className="w-100 h-100 object-fit-cover" draggable="false" />
              ) : (
                <div className="w-100 h-100 bg-dark"></div>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-8 px-lg-3">
            <div className="col-12 d-flex flex-wrap align-items-start mb-2">
              <div className="col-12 col-md-6">
                <h4 className='fw-medium'>{portfolio?.subTitle}</h4>
              </div>
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-end">
                <p className='small text-body-secondary border rounded-2 px-3 py-1 me-5 mb-0'>{portfolio?.field}</p>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className='d-flex align-items-center justify-content-center border border-2 border-secondary text-secondary rounded-1 p-1'
                  style={{ width: '25px', height: '25px', cursor: 'pointer' }}
                >
                  <i className={`ti ${isOpen ? 'ti-minus' : 'ti-plus'}`} style={{ fontSize: '16px' }}></i>
                </div>
              </div>
            </div>
            <div className="col-12 fs-4 fw-semibold">{portfolio?.title}</div>
            <div className="col-12 text-body-secondary fs-6">{portfolio?.description}</div>

            <div
              className="col-12 text-end"
              style={{
                transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
            >
              <Link to={'/case-study'} className='view-case-study-btn fw-normal fs-6'>View case study</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll images */}
      <div className="container-fluid px-0 scroll-images"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        style={{
          maxHeight: isOpen ? '500px' : '0px',
          opacity: isOpen ? 1 : 0,
          transition: 'max-height 0.5s ease, opacity 0.4s ease',
        }}>
        <div className="container d-flex gap-2 mb-5">
          {restImages.length > 0 ? (
            <>
              {restImages.map((img, index) => (
                <div key={index} className="col-12 col-lg-5 flex-shrink-0">
                  <div className="card-scroll-image border rounded-2 overflow-hidden">
                    <img src={img} alt={`${portfolio?.title}-${index + 1}`} className="w-100 h-100 object-fit-cover" draggable="false" />
                  </div>
                </div>
              ))}
              <div className='col-1 flex-shrink-0'></div>
            </>
          ) : (
            <p className="text-secondary small ps-2">No additional images.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectCard;