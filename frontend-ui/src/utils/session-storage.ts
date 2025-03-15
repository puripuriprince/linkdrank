/**
 * Retrieves a value from session storage by key.
 *
 * @param {string} key - The key of the item to retrieve.
 * @param defaultValue
 * @returns {any | null} - The parsed value of the item, or null if not found or an error occurs.
 *
 * @example
 * const user = getStorage('user');
 * console.log(user); // { name: 'John', age: 30 }
 */
export function getStorage<T>(
  key: string,
  defaultValue?: T,
): T | null | undefined {
  if (!sessionStorageAvailable()) {
    return defaultValue ?? null;
  }

  const storedValue = sessionStorage.getItem(key);

  if (storedValue === "undefined") {
    return undefined as T;
  }

  if (storedValue) {
    try {
      // value as object
      return JSON.parse(storedValue) as T;
    } catch {
      // value as string
      return (storedValue as unknown as T) ?? defaultValue ?? null;
    }
  }

  return defaultValue ?? null;
}

// ----------------------------------------------------------------------

/**
 * Sets a value in session storage with a specified key.
 *
 * @template T
 * @param {string} key - The key of the item to set.
 * @param {T} value - The value of the item to set.
 *
 * @example
 * setStorage('user', { name: 'John', age: 30 });
 */

export function setStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    window.sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error while setting storage:", error);
  }
}

// ----------------------------------------------------------------------

/**
 * Removes an item from local storage by key.
 *
 * @param {string} key - The key of the item to remove.
 *
 * @example
 * removeStorage('user');
 */

export function removeStorage(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Error while removing from storage:", error);
  }
}

// ----------------------------------------------------------------------

/**
 * Checks if session storage is available.
 *
 * @returns {boolean} - True if session storage is available, false otherwise.
 *
 * @example
 * const isAvailable = sessionStorageAvailable();
 * console.log(isAvailable); // true or false
 */

export function sessionStorageAvailable(): boolean {
  try {
    const key = "__some_random_key_you_are_not_going_to_use__";
    window.sessionStorage.setItem(key, key);
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
