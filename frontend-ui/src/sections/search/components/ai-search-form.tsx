import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";
import { CanvasWaveAnimation } from "@/components/canvas-wave-animation";

export const AISearchForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    setLoading(true);
    router.push(paths.search.details(description));
    setLoading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setMediaStream(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      };

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      audioChunksRef.current = [];
    }
  };

  const confirmRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);

      // Mock transcription - simulate processing
      setTimeout(() => {
        const mockTranscriptions = [
          "Find me senior software engineers with React experience who graduated from top universities",
          "Looking for product managers in fintech with experience at startups",
          "Search for data scientists specializing in machine learning and AI",
          "Find marketing professionals with experience in B2B SaaS companies",
          "Looking for UX designers who have worked on mobile applications"
        ];
        
        const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
        setDescription(randomTranscription);
        setIsTranscribing(false);
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      {isTranscribing ? (
        <div className="flex items-center justify-center h-16 px-4 py-3 border rounded-md bg-black/[0.06] dark:bg-white/[0.08] backdrop-blur-xl backdrop-saturate-200">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Icon
              icon="lucide:loader"
              className="animate-spin"
              width="20"
              height="20"
            />
            <span className="text-sm font-medium">Transcribing audio...</span>
          </div>
        </div>
      ) : isRecording ? (
          <CanvasWaveAnimation 
            isRecording={isRecording} 
            mediaStream={mediaStream}
            className="h-full w-full"
            height={20}
            barCount={40}
            showRecordingIndicator={true}
          />
      ) : (
        <Textarea
          placeholder="Describe the person you are looking for"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-y"
        />
      )}
      
      <div className="flex gap-2">
        {isTranscribing ? (
          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Processing your audio...</span>
          </div>
        ) : isRecording ? (
          <>
            <Button
              type="button"
              onClick={cancelRecording}
              variant="outline"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Icon icon="mdi:close" width="20" height="20" className="mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmRecording}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <Icon icon="mdi:check" width="20" height="20" className="mr-2" />
              Transcribe
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              onClick={startRecording}
              variant="outline"
              className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950"
            >
              <Icon icon="mdi:microphone" width="20" height="20" />
            </Button>
            <Button
              type="submit"
              disabled={loading || !description.trim()}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
            >
              {loading ? (
                <Icon
                  icon="lucide:loader"
                  className="animate-spin"
                  width="24"
                  height="24"
                />
              ) : (
                <span>Search</span>
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};
