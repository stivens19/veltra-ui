export class DropdownController {
    constructor() {
        this.init();
    }

    private init(): void {
        document.addEventListener('click', (e) => {
            const toggle = (e.target as HTMLElement).closest('[data-vlt-toggle="dropdown"]');

            if (toggle) {
                e.preventDefault();
                e.stopPropagation();

                const dropdownContainer = toggle.closest('.vlt-dropdown');
                if (!dropdownContainer) return;

                const menu = dropdownContainer.querySelector('.vlt-dropdown-menu');
                if (!menu) return;

                const isCurrentlyOpen = menu.classList.contains('is-open');

                // Close other open dropdowns
                this.closeAll();

                if (!isCurrentlyOpen) {
                    menu.classList.add('is-open');
                }
                return;
            }

            // Clicked inside dropdown menu: if clicked on an item that isn't a sub-dropdown, close dropdown
            const clickedInsideMenu = (e.target as HTMLElement).closest('.vlt-dropdown-menu');
            if (clickedInsideMenu) {
                const isActionItem = (e.target as HTMLElement).closest('.vlt-dropdown-item, .vlt-dropdown-footer');
                if (isActionItem) {
                    this.closeAll();
                }
                return;
            }

            // Clicked outside: close all dropdowns
            this.closeAll();
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    }

    private closeAll(): void {
        document.querySelectorAll('.vlt-dropdown-menu.is-open').forEach((menu) => {
            menu.classList.remove('is-open');
        });
    }
}

