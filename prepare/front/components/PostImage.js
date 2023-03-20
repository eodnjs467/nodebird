import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "./ImagesZoom";

function PostImage({ images }) {
    const [showImageZoom, setShowImageZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImageZoom(true);
    }, []);
    const onClose = useCallback(() => {
        setShowImageZoom(false);
    }, []);

    if (images.length === 1) {
        return (
          <>
            <img src={`http://localhost:3065/${images[0].src}`} style={{}} alt={images[0].src} role="presentation" onClick={onZoom} />
            {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
          </>
        );
    }
    if (images.length === 2) {
        return (
          <>
            <img src={`http://localhost:3065/${images[0].src}`} style={{ display: "inline-block", width: '50%' }} alt={images[0].src} role="presentation" onClick={onZoom} />
            <img src={`http://localhost:3065/${images[1].src}`} style={{ display: "inline-block", width: '50%' }} alt={images[1].src} role="presentation" onClick={onZoom} />
            {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
          </>
        );
    }
    return (
      <div>
        <img src={`http://localhost:3065/${images[0].src}`} style={{ width: '50%' }} alt={images[0].src} role="presentation" onClick={onZoom} />
        <div
          role="presentation"
          style={{ display: "inline-block", width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
          onClick={onZoom}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}
          개의 사진 더보기
        </div>
        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    );
}

PostImage.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default PostImage;
