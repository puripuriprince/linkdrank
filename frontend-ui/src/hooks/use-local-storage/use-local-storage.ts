import { useMemo, useState, useEffect, useCallback } from "react";

import {
  setLocalStorage as setStorage,
  getLocalStorage as getStorage,
  removeLocalStorage as removeStorage,
} from "@/lib/utils";

// ----------------------------------------------------------------------

/**
 * Custom hook to manage state with local storage.
 *
 * @param {string} key - The key for the local storage.
 * @param {T} initialState - The initial state value.
 * @param {Object} [options] - Optional settings.
 * @param {boolean} [options.initializeWithValue=true] - Whether to initialize the local storage with the initial state value.
 *
 * @returns {UseLocalStorageReturn<T>} - An object containing:
 * - `state`: The current state.
 * - `resetState`: A function to reset the state to the initial value and remove it from local storage.
 * - `setState`: A function to update the state and save it to local storage.
 * - `setField`: A function to update a specific field in the state and save it to local storage.
 *
 * @example
 * const { state, resetState, setState, setField } = useLocalStorage('settings', initialState);
 *
 * return (
 *   <div>
 *     <p>State: {JSON.stringify(state)}</p>
 *     <button onClick={() => setState({name: 'John', age: 20})}>Set State</button>
 *     <button onClick={() => setField('name', 'John')}>Set Name</button>
 *     <button onClick={resetState}>Reset</button>
 *   </div>
 * );
 */

export type UseLocalStorageOptions = {
  initializeWithValue?: boolean;
};

export type UseLocalStorageReturn<T> = {
  state: T;
  resetState: (defaultState?: T) => void;
  setState: (updateState: T | Partial<T>) => void;
  setField: (name: keyof T, updateValue: T[keyof T]) => void;
};

export function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: UseLocalStorageOptions,
): UseLocalStorageReturn<T> {
  const { initializeWithValue = true } = options ?? {};
  const isObjectState = defaultValue && typeof defaultValue === "object";

  const [state, setState] = useState<T | undefined>(() => {
    const storedValue = getStorage<T>(key);
    if (storedValue !== null && storedValue !== undefined) {
      return isObjectState ? { ...defaultValue, ...storedValue } : storedValue;
    }
    return defaultValue as T;
  });

  useEffect(() => {
    const storedValue = getStorage<T>(key);

    if (storedValue !== null && storedValue !== undefined) {
      if (defaultValue !== undefined && initializeWithValue) {
        setStorage(key, defaultValue);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateState = useCallback(
    (newState: T | Partial<T>) => {
      if (isObjectState) {
        setState((prevValue) => {
          const updatedState = { ...prevValue, ...newState } as T;
          setStorage<T>(key, updatedState);
          return updatedState;
        });
      } else {
        setStorage<T>(key, newState as T);
        setState(newState as T);
      }
    },
    [key, isObjectState],
  );

  const updateField = useCallback(
    (fieldName: keyof T, updateValue: T[keyof T]) => {
      if (isObjectState) {
        updateState({ [fieldName]: updateValue } as Partial<T>);
      }
    },
    [isObjectState, updateState],
  );

  const resetState = useCallback(
    (newDefaultState?: T) => {
      const stateToReset = newDefaultState ?? defaultValue;
      setState(stateToReset as T);
      removeStorage(key);
    },
    [defaultValue, key],
  );

  const memoizedValue = useMemo(
    () => ({
      state: state as T,
      setState: updateState,
      setField: updateField,
      resetState,
    }),
    [resetState, updateField, updateState, state],
  );

  return memoizedValue;
}
