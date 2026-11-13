import { createIcons, icons } from 'lucide';
import { SidebarController } from './components/sidebar';
import { CardController } from './components/card';
import { TreeviewController } from './components/treeview';
import { DropdownController } from './components/dropdown';
import { FullscreenController } from './components/fullscreen';
import { TabsController } from './components/tabs';
import { ModalController } from './components/modal';

export class VeltraUI {
    public sidebar: SidebarController;
    public card: CardController;
    public treeview: TreeviewController;
    public dropdown: DropdownController;
    public fullscreen: FullscreenController;
    public tabs: TabsController;
    public modal: ModalController;

    constructor() {
        this.sidebar = new SidebarController();
        this.card = new CardController();
        this.treeview = new TreeviewController();
        this.dropdown = new DropdownController();
        this.fullscreen = new FullscreenController();
        this.tabs = new TabsController();
        this.modal = new ModalController();
        this.initThemeToggle();
        this.initIcons();

        document.addEventListener('veltra:icons:update', () => {
            this.initIcons();
        });
    }

    public initIcons(): void {
        createIcons({ icons });
    }

    private initThemeToggle(): void {
        const applyTheme = (theme: string) => {
            const html = document.documentElement;
            html.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
            try {
                localStorage.setItem('veltra-theme', theme);
            } catch (e) {}

            // Update icon on all theme toggle buttons
            document.querySelectorAll('[data-vlt-toggle="theme"]').forEach((btn) => {
                const icon = btn.querySelector('i[data-lucide], svg');
                if (icon) {
                    icon.setAttribute('data-lucide', theme === 'dark' ? 'moon' : 'sun-medium');
                }
            });
            createIcons({ icons });
        };

        document.addEventListener('click', (e) => {
            const btn = (e.target as HTMLElement).closest('[data-vlt-toggle="theme"]');
            if (!btn) return;
            const html = document.documentElement;
            const current = html.getAttribute('data-theme') || (html.classList.contains('dark') ? 'dark' : 'light');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });

        // Restore saved theme on startup
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('veltra-theme') || 
                    (document.documentElement.getAttribute('data-theme') ?? 'light');
                applyTheme(saved);
            } catch (e) {}
        }
    }
}

// Auto-instantiate when DOM is loaded in browser
if (typeof window !== 'undefined') {
    const init = () => {
        (window as any).veltra = new VeltraUI();
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

export {
    SidebarController,
    CardController,
    TreeviewController,
    DropdownController,
    FullscreenController,
    TabsController,
    ModalController,
    createIcons,
    icons
};
