'use client';

import { useEffect } from 'react';

function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) element.scrollIntoView();
    }
  }, []);
  return null;
}

export { ScrollToHash };
