export class FullscreenController {
    constructor() {
        this.init();
    }

    private init(): void {
        document.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('[data-vlt-toggle="fullscreen"]');
            if (!btn) return;

            e.preventDefault();
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.warn('Error attempting to enable fullscreen:', err);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch((err) => {
                        console.warn('Error attempting to exit fullscreen:', err);
                    });
                }
            }
        });
    }
}

