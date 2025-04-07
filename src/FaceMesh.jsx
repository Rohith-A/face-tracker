import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import {
  createDetector,
  SupportedModels,
} from '@tensorflow-models/face-landmarks-detection';

const FaceMeshTracker = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
        const detector = await createDetector(SupportedModels.MediaPipeFaceMesh, {
          runtime: 'tfjs',
          refineLandmarks: false,
          detectorModelConfig: {
            maxFaces: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          },
        });
        detectorRef.current = detector;
        console.log('✅ Model loaded');
        requestAnimationFrame(runDetection);
      };

    loadModel();
  }, []);

  const runDetection = async () => {
    if (
      detectorRef.current &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      const faces = await detectorRef.current.estimateFaces(video, {
        flipHorizontal: true,
      });

      drawMesh(faces, video);
    }

    requestAnimationFrame(runDetection);
  };

  const drawMesh = (faces, video) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!faces.length) {
      console.log('😢 No face detected');
      return;
    }

    console.log(`🎯 Face detected: ${faces.length}`);

    faces.forEach((face, i) => {
      const keypoints = face.keypoints;

      if (!keypoints || !keypoints.length) {
        console.log('⚠️ No keypoints found');
        return;
      }

      keypoints.forEach(point => {
        const { x, y } = point;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = 'cyan';
        ctx.fill();
      });
    });
  };

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored
        screenshotFormat="image/jpeg"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default FaceMeshTracker;
