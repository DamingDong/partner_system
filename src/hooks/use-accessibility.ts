import { useEffect, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  onKeyDown?: (event: KeyboardEvent) => void;
  targetRef?: React.RefObject<HTMLElement>;
  dependencies?: any[];
}

export function useKeyboardNavigation({
  onKeyDown,
  targetRef,
  dependencies = [],
}: UseKeyboardNavigationOptions) {
  useEffect(() => {
    const element = targetRef?.current || document;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, dependencies);
}

interface UseFocusTrapOptions {
  containerRef: React.RefObject<HTMLElement>;
  isActive: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export function useFocusTrap({ containerRef, isActive, initialFocusRef }: UseFocusTrapOptions) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = initialFocusRef?.current || focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive, containerRef, initialFocusRef]);
}

interface UseAnnouncementOptions {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function useAnnouncement({ message, priority = 'polite' }: UseAnnouncementOptions) {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  }, [message]);

  return {
    announcementProps: {
      'aria-live': priority,
      'aria-atomic': 'true',
      ref: announcementRef,
      className: 'sr-only',
    },
  };
}

export function useAriaLabel(label: string) {
  return {
    'aria-label': label,
  };
}

export function useKeyboardShortcut(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const modifier = [];
      
      if (event.ctrlKey || event.metaKey) modifier.push('ctrl');
      if (event.shiftKey) modifier.push('shift');
      if (event.altKey) modifier.push('alt');
      
      const shortcut = [...modifier, key].join('+');
      
      if (shortcuts[shortcut]) {
        event.preventDefault();
        shortcuts[shortcut]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}