'use client';
import { useEffect } from 'react';

/**
 * Hiệu ứng "bật ra từ điểm vừa bấm" cho mọi hộp thoại kính.
 *
 * Cách hoạt động (nói đơn giản): trình duyệt nhớ chỗ ngón tay / chuột vừa bấm;
 * khi một hộp thoại xuất hiện, ta bảo nó "phóng to bắt đầu từ đúng chỗ đó"
 * thay vì phóng từ giữa. Chạy một lần ở toàn trang, không cần sửa từng hộp thoại.
 */
export function PopOrigin() {
  useEffect(() => {
    let last = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const remember = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
    };

    const place = (el: HTMLElement) => {
      // offsetLeft/offsetTop không bị ảnh hưởng bởi hiệu ứng phóng to đang chạy
      const x = last.x - el.offsetLeft;
      const y = last.y - el.offsetTop;
      el.style.transformOrigin = `${x}px ${y}px`;
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const targets = node.matches('.chakra-modal__content')
            ? [node]
            : Array.from(
                node.querySelectorAll<HTMLElement>('.chakra-modal__content')
              );
          targets.forEach(place);
        });
      }
    });

    window.addEventListener('pointerdown', remember, true);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('pointerdown', remember, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
