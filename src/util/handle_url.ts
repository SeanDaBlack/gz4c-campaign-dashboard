// File for handling URL-related utilities

export function validateUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}