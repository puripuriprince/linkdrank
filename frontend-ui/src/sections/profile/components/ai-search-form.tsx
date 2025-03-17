import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks/use-router";

export const AISearchForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    router.push(paths.people.AISearch(description));
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <Textarea
        placeholder="Describe the person you are looking for"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="resize-y"
      />
      <Button
        type="submit"
        disabled={loading}
        className="relative bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200"
      >
        {loading ? (
          <Icon
            icon="lucide:loader"
            className="animate-spin"
            width="24"
            height="24"
          />
        ) : (
          <span className={loading ? "ml-8" : ""}>Search</span>
        )}
      </Button>
    </form>
  );
};
