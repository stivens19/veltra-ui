export class SidebarController {
    private wrapper: HTMLElement | null;

    constructor() {
        this.wrapper = document.querySelector('.vlt-wrapper');
        this.init();
    }

    private init(): void {
        document.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('[data-vlt-toggle="sidebar"]');
            if (btn && this.wrapper) {
                e.preventDefault();
                const isMobile = window.innerWidth < 1024;
                const isTopNav = this.wrapper.classList.contains('vlt-layout-top-nav') || document.body.classList.contains('vlt-layout-top-nav');
                if (isMobile || isTopNav) {
                    this.wrapper.classList.toggle('vlt-sidebar-mobile-open');
                } else {
                    this.wrapper.classList.toggle('vlt-sidebar-collapsed');
                }
            }

            // Close mobile sidebar when clicking backdrop
            const backdrop = (e.target as HTMLElement).closest('.vlt-backdrop');
            if (backdrop && this.wrapper) {
                this.wrapper.classList.remove('vlt-sidebar-mobile-open');
            }
        });

        // Close mobile drawer on resize to desktop (except if in Top Nav mode)
        window.addEventListener('resize', () => {
            const isTopNav = this.wrapper?.classList.contains('vlt-layout-top-nav') || document.body.classList.contains('vlt-layout-top-nav');
            if (!isTopNav && window.innerWidth >= 1024 && this.wrapper?.classList.contains('vlt-sidebar-mobile-open')) {
                this.wrapper.classList.remove('vlt-sidebar-mobile-open');
            }
        });
    }
}
