import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      
      // Apply dark class to HTML element
      const html = document.documentElement;
      
      if (newTheme === 'dark') {
        html.classList.add('dark');
        console.log('✅ Dark mode activated');
      } else {
        html.classList.remove('dark');
        console.log('✅ Light mode activated');
      }
      
      return { theme: newTheme };
    });
  },
}));
