import React, { useEffect, useRef, useCallback } from 'react';

interface CanvasWaveAnimationProps {
  isRecording: boolean;
  mediaStream?: MediaStream | null;
  className?: string;
  height?: number;
  barCount?: number;
  showRecordingIndicator?: boolean;
}

export const CanvasWaveAnimation: React.FC<CanvasWaveAnimationProps> = ({
  isRecording,
  mediaStream,
  className = "h-8 w-full",
  height = 32,
  barCount = 40,
  showRecordingIndicator = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const waveformDataRef = useRef<number[]>([]);
  const frameCountRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  const setupAudioAnalysis = useCallback(async (stream: MediaStream) => {
    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      // Create analyser node
      analyserRef.current = audioContext.createAnalyser();
      const analyser = analyserRef.current;
      
      // Configure analyser for maximum sensitivity to voice
      analyser.fftSize = 2048; // Higher resolution for better voice detection
      analyser.smoothingTimeConstant = 0.05; // Minimal smoothing for immediate response
      analyser.minDecibels = -100; // Capture even quiet sounds
      analyser.maxDecibels = -10;
      
      // Create data array for time domain data
      const bufferLength = analyser.fftSize;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Create source from media stream
      sourceRef.current = audioContext.createMediaStreamSource(stream);
      sourceRef.current.connect(analyser);

      // Initialize waveform data array with zeros (no bars initially)
      waveformDataRef.current = Array(barCount).fill(0);
      isInitializedRef.current = false;

    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  }, [barCount]);

  const cleanupAudioAnalysis = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    dataArrayRef.current = null;
    waveformDataRef.current = [];
    isInitializedRef.current = false;
  }, []);

  const animate = useCallback(() => {
    if (!canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Control update rate - only update waveform data every 3 frames to slow it down
    frameCountRef.current++;
    const shouldUpdateWaveform = frameCountRef.current % 3 === 0;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (shouldUpdateWaveform) {
      let currentAmplitude = 0;

      if (analyserRef.current && dataArrayRef.current) {
        // Get real time domain data (waveform)
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
        
        // Calculate amplitude with much higher sensitivity
        let sum = 0;
        let peak = 0;
        let variance = 0;
        
        // First pass: calculate mean
        let mean = 0;
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          mean += dataArrayRef.current[i];
        }
        mean /= dataArrayRef.current.length;
        
        // Second pass: calculate variance and peak
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const amplitude = Math.abs(dataArrayRef.current[i] - mean) / 128;
          sum += amplitude * amplitude;
          peak = Math.max(peak, amplitude);
          variance += (dataArrayRef.current[i] - mean) * (dataArrayRef.current[i] - mean);
        }
        
        // Use multiple methods for maximum sensitivity
        const rms = Math.sqrt(sum / dataArrayRef.current.length);
        const stdDev = Math.sqrt(variance / dataArrayRef.current.length) / 128;
        
        // Combine RMS, peak, and standard deviation with high amplification
        currentAmplitude = Math.max(
          rms * 8,           // High RMS amplification
          peak * 2,          // Peak amplification  
          stdDev * 5         // Standard deviation for voice detection
        );
        
        // Apply exponential scaling for better voice response
        currentAmplitude = Math.pow(currentAmplitude, 0.7) * 2;
        
        // Set bounds - only show bars when there's actual audio
        currentAmplitude = Math.max(currentAmplitude, 0);
        currentAmplitude = Math.min(currentAmplitude, 3.0);
        
        // Only start showing bars after we detect actual audio activity
        if (!isInitializedRef.current && currentAmplitude > 0.1) {
          isInitializedRef.current = true;
        }
        
        // If not initialized yet, keep amplitude at 0
        if (!isInitializedRef.current) {
          currentAmplitude = 0;
        }
        
        // Minimal smoothing to preserve voice dynamics
        const previousAmplitude = waveformDataRef.current[waveformDataRef.current.length - 1] || 0;
        currentAmplitude = previousAmplitude * 0.2 + currentAmplitude * 0.8; // More responsive
        
      } else {
        // Fallback - no bars until audio is detected
        currentAmplitude = 0;
      }

      // Shift existing waveform data to the left (time progression)
      waveformDataRef.current.shift();
      waveformDataRef.current.push(currentAmplitude);
    }

    // Draw the waveform
    const barWidth = rect.width / barCount;
    const maxHeight = rect.height * 0.8; // Increased to 80% for maximum visibility

    // Create gradient for visual appeal
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
    gradient.addColorStop(0, '#f59e0b'); // yellow-500
    gradient.addColorStop(1, '#eab308'); // yellow-500 darker

    waveformDataRef.current.forEach((amplitude, index) => {
      // Only draw bars if there's actual amplitude
      if (amplitude > 0.01) {
        const barHeight = Math.max(amplitude * maxHeight, 1);
        const x = index * barWidth + barWidth * 0.3; // Increased from 0.1 to 0.3 for thinner bars
        const y = (rect.height - barHeight) / 2;
        const width = barWidth * 0.4; // Reduced from 0.8 to 0.4 for much thinner bars

        // Add opacity gradient from left to right (older data is more transparent)
        const opacity = (index / barCount) * 0.4 + 0.6; // 0.6 to 1.0 opacity for better visibility
        ctx.globalAlpha = opacity;
        ctx.fillStyle = gradient;

        // Draw rounded rectangle manually for better compatibility
        const radius = Math.min(width / 2, 1.5); // Smaller radius for thinner bars
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + barHeight - radius);
        ctx.quadraticCurveTo(x + width, y + barHeight, x + width - radius, y + barHeight);
        ctx.lineTo(x + radius, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }
    });

    // Reset alpha
    ctx.globalAlpha = 1;

    animationRef.current = requestAnimationFrame(animate);
  }, [isRecording, barCount]);

  useEffect(() => {
    if (isRecording && mediaStream) {
      frameCountRef.current = 0;
      lastUpdateTimeRef.current = 0;
      setupAudioAnalysis(mediaStream);
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      cleanupAudioAnalysis();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      cleanupAudioAnalysis();
    };
  }, [isRecording, mediaStream, setupAudioAnalysis, animate, cleanupAudioAnalysis]);

  if (!isRecording) return null;

  return (
    <div className="relative mx-2.5 grid grid-cols-[auto_minmax(0,1fr)] py-4">
      {showRecordingIndicator && (
        <div className="items-top flex justify-center">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3 mt-2" />
        </div>
      )}
      <div className="relative flex-auto bg-transparent pt-1.5" style={{ marginBottom: '-18px', transform: 'translateY(-7px)' }}>
        <div className="flex flex-col justify-start" style={{ minHeight: 0 }}>
          <div className="flex min-h-12 items-start">
            <div className="max-w-full min-w-0 flex-1">
              <canvas 
                ref={canvasRef}
                className={className}
                style={{ width: '100%', height: `${height}px` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 