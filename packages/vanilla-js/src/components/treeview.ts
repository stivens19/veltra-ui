import { createIcons, icons } from 'lucide';

export class TreeviewController {
    private currentFlyout: HTMLElement | null = null;
    private currentFlyoutToggle: HTMLElement | null = null;

    constructor() {
        this.init();
    }

    public closeFlyout(): void {
        if (this.currentFlyout) {
            this.currentFlyout.remove();
            this.currentFlyout = null;
            this.currentFlyoutToggle = null;
        }
    }

    private showFlyout(toggle: HTMLElement, parentItem: HTMLElement, treeview: HTMLElement): void {
        this.closeFlyout();

        const title = toggle.querySelector('.vlt-nav-text')?.textContent?.trim() || 'Menu';
        const flyout = document.createElement('div');
        flyout.className = 'vlt-sidebar-flyout';
        this.currentFlyout = flyout;
        this.currentFlyoutToggle = toggle;

        const header = document.createElement('div');
        header.className = 'vlt-sidebar-flyout-header';
        header.innerHTML = `<span>${title}</span><i data-lucide="chevron-right" class="w-3.5 h-3.5 text-cyan-500 opacity-60"></i>`;
        flyout.appendChild(header);

        const list = document.createElement('ul');
        list.className = 'vlt-sidebar-flyout-list';

        const originalLinks = Array.from(treeview.querySelectorAll('a.vlt-nav-link'));
        originalLinks.forEach((origLink) => {
            const li = document.createElement('li');
            li.className = 'vlt-sidebar-flyout-item';

            const a = document.createElement('a');
            const isActive = origLink.classList.contains('active');
            a.className = `vlt-sidebar-flyout-link ${isActive ? 'active' : ''}`;
            const href = origLink.getAttribute('href') || '#';
            a.setAttribute('href', href);
            const targetAttr = origLink.getAttribute('data-target');
            if (targetAttr) a.setAttribute('data-target', targetAttr);

            const textEl = origLink.querySelector('.vlt-nav-text');
            const labelText = textEl?.textContent?.trim() || origLink.textContent?.trim() || '';
            a.innerHTML = `<i data-lucide="${isActive ? 'circle-dot' : 'circle'}" class="w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}"></i><span>${labelText}</span>`;

            a.addEventListener('click', (ev) => {
                const isReal = href && href !== '#' && !href.startsWith('javascript:');
                if (isReal) {
                    this.closeFlyout();
                    window.location.href = href;
                } else {
                    ev.preventDefault();
                    this.closeFlyout();
                    (origLink as HTMLElement).click();
                }
            });

            li.appendChild(a);
            list.appendChild(li);
        });

        flyout.appendChild(list);
        document.body.appendChild(flyout);

        // Position to the right of the collapsed sidebar icon
        const rect = toggle.getBoundingClientRect();
        flyout.style.left = `${rect.right + 12}px`;

        const flyoutHeight = flyout.offsetHeight || 220;
        const maxTop = window.innerHeight - flyoutHeight - 16;
        const topPos = Math.max(16, Math.min(rect.top, maxTop));
        flyout.style.top = `${topPos}px`;

        createIcons({ icons });
    }

    private init(): void {
        // Close flyout on outside click, scroll, resize or escape
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (this.currentFlyout && !this.currentFlyout.contains(target) && !target.closest('[data-vlt-toggle="treeview"]')) {
                this.closeFlyout();
            }
            if (target.closest('[data-vlt-toggle="sidebar"]')) {
                this.closeFlyout();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeFlyout();
        });

        window.addEventListener('scroll', () => this.closeFlyout(), true);
        window.addEventListener('resize', () => this.closeFlyout());

        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            // 1. Check if clicked on a treeview toggle link
            const toggle = target.closest('[data-vlt-toggle="treeview"]') as HTMLElement | null;
            if (toggle) {
                e.preventDefault();

                const parentItem = toggle.closest('.vlt-nav-item');
                if (!parentItem) return;

                const wrapper = document.querySelector('.vlt-wrapper');
                const isCollapsed = wrapper?.classList.contains('vlt-sidebar-collapsed') || document.body.classList.contains('vlt-sidebar-collapsed');

                // If sidebar is collapsed in mini mode, show floating flyout to the right!
                if (isCollapsed) {
                    if (this.currentFlyout && this.currentFlyoutToggle === toggle) {
                        this.closeFlyout();
                        return;
                    }

                    const treeview = parentItem.querySelector('.vlt-nav-treeview') as HTMLElement | null;
                    if (treeview) {
                        this.showFlyout(toggle, parentItem as HTMLElement, treeview);
                    }
                    return;
                }

                const isOpen = parentItem.classList.contains('is-open');

                // Accordion behavior: close other open items only if parent has data-accordion="true"
                const parentNav = parentItem.parentElement;
                if (parentNav && parentNav.getAttribute('data-accordion') === 'true') {
                    const children = Array.from(parentNav.children);
                    for (const child of children) {
                        if (child !== parentItem && child.classList.contains('is-open')) {
                            child.classList.remove('is-open');
                        }
                    }
                }

                // Toggle current item
                if (isOpen) {
                    parentItem.classList.remove('is-open');
                } else {
                    parentItem.classList.add('is-open');
                }

                document.dispatchEvent(new CustomEvent('veltra:treeview-toggle', {
                    detail: { item: parentItem, isOpen: !isOpen }
                }));
                return;
            }

