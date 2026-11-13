export class CardController {
    constructor() {
        this.init();
    }

    private init(): void {
        document.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('[data-vlt-card]');
            if (!btn) return;

            const action = btn.getAttribute('data-vlt-card');
            const card = btn.closest('.vlt-card');
            if (!card) return;

            if (action === 'collapse') {
                card.classList.toggle('is-collapsed');
            } else if (action === 'maximize') {
                card.classList.toggle('is-maximized');
                // Adjust body scroll if card is maximized
                if (card.classList.contains('is-maximized')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            } else if (action === 'remove') {
                card.classList.add('transition-opacity', 'opacity-0');
                setTimeout(() => card.remove(), 200);
            }
        });
    }
}
