export class ModalController {
    constructor() {
        this.init();
    }

    private init(): void {
        // Open modal
        document.addEventListener('click', (e: MouseEvent) => {
            const trigger = (e.target as HTMLElement).closest('[data-vlt-toggle="modal"]') as HTMLElement;
            if (trigger) {
                e.preventDefault();
                const targetSelector = trigger.getAttribute('data-vlt-target');
                if (targetSelector) {
                    this.show(targetSelector);
                }
                return;
            }

            // Close modal via dismiss button
            const dismissBtn = (e.target as HTMLElement).closest('[data-vlt-dismiss="modal"]') as HTMLElement;
            if (dismissBtn) {
                e.preventDefault();
                const modal = dismissBtn.closest('.vlt-modal') as HTMLElement;
                if (modal) {
                    this.hide(modal);
                }
                return;
            }

            // Close modal when clicking directly on backdrop
            const modalBackdrop = e.target as HTMLElement;
            if (modalBackdrop && modalBackdrop.classList.contains('vlt-modal')) {
                this.hide(modalBackdrop);
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.vlt-modal.flex');
                openModals.forEach(modal => this.hide(modal as HTMLElement));
            }
        });
    }

    public show(target: string | HTMLElement): void {
        const modal = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
        if (!modal) return;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');

        modal.dispatchEvent(new CustomEvent('veltra:modal:opened', { bubbles: true }));
    }

    public hide(target: string | HTMLElement): void {
        const modal = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
        if (!modal) return;

        modal.classList.remove('flex');
        modal.classList.add('hidden');

        // Only restore body overflow if no other modals are open
        const remainingOpen = document.querySelectorAll('.vlt-modal.flex');
        if (remainingOpen.length === 0) {
            document.body.classList.remove('overflow-hidden');
        }

        modal.dispatchEvent(new CustomEvent('veltra:modal:closed', { bubbles: true }));
    }

    public toast(options: { title: string; message: string; type?: 'cyan' | 'emerald' | 'amber' | 'rose'; duration?: number }): void {
        let container = document.querySelector('.vlt-toast-container') as HTMLElement;
        if (!container) {
            container = document.createElement('div');
            container.className = 'vlt-toast-container';
            document.body.appendChild(container);
        }

        const type = options.type || 'cyan';
        const duration = options.duration || 4000;

        const iconNames = {
            cyan: 'info',
            emerald: 'check-circle-2',
            amber: 'alert-triangle',
            rose: 'alert-circle'
        };

        const toast = document.createElement('div');
        toast.className = `vlt-toast vlt-toast-${type}`;
        toast.innerHTML = `
            <div class="vlt-toast-icon">
                <i data-lucide="${iconNames[type]}" class="w-5 h-5"></i>
            </div>
            <div class="vlt-toast-content">
                <p class="vlt-toast-title">${options.title}</p>
                <p class="vlt-toast-desc">${options.message}</p>
            </div>
            <button type="button" class="vlt-toast-close" data-vlt-dismiss="toast">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;

        toast.querySelector('[data-vlt-dismiss="toast"]')?.addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.isConnected) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                setTimeout(() => toast.remove(), 250);
            }
        }, duration);

        // Notify icon renderer
        document.dispatchEvent(new CustomEvent('veltra:icons:update'));
    }
}

