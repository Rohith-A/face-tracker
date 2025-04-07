import React, { useEffect, useState } from 'react'
import { ReactP5Wrapper } from 'react-p5-wrapper'

const FaceMeshP5 = () => {
  const [ml5Loaded, setMl5Loaded] = useState(false)

  // Face outline for filled shape
  const FACE_OUTLINE = [
    10, 338, 297, 332, 284, 251, 389, 356, 454, 323,
    361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
    176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
    162, 21, 54, 103, 67, 109
  ];

  useEffect(() => {
    const loadMl5 = () => {
      if (!window.ml5) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/ml5@0.12.2/dist/ml5.min.js'
        script.onload = () => {
          console.log('✅ ml5.js loaded')
          setMl5Loaded(true)
        }
        document.body.appendChild(script)
      } else {
        setMl5Loaded(true)
      }
    }

    loadMl5()
  }, [])

  const sketch = p => {
    let faceMesh
    let video
    let faces = []
    let capturedMesh = null
    let expression = "🙂 Neutral"
    let expressionDiv

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
      video = p.createCapture(p.VIDEO)
      video.size(p.width, p.height)
      video.hide()

      expressionDiv = p.createDiv("Expression: 🙂 Neutral")
      expressionDiv.position(200, 200)
      expressionDiv.style("color", "black")
      expressionDiv.style("font-size", "24px")
      expressionDiv.style("font-family", "Arial")
      expressionDiv.style("font-weight", "bold")
      expressionDiv.style("z-index", "10")
      expressionDiv.style("background", "rgba(245, 245, 245, 0.96)")
      expressionDiv.style("padding", "8px 12px")
      expressionDiv.style("border-radius", "6px")

      const setupFaceMesh = async () => {
        console.log('📦 Initializing faceMesh...')
        faceMesh = window.ml5.facemesh(
          video.elt,
          { maxFaces: 1, flipHorizontal: false },
          () => {
            console.log('✅ faceMesh model ready')
          }
        )

        faceMesh.on('predict', results => {
          faces = results
        })
      }

      setupFaceMesh()
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
      if (video) {
        video.size(p.width, p.height)
      }
    }

    p.keyPressed = () => {
      if (p.key === 'c' && faces.length > 0) {
        capturedMesh = [...faces[0].mesh]
      }
    }

    const detectExpression = (mesh) => {
        const leftMouth = mesh[61];
        const rightMouth = mesh[291];
        const topLip = mesh[13];
        const bottomLip = mesh[14];
        const leftBrow = mesh[70];
        const rightBrow = mesh[300];
        const leftEye = mesh[159];
      
        const mouthWidth = p.dist(leftMouth[0], leftMouth[1], rightMouth[0], rightMouth[1]);
        const mouthHeight = Math.abs(topLip[1] - bottomLip[1]);
        const browDistance = p.dist(leftBrow[0], leftBrow[1], rightBrow[0], rightBrow[1]);
        const browLift = leftEye[1] - leftBrow[1];

        // 😮 Surprise: wide open mouth + brows lifted
        if (mouthHeight > 3 && mouthWidth > 40) {
          return "😮 Surprised";
        }
      
        // 😠 Angry: brows pulled together
        // if (browDistance < 109 && mouthWidth < 49) {
        //   return "😠 Angry";
        // }
      
        // 😀 Smile: wide mouth, moderately open
        if (mouthWidth > 50) {
          return "😀 Smiling";
        }
    
        if (mouthWidth < 48) {
            return "🙁 Sad"
        }
        return "🙂 Neutral";
      };
      

    p.draw = () => {
      p.background(30)

      // Show mirrored live camera
      p.push()
      p.translate(-p.width / 2 + 160, -p.height / 2 + 120)
      p.scale(-1, 1)
      p.image(video, -1050, 100, 500, 500)
      p.pop()
      

      // Draw face mesh (dots) over webcam
      if (faces.length > 0) {

        const offsetX = -350
        
      p.translate(offsetX, 200)
        const face = faces[0]
        for (let j = 0; j < face.mesh.length; j++) {
          const [x, y] = face.mesh[j]
          const flippedX = p.width / 2 - x
          const flippedY = y - p.height / 2
          p.push()
          p.translate(flippedX, flippedY)
          p.fill(0, 255, 0)
          p.noStroke()
          p.circle(0, 0, 2)
          p.pop()
          
        }
      }

      // Draw captured face mesh and shape
      if (capturedMesh) {
        const offsetX = 600;
        const scaleFactor = 1;
      
        // Solid face shape
        p.push();
        p.translate(offsetX, 0);
        p.scale(scaleFactor);
        p.fill(500, 200, 0);
        p.noStroke();
        p.beginShape();
        for (let i = 0; i < FACE_OUTLINE.length; i++) {
          const index = FACE_OUTLINE[i];
          const [x, y] = capturedMesh[index];
          const cx = (x - p.width / 2) / scaleFactor;
          const cy = (y - p.height / 2) / scaleFactor;
          p.vertex(cx, cy);
        }
        p.endShape(p.CLOSE);
        p.pop();
      
        // Mesh points (blue)
        p.push();
        p.translate(offsetX, 0);
        p.scale(scaleFactor);
        p.fill(100, 255, 255);
        for (let i = 0; i < capturedMesh.length; i++) {
          const [x, y] = capturedMesh[i];
          const cx = (x - p.width / 2) / scaleFactor;
          const cy = (y - p.height / 2) / scaleFactor;
          p.circle(cx, cy, 2);
        }
        p.pop();
      
        // Detect & update expression
        expression = detectExpression(capturedMesh);
        expressionDiv.html("Expression: " + expression);
      }
    }        
  }

  return (
    <div>
      <h2>Face Tracking App</h2>
      {ml5Loaded ? (
        <ReactP5Wrapper sketch={sketch} />
      ) : (
        <p>Loading ml5.js...</p>
      )}
    </div>
  )
}

export default FaceMeshP5
