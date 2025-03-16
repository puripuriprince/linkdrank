import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";
import { aiSearch } from "@/src/actions/search";

export const AISearchForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoading(true);
    await aiSearch(description);
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
