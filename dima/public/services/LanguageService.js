class LanguageService {
  constructor() {
    this.listeners = [];
    this.current = localStorage.getItem('header_lanuage') || 'fr';
  }

  setLanguage(lang) {
    this.current = lang;
    localStorage.setItem('header_lanuage', lang);
    this.listeners.forEach(cb => cb(lang));
  }

  getLanguage() {
    return this.current;
  }

  onChange(cb) {
    this.listeners.push(cb);
  }
}

export default new LanguageService();
