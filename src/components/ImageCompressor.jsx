import { useState, useRef } from 'react';
import './compressor.scss'
import FileResizer from 'react-image-file-resizer';
import Pica from 'pica';


function ImageCompressor() {
  const [dimensions, setDimensions] = useState({width: null, height: null})
  const imgRef = useRef(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(80); // Default compression level

  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    setOriginalImage(imageFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setDisplayImage(e.target.result); // Show uploaded image
    };
    reader.readAsDataURL(imageFile);
  };

  const handleImageLoad = () => {
    setDimensions({
      width: imgRef.current.naturalWidth,
      height: imgRef.current.naturalHeight
    });
  }
  const handleCompress = async () => {


    if (!originalImage) {
      alert('Please select an image file!');
      return;
    }

    try {
      const quality = compressionLevel; // Convert percentage to quality value (0-1)

      const newWidth = (compressionLevel/100) * dimensions.width
      const newHeight = (compressionLevel/100) * dimensions.height

      console.log(newWidth, newHeight)

      FileResizer.imageFileResizer(
        originalImage,
        newWidth, // Adjust width as needed
        newHeight, // Adjust height as needed
        'PNG', // Adjust output format if needed
        quality,
        0, // Rotation in degrees (optional)
        (uri) => {
          setCompressedImage(uri);
        },
        'base64' // Output format (base64 or blob)
      );
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error compressing image. Please try again.');
    }
  };


  const handleDownload = () => {
    if (!compressedImage) {
      alert('No image to download!');
      return;
    }

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed_image.jpeg'; // Adjust filename
    link.click();
  };

  const handleCompressionChange = (value) => {
    setCompressionLevel(value);
  };
  const handleReset = () => {
    setDisplayImage(null)
    setCompressedImage(null)
  }


  return (
    <div className='container'>
      {!displayImage && (
        <input type="file" accept="image/*" onChange={handleFileChange} className='original-image' />
      )}
      {displayImage && <img src={displayImage} alt="Uploaded Image" ref={imgRef} onLoad={handleImageLoad} />}
      <input id="compression" type="number" value={compressionLevel} readOnly />
      <div className="slider-container">
        <input type="range" min={0} max={100} value={compressionLevel} onChange={(event) => handleCompressionChange(event.target.value)} />
      </div>
      {compressedImage && <img src={compressedImage} alt="Compressed Image" />}
      <div>
        <button onClick={handleCompress}>Compress</button>
        {compressedImage && (
          <div>

            <button onClick={handleDownload}>Download</button>
            <button onClick={handleReset}>Reset</button>
          </div>
        )}
      </div>
    </div>

  )
}

export default ImageCompressor;
