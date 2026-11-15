/**
 * 株式会社聖建（SEIKEN）採用・会社案内 特設サイト
 * メインスクリプト
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ヘッダーのスクロール効果
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. モバイルナビゲーション（ハンバーガーメニュー）
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const navOverlay = document.querySelector('.nav-overlay');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  function toggleNav() {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
  }

  function closeNav() {
    hamburger.classList.remove('active');
    navMobile.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleNav);
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // 3. FAQアコーディオン
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // 他を閉じる（単一展開にする場合）
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      item.classList.toggle('active', !isActive);
    });
  });

  // 4. スクロールアニメーション (Intersection Observer)
  const fadeElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // フォールバック
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // 5. 応募・お問い合わせフォーム処理
  const recruitForm = document.getElementById('recruitForm');
  const formSuccessModal = document.getElementById('formSuccessModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (recruitForm) {
    recruitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = recruitForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // 送信中インジケータ
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        送信中...
      `;

      // 送信シミュレーション（1.2秒後に完了モーダル表示）
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        recruitForm.reset();
        if (formSuccessModal) {
          formSuccessModal.classList.add('active');
        }
      }, 1200);
    });
  }

  if (modalCloseBtn && formSuccessModal) {
    modalCloseBtn.addEventListener('click', () => {
      formSuccessModal.classList.remove('active');
    });

    // モーダル外側クリックで閉じる
    formSuccessModal.addEventListener('click', (e) => {
      if (e.target === formSuccessModal) {
        formSuccessModal.classList.remove('active');
      }
    });
  }

  // 6. スムーズスクロールのオフセット調整（固定ヘッダー対応）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
