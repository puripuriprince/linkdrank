import { useCallback, useEffect, useRef, useState } from "react";

export type UseAutoResizeTextareaReturn = {
    value: string;
    height: number;
    setValue: (newValue: string) => void;
    setHeight: (newHeight: number) => void;
    reset: (defaultValue?: string, defaultHeight?: number) => void;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export function useAutoResizeTextarea(
    initialHeight: number = 48,
    initialValue: string = ""
): UseAutoResizeTextareaReturn {
    const [value, setValueState] = useState<string>(initialValue);
    const [height, setHeightState] = useState<number>(initialHeight);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Function to adjust the height based on actual content
    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height temporarily to get the correct scrollHeight
        textarea.style.height = "auto";

        // Calculate new height (scrollHeight + any padding adjustment if needed)
        const newHeight = Math.max(initialHeight, textarea.scrollHeight);

        // Apply new height (with max height constraint if desired)
        const maxHeight = 104;
        textarea.style.height = `${Math.min(newHeight, maxHeight)}px`;

        // Update state
        setHeightState(Math.min(newHeight, maxHeight));
    }, [initialHeight]);

    // Adjust height whenever value changes
    useEffect(() => {
        adjustHeight();
    }, [value, adjustHeight]);

    // Handle manual value changes
    const setValue = useCallback(
        (newValue: string) => {
            setValueState(newValue);
            // Height will be adjusted by the effect
        },
        []
    );

    // Directly set height if needed
    const setHeight = useCallback((newHeight: number) => {
        setHeightState(newHeight);
        if (textareaRef.current) {
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, []);

    // Handle textarea change event
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            setValueState(newValue);
            // Height will be adjusted by the effect
        },
        []
    );

    // Reset functionality
    const reset = useCallback(
        (defaultValue?: string, defaultHeight?: number) => {
            const newValue = defaultValue ?? initialValue;
            setValueState(newValue);

            // Only manually set height if specified
            if (defaultHeight !== undefined) {
                setHeightState(defaultHeight);
                if (textareaRef.current) {
                    textareaRef.current.style.height = `${defaultHeight}px`;
                }
            }
            // Otherwise let the effect handle height adjustment
        },
        [initialValue]
    );

    return {
        value,
        height,
        setValue,
        setHeight,
        reset,
        handleChange,
        textareaRef,
    };
}