export class TabsController {
    constructor() {
        this.init();
    }

    private init(): void {
        document.addEventListener('click', (e: MouseEvent) => {
            const tabLink = (e.target as HTMLElement).closest('[data-vlt-toggle="tab"]') as HTMLElement;
            if (!tabLink) return;

            e.preventDefault();

            const targetSelector = tabLink.getAttribute('data-vlt-target') || tabLink.getAttribute('href');
            if (!targetSelector) return;

            const targetPane = document.querySelector(targetSelector) as HTMLElement;
            if (!targetPane) return;

            // Find parent nav container
            const tabNav = tabLink.closest('.vlt-tabs');
            if (tabNav) {
                tabNav.querySelectorAll('.vlt-tab-link').forEach(link => link.classList.remove('active'));
                tabLink.classList.add('active');
            }

            // Find parent tab content container
            const tabContent = targetPane.parentElement;
            if (tabContent && tabContent.classList.contains('vlt-tab-content')) {
                tabContent.querySelectorAll('.vlt-tab-pane').forEach(pane => pane.classList.remove('active'));
                targetPane.classList.add('active');
            }

            // Re-render any icons inside the pane
            const event = new CustomEvent('veltra:tab:change', {
                bubbles: true,
                detail: { targetSelector }
            });
            tabLink.dispatchEvent(event);
        });
    }
}