            // 2. Check if clicked on a sub-item inside a treeview
            const sublink = target.closest('.vlt-nav-treeview .vlt-nav-link') as HTMLElement | null;
            if (sublink) {
                const href = sublink.getAttribute('href');
                const isRealPage = href && href !== '#' && !href.startsWith('javascript:');

                // If this is a real page link (e.g. /index2.html, /index3.html), allow native navigation!
                if (isRealPage) {
                    return;
                }

                // Otherwise, prevent default anchor jump and handle in-page switching
                e.preventDefault();

                // Remove active class from all other sublinks and reset icons to circle
                const allSublinks = document.querySelectorAll('.vlt-nav-treeview .vlt-nav-link');
                allSublinks.forEach((link) => {
                    link.classList.remove('active');
                    const icon = link.querySelector('[data-lucide], svg');
                    if (icon) {
                        icon.outerHTML = '<i data-lucide="circle" class="w-3.5 h-3.5 text-slate-400"></i>';
                    }
                });

                // Mark current sublink as active and set icon to circle-dot
                sublink.classList.add('active');
                const activeIcon = sublink.querySelector('[data-lucide], svg');
                if (activeIcon) {
                    activeIcon.outerHTML = '<i data-lucide="circle-dot" class="w-3.5 h-3.5 text-cyan-500"></i>';
                }

                // Remove active from all main nav links, then activate current parent toggle
                document.querySelectorAll('.vlt-nav > .vlt-nav-item > .vlt-nav-link').forEach((l) => {
                    l.classList.remove('active');
                });
                const parentNav = sublink.closest('.vlt-nav-item');
                if (parentNav) {
                    const parentToggle = parentNav.querySelector('[data-vlt-toggle="treeview"]') as HTMLElement | null;
                    if (parentToggle) {
                        parentToggle.classList.add('active');
                    }
                }

                // Refresh Lucide icons
                createIcons({ icons });

                // Update page title and breadcrumbs
                const textEl = sublink.querySelector('.vlt-nav-text');
                const label = textEl?.textContent?.trim() || '';
                const parentSection = parentNav?.querySelector('[data-vlt-toggle="treeview"] .vlt-nav-text')?.textContent?.trim() || 'Menu';

                const titleEl = document.querySelector('.vlt-page-title');
                const breadcrumbActive = document.querySelector('.vlt-breadcrumb .active');
                const breadcrumbParent = document.querySelector('.vlt-breadcrumb .breadcrumb-parent');

                if (titleEl && label) titleEl.textContent = label;
                if (breadcrumbActive && label) breadcrumbActive.textContent = label;
                if (breadcrumbParent && parentSection) breadcrumbParent.textContent = parentSection;

                // Dispatch global navigation event for router
                const targetId = sublink.getAttribute('data-target') || sublink.getAttribute('href')?.replace('#', '') || '';
                document.dispatchEvent(new CustomEvent('veltra:nav', {
                    detail: {
                        sublink,
                        title: label,
                        section: parentSection,
                        targetId
                    }
                }));
                return;
            }

            // 3. Check if clicked on a single top-level nav link (e.g. Widgets, Calendar, Gallery, Kanban)
            const topNavLink = target.closest('.vlt-nav > .vlt-nav-item > .vlt-nav-link:not([data-vlt-toggle="treeview"])') as HTMLElement | null;
            if (topNavLink) {
                const href = topNavLink.getAttribute('href');
                const isRealPage = href && href !== '#' && !href.startsWith('javascript:');

                if (isRealPage) {
                    return;
                }

                e.preventDefault();

                // Remove active from any other link
                document.querySelectorAll('.vlt-nav-link.active').forEach((link) => {
                    link.classList.remove('active');
                });

                // Reset all sublink icons
                document.querySelectorAll('.vlt-nav-treeview .vlt-nav-link').forEach((link) => {
                    const icon = link.querySelector('[data-lucide], svg');
                    if (icon) {
                        icon.outerHTML = '<i data-lucide="circle" class="w-3.5 h-3.5 text-slate-400"></i>';
                    }
                });

                topNavLink.classList.add('active');
                createIcons({ icons });

                const textEl = topNavLink.querySelector('.vlt-nav-text');
                const label = textEl?.textContent?.trim() || '';
                const titleEl = document.querySelector('.vlt-page-title');
                const breadcrumbActive = document.querySelector('.vlt-breadcrumb .active');
                const breadcrumbParent = document.querySelector('.vlt-breadcrumb .breadcrumb-parent');

                if (titleEl && label) titleEl.textContent = label;
                if (breadcrumbActive && label) breadcrumbActive.textContent = label;
                if (breadcrumbParent) breadcrumbParent.textContent = 'App';

                const targetId = topNavLink.getAttribute('data-target') || topNavLink.getAttribute('href')?.replace('#', '') || '';
                document.dispatchEvent(new CustomEvent('veltra:nav', {
                    detail: {
                        sublink: topNavLink,
                        title: label,
                        section: 'App',
                        targetId
                    }
                }));
            }
        });
    }
}
