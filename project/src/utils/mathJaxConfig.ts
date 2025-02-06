export const initMathJax = () => {
  // Only initialize if MathJax hasn't been loaded yet
  if (typeof window.MathJax === 'undefined') {
    // Configure MathJax before loading the script
    window.MathJax = {
      loader: {
        load: ['[tex]/ams', '[tex]/newcommand', '[tex]/configmacros']
      },
      tex: {
        packages: ['base', 'ams', 'newcommand', 'configmacros'],
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
        processEscapes: true,
        processEnvironments: true,
        macros: {
          // Add any custom macros here
          R: '\\mathbb{R}',
          N: '\\mathbb{N}',
          Z: '\\mathbb{Z}',
          Q: '\\mathbb{Q}',
          C: '\\mathbb{C}'
        }
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        processHtmlClass: 'tex2jax_process'
      },
      startup: {
        pageReady: () => {
          console.log('MathJax is ready');
          return Promise.resolve();
        }
      }
    };

    // Create and load the MathJax script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    script.async = true;
    document.head.appendChild(script);
  }
}; 