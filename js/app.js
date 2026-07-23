/**
 * 鹽水國中輔導組 - 114學年度家庭教育成果 (Google Sites 風格腳本)
 */

document.addEventListener('DOMContentLoaded', () => {
  const sidebarMenuList = document.getElementById('sidebarMenuList');
  const mainContainer = document.getElementById('sitesMainContainer');
  
  // Lightbox 彈窗元素
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const btnLightboxClose = document.getElementById('btnLightboxClose');
  const btnLightboxPrev = document.getElementById('btnLightboxPrev');
  const btnLightboxNext = document.getElementById('btnLightboxNext');

  let currentGalleryImages = [];
  let currentImageIndex = 0;

  // 初始化渲染
  renderSidebarMenu();
  renderMainSections();
  setupScrollSpy();
  setupEventListeners();

  /**
   * 1. 動態生成左側主題導覽選單
   */
  function renderSidebarMenu() {
    sidebarMenuList.innerHTML = familyEduData.map((item, index) => {
      return `
        <li class="${index === 0 ? 'active' : ''}" id="menu-item-${item.id}">
          <a href="#section-${item.id}">
            ${item.code} ${item.title}
          </a>
        </li>
      `;
    }).join('');
  }

  /**
   * 2. 動態生成右側成果主題區塊 (Google Sites 風格)
   */
  function renderMainSections() {
    mainContainer.innerHTML = familyEduData.map(item => {
      const isSingleImg = item.images.length === 1;

      const imagesHtml = item.images.map((imgSrc, idx) => {
        const caption = item.imageCaptions && item.imageCaptions[idx] ? item.imageCaptions[idx] : item.title;
        return `
          <div class="image-card-box">
            <div class="image-container" data-img-src="${imgSrc}" data-caption="${item.code} ${item.title} - ${caption}">
              <img src="${imgSrc}" alt="${caption}" loading="lazy" />
              <div class="image-overlay-hint">🔍 點擊放大照片</div>
            </div>
            <div class="image-caption">${caption}</div>
          </div>
        `;
      }).join('');

      return `
        <section class="sites-section-card" id="section-${item.id}">
          <h2 class="section-title">
            <span>📌</span>
            <span>${item.code}：${item.title}</span>
          </h2>
          
          <div class="section-meta-info">
            <span>📂 類別：${item.categoryName}</span>
            <span>🎓 對象：${item.gradeName}</span>
          </div>

          <div class="section-desc">
            ${item.description}
          </div>

          <div class="image-grid ${isSingleImg ? 'single-image' : ''}">
            ${imagesHtml}
          </div>
        </section>
      `;
    }).join('');

    bindImageClickEvents();
  }

  /**
   * 3. 綁定圖片點擊打開 Lightbox
   */
  function bindImageClickEvents() {
    document.querySelectorAll('.image-container').forEach(box => {
      box.addEventListener('click', (e) => {
        const section = e.currentTarget.closest('.sites-section-card');
        const imgBoxes = Array.from(section.querySelectorAll('.image-container'));

        currentGalleryImages = imgBoxes.map(el => ({
          src: el.getAttribute('data-img-src'),
          caption: el.getAttribute('data-caption')
        }));

        currentImageIndex = imgBoxes.indexOf(e.currentTarget);
        openLightbox();
      });
    });
  }

  /**
   * 4. 滾動與側邊欄目錄聯動 (ScrollSpy)
   */
  function setupScrollSpy() {
    const sections = document.querySelectorAll('.sites-section-card');
    const menuItems = document.querySelectorAll('.sidebar-nav li');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('section-', '');
          menuItems.forEach(item => item.classList.remove('active'));
          
          const activeMenuItem = document.getElementById(`menu-item-${id}`);
          if (activeMenuItem) {
            activeMenuItem.classList.add('active');
            activeMenuItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  /**
   * 5. Lightbox 圖片預覽彈窗邏輯
   */
  function openLightbox() {
    updateLightboxContent();
    lightboxModal.classList.add('active');
  }

  function updateLightboxContent() {
    if (currentGalleryImages.length === 0) return;
    const current = currentGalleryImages[currentImageIndex];
    lightboxImg.src = current.src;
    lightboxCaption.textContent = `${current.caption} (${currentImageIndex + 1}/${currentGalleryImages.length})`;

    if (currentGalleryImages.length <= 1) {
      btnLightboxPrev.style.display = 'none';
      btnLightboxNext.style.display = 'none';
    } else {
      btnLightboxPrev.style.display = 'flex';
      btnLightboxNext.style.display = 'flex';
    }
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  function setupEventListeners() {
    btnLightboxClose.addEventListener('click', closeLightbox);
    btnLightboxPrev.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
      updateLightboxContent();
    });
    btnLightboxNext.addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
      updateLightboxContent();
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (lightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') btnLightboxPrev.click();
        if (e.key === 'ArrowRight') btnLightboxNext.click();
      }
    });
  }
});
