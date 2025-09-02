export default class HeaderService {
    constructor() {
        this.currentLanguage = 'fr';
    }

    initThemeSwitcher() {
        const moonBtn = document.getElementById('moon-btn');
        const sunBtn = document.getElementById('sun-btn');

        if (moonBtn && sunBtn) {
            moonBtn.addEventListener('click', () => this.setTheme('dark'));
            sunBtn.addEventListener('click', () => this.setTheme('light'));
        }

        // On load, set initial state
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = document.documentElement.classList.contains('dark')
            ? 'dark'
            : (prefersDark ? 'dark' : 'light');
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const moonBtn = document.getElementById('moon-btn');
        const sunBtn = document.getElementById('sun-btn');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if (moonBtn && sunBtn) {
                moonBtn.classList.add('active');
                sunBtn.classList.remove('active');
                moonBtn.setAttribute('aria-pressed', 'true');
                sunBtn.setAttribute('aria-pressed', 'false');
            }
        } else {
            document.documentElement.classList.remove('dark');
            if (moonBtn && sunBtn) {
                sunBtn.classList.add('active');
                moonBtn.classList.remove('active');
                sunBtn.setAttribute('aria-pressed', 'true');
                moonBtn.setAttribute('aria-pressed', 'false');
            }
        }
        this.updateMobileMenuIcon();
    }

    updateMobileMenuIcon() {
        const menuIcon = document.getElementById('mobile-menu-icon');
        const menuIconDark = document.getElementById('mobile-menu-icon-dark');
        if (document.documentElement.classList.contains('dark')) {
            if (menuIcon) menuIcon.style.display = 'none';
            if (menuIconDark) menuIconDark.style.display = 'block';
        } else {
            if (menuIcon) menuIcon.style.display = 'block';
            if (menuIconDark) menuIconDark.style.display = 'none';
        }
    }

    initLanguageDropdown() {
        // Desktop dropdown
        const desktopDropdown = document.getElementById('language-desktop');
        if (desktopDropdown) {
            const button = desktopDropdown.querySelector('button');
            const menu = desktopDropdown.querySelector('div');
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
            });
            document.addEventListener('click', (e) => {
                if (!desktopDropdown.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
        }
        this.setupLanguageOptions();
        this.updateLanguageDisplay();
    }

    setupLanguageOptions() {
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentLanguage = option.dataset.lang;
                this.updateLanguageDisplay();
                document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
                document.querySelectorAll('#language-desktop div, #mobile-menu').forEach(el => {
                    el.classList.add('hidden');
                });
                const menuIcon = document.getElementById('mobile-menu-icon');
                const menuIconDark = document.getElementById('mobile-menu-icon-dark');
                if (menuIcon && menuIconDark) {
                    if (document.documentElement.classList.contains('dark')) {
                        menuIcon.style.display = 'none';
                        menuIconDark.style.display = 'block';
                    } else {
                        menuIcon.style.display = 'block';
                        menuIconDark.style.display = 'none';
                    }
                }
            });
        });
    }

    updateLanguageDisplay() {
        const languages = {
            fr: 'Français',
            ar: 'العربية'
        };
        document.querySelectorAll('#current-language').forEach(el => {
            if (el) el.textContent = languages[this.currentLanguage];
        });
        // Highlight selected language in red
        document.querySelectorAll('.language-option').forEach(btn => {
            if (btn.dataset.lang === this.currentLanguage) {
                btn.style.color = '#ED1C24';
                btn.classList.add('selected');
            } else {
                btn.style.color = '';
                btn.classList.remove('selected');
            }
        });
        // Update help text for Arabic
        const helpText = this.currentLanguage === 'ar' ? 'مساعدة' : "Besoin d'aide ?";
        document.querySelectorAll('#help-text, #help-text-mobile').forEach(el => {
            if (el) el.textContent = helpText;
        });
    }
}
