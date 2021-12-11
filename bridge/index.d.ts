declare global {
    interface Window {
        settings: {
            set(): void;
            get(): void
        }
    }
}