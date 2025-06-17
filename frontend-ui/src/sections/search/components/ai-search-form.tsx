import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";
import { CanvasWaveAnimation } from "@/components/canvas-wave-animation";
import { slugifyQuery } from "@/lib/utils";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { toast } from "sonner";

export const AISearchForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { isRecording, isProcessing, startRecording, stopRecording, cancelRecording, mediaStream} =
		useSpeechToText({
			onResult: (text) => setDescription(text),
			onError: setError,
		});

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    setLoading(true);
    const slugifiedQuery = slugifyQuery(description);
    router.push(paths.search.details(slugifiedQuery));
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      {isProcessing ? (
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
            showRecordingIndicator={false}
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
        {isProcessing ? (
          <div className="flex-1 flex items-center justify-center py-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Processing your audio...</span>
          </div>
        ) : isRecording ? (
          <>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                cancelRecording()
              }}
              variant="outline"
              className="flex-1"
            >
              <Icon icon="mdi:close" width="20" height="20" className="mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                stopRecording();
              }}
              variant="default"
              className="flex-1"
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
