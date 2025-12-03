import React, { useRef, useState } from "react";

export default function CameraTest() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [file, setFile] = useState(null);

  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (err) {
      alert("No se pudo acceder a la cámara. Revisa permisos y HTTPS.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (!videoRef.current) return;
    const stream = videoRef.current.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      const photoFile = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      setFile(photoFile);
    }, "image/jpeg");
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "300px", border: "1px solid #ccc" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ marginTop: 10 }}>
        <button onClick={startCamera}>Abrir cámara</button>
        <button onClick={takePhoto}>Tomar foto</button>
        <button onClick={stopCamera}>Cerrar cámara</button>
      </div>
      {file && (
        <div style={{ marginTop: 10 }}>
          <p>Foto lista: {file.name}</p>
          <img src={URL.createObjectURL(file)} alt="preview" style={{ width: 200 }} />
        </div>
      )}
    </div>
  );
}
