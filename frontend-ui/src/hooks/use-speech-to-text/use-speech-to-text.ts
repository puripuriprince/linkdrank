import { speechToText } from "@/actions/speechToText";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechToTextOptions {
	onResult: (text: string) => void;
	onError?: (error: string) => void;
}

export function useSpeechToText({ onResult, onError }: UseSpeechToTextOptions) {
	const [isRecording, setIsRecording] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const audioUrlRef = useRef<string | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);

	const handleAudioData = useCallback(async () => {
		const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
		const url = URL.createObjectURL(audioBlob);
		audioUrlRef.current = url;

		try {
			setIsProcessing(true);
			const result = await speechToText(audioBlob);

			if (result.success && result.text) {
				onResult(result.text);
			} else {
				throw new Error(result.error || "Transcription failed");
			}
		} catch (err) {
			console.error("Error transcribing:", err);
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			onError?.(`Error processing audio: ${errorMessage}`);
		} finally {
			setIsProcessing(false);
		}
	}, [onResult, onError]);

	const cleanup = useCallback((preventProcessing = false) => {
		const recorder = mediaRecorderRef.current;
		const stream = mediaStreamRef.current;
		
		if (recorder && isRecording) {
			if (preventProcessing) {
				recorder.onstop = null;
			}
			
			recorder.stop();
            mediaRecorderRef.current = null;
			setIsRecording(false);

			// Stop all tracks using the stream ref
			if (stream) {
				for (const track of stream.getTracks()) {
					track.stop();
				}
				mediaStreamRef.current = null;
			}

			if (preventProcessing) {
				audioChunksRef.current = [];
			}
		}
	}, [isRecording]);

	const startRecording = useCallback(async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			onError?.("Your browser does not support audio recording.");
			return;
		}

		try {
			audioChunksRef.current = [];
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaStreamRef.current = stream;
			const recorder = new MediaRecorder(stream);
			mediaRecorderRef.current = recorder;

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			recorder.onstop = handleAudioData;

			recorder.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Microphone access error:", err);
			onError?.("Microphone access denied or unavailable");
		}
	}, [handleAudioData, onError]);

	const stopRecording = useCallback(() => {
		cleanup();
	}, [cleanup]);

	const cancelRecording = useCallback(() => {
		cleanup(true);
	}, [cleanup]);

	// Cleanup function for audio resources
	useEffect(() => {
		return () => {
			if (audioUrlRef.current) {
				URL.revokeObjectURL(audioUrlRef.current);
			}
			
			// Use mediaStreamRef for cleanup consistency
			const stream = mediaStreamRef.current;
			if (stream) {
				for (const track of stream.getTracks()) {
					track.stop();
				}
				mediaStreamRef.current = null;
			}
		};
	}, []);

	return {
		isRecording,
		isProcessing,
		startRecording,
		stopRecording,
		cancelRecording,
		mediaStream: mediaStreamRef.current,
	};
}