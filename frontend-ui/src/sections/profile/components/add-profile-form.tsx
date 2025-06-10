import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { getProfile, SAMPLE_PROFILES } from "@/actions/profiles";
import { TypingMessage } from "../../search/components/typing-message";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";

export const AddProfileForm: React.FC = () => {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [streamingFinished, setStreamingFinished] = useState(false);

  // Move to the next message in the queue
  const handleNextMessage = useCallback(() => {
    if (currentMessage) {
      setMessages((prev) => [...prev, currentMessage]);
    }
    if (messageQueue.length > 0) {
      setCurrentMessage(messageQueue[0]);
      setMessageQueue((prev) => prev.slice(1));
    } else {
      setCurrentMessage(null);
    }
  }, [currentMessage, messageQueue]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset state for a new submission
    setLoading(true);
    setMessageQueue([]);
    setCurrentMessage(null);
    setMessages([]);
    setStreamingFinished(false);

    try {
      const profileData: any = await getProfile(
        url,
        ["Concordia University", "McGill University"],
        (msg: string) => setMessageQueue((prev) => [...prev, msg]),
      );

      if (!profileData) {
        return;
      }

      // Simulate adding to the database - cast to proper type
      const mockProfile = {
        ...profileData,
        id: Math.random(),
        educations: [],
        experiences: [],
        certifications: [],
        skills: [],
        languages: [],
        volunteers: [],
        publications: [],
        awards: [],
        projects: [],
      } as any;
      SAMPLE_PROFILES.unshift(mockProfile);
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const linkedinUrl = profileData.linkedinUrl || profileData.linkedin_url || `https://www.linkedin.com/in/${profileData.linkedinId || 'unknown'}`;
      router.push(paths.people.details(linkedinUrl));
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessageQueue((prev) => [...prev, "Error getting your profile."]);
    } finally {
      setStreamingFinished(true);
    }
  };

  // When there's no current message but messages are queued, move to the next message.
  useEffect(() => {
    if (!currentMessage && messageQueue.length > 0) {
      handleNextMessage();
    }
  }, [messageQueue, currentMessage, handleNextMessage]);

  // When streaming is finished and all messages have been displayed, stop loading.
  useEffect(() => {
    if (streamingFinished && messageQueue.length === 0 && !currentMessage) {
      setLoading(false);
    }
  }, [streamingFinished, messageQueue, currentMessage]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      {loading ? (
        <div className="py-2">
          {currentMessage ? (
            <TypingMessage
              message={currentMessage}
              onComplete={handleNextMessage}
            />
          ) : (
            <span className="animate-pulse">
              {messages[messages.length - 1]}
            </span>
          )}
        </div>
      ) : (
        <Input
          placeholder="LinkedIn Profile URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="resize-y"
          type="url"
        />
      )}
      <Button
        type="submit"
        disabled={loading}
        className="relative bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
      >
        {loading ? (
          <Icon
            icon="lucide:loader"
            className="animate-spin"
            width="24"
            height="24"
          />
        ) : (
          <span>Add</span>
        )}
      </Button>
    </form>
  );
};
