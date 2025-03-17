import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import Image from "next/image";
import React, { useState } from "react";
import { aiSearch } from "@/actions/search";

export function HomeHero() {
  const {
    value: input,
    height: textareaHeight,
    handleChange: handleTextareaChange,
    setValue: setInput,
    textareaRef,
  } = useAutoResizeTextarea();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await aiSearch(input);
    setLoading(false);
  };

  const suggestions = [
    "Who leads impactful nonprofits?",
    "Who recently founded successful startups?",
    "Who are rising screenwriters in independent cinema?",
    "Who runs highly influential lifestyle blogs or platforms?",
  ];

  return (
    <section className="mb-8 flex h-[68vh] min-h-fit flex-col flex-nowrap items-center justify-center sm:h-[max(60vh,580px)]">
      <h1 className="mb-8 text-center text-4xl text-[clamp(2.4rem,_4vw,_4rem)] font-bold tracking-tighter text-system-marketing-primary sm:text-7xl">
        The{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 from-10% via-pink-500 to-purple-500 to-90%">
          Alumni
        </span>{" "}
        Network
        <br />
        made{" "}
        <span className="text-gray-400 line-through dark:text-gray-500">
          for
        </span>{" "}
        by you
      </h1>

      <div className="flex flex-row flex-nowrap items-end -space-x-20">
        <Image
          draggable={false}
          alt="banner of Linky creators"
          loading="lazy"
          width="1004"
          height="309"
          className="h-32 w-full max-w-xl select-none object-contain sm:h-52 text-transparent"
          src="https://attic.sh/_static/emojis/hero/emojis-home-cover.webp"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="min-h-28 w-full max-w-2xl border bg-gray-100/85 backdrop-blur-xl backdrop-saturate-200 dark:bg-gray-900/80 rounded-2xl"
      >
        <Textarea
          placeholder="Describe who you're looking for..."
          value={input}
          onChange={handleTextareaChange}
          ref={textareaRef}
          className="focus-visible:ring-0 resize-none outline-none border-0 bg-transparent px-3.5 py-3 pl-4 text-sm/6 text-gray-950 placeholder:text-gray-500 dark:text-white transition-all duration-200"
          style={{ height: `${textareaHeight}px` }}
        />

        <div className="relative w-full flex flex-row flex-nowrap items-center justify-between gap-1 overflow-x-auto">
          <span aria-hidden="true" className="inline-block h-10" />
          <Button
            type="submit"
            variant="default"
            size="icon"
            className="bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-800 mr-1 rounded-full shrink-0 hover:bg-gray-700 dark:hover:bg-gray-300"
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <Icon
                icon="lucide:loader"
                className="animate-spin"
                width="24"
                height="24"
              />
            ) : (
              <Icon icon="mdi:arrow-up" width="16" height="16" />
            )}
          </Button>
        </div>
      </form>

      <div className="w-full max-w-2xl py-2.5">
        <div className="relative flex w-full transition-opacity overflow-hidden">
          <div className="suggestion-scroll-container w-full">
            <div className="flex flex-row flex-nowrap gap-2.5 suggestion-scroll">
              {suggestions.concat(suggestions).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-8 shrink-0 rounded-[0.625rem] text-gray-950 dark:text-gray-300 bg-black/[0.06] dark:bg-white/[0.08] hover:cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 whitespace-nowrap"
                  onClick={() => {
                    setInput(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            <div className="pointer-events-none absolute -left-1 bottom-0 top-0 h-full w-20 -translate-x-2 bg-gradient-to-r from-white to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black_0%,black_30%,transparent_100%)] opacity-100 transition-all duration-300 dark:from-black" />
            <div className="pointer-events-none absolute -right-1 bottom-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black_0%,black_30%,transparent_100%)] transition-all duration-300 dark:from-black translate-x-0 opacity-100" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .suggestion-scroll-container {
          overflow: hidden;
          position: relative;
          padding: 0.25rem;
          margin: -0.25rem;
        }

        .suggestion-scroll {
          display: flex;
          animation: scrollSuggestions 30s linear infinite;
          width: max-content;
        }

        @keyframes scrollSuggestions {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Move by exactly half the width to ensure seamless loop */
            transform: translateX(-50%);
          }
        }

        /* Pause animation on hover */
        .suggestion-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
