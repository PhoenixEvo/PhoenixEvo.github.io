(() => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const languageToggle = document.querySelector("[data-lang-toggle]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const allSections = Array.from(document.querySelectorAll("main section[id]"));
  const navSectionIds = new Set(navLinks.map((link) => link.getAttribute("href")?.slice(1)).filter(Boolean));
  const trackedSections = allSections.reduce((items, section) => {
    const sectionId = section.id;
    const navId = navSectionIds.has(sectionId) ? sectionId : items[items.length - 1]?.navId;

    if (navId) {
      items.push({ section, navId });
    }

    return items;
  }, []);
  const newsToggle = document.querySelector("[data-news-toggle]");
  const newsList = document.getElementById("news-list");
  const awardsTbody = document.getElementById("awards-tbody");
  const paperList = document.getElementById("paper-list");
  const projectGrid = document.getElementById("project-grid");
  const galleryTrack = document.querySelector("[data-carousel-track]");
  const detailModal = document.querySelector("[data-detail-modal]");
  const detailPanel = document.querySelector(".detail-modal__panel");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxFigure = document.querySelector(".lightbox__figure");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const siteData = window.SiteData || { news: [], awards: [], details: {}, papers: [], projects: [], gallery: [] };
  const detailContent = siteData.details || {};
  let galleryItems = siteData.gallery || [];
  let newsExtras = Array.from(document.querySelectorAll(".news-extra"));
  let activeTheme = "light";
  let currentLanguage = "en";
  let activeDetailId = null;
  let activeGalleryIndex = 0;
  let activeSectionFrame = null;
  let revealObserver = null;
  let previousFocus = null;

  const translations = {
    en: {
      "skip": "Skip to main content",
      "nav.home": "Home",
      "nav.news": "News",
      "nav.about": "About",
      "nav.research": "Research",
      "nav.projects": "Projects",
      "nav.experience": "Experience",
      "nav.awards": "Awards",
      "nav.contact": "Contact",
      "nav.cv": "CV",
      "hero.eyebrow": "AI & Computer Vision Researcher",
      "hero.title": "B.Eng. Student in Information Technology, specializing in Artificial Intelligence",
      "hero.tagline": "Pursuing Computer Vision is like chasing the holy grail of perception — where optimization meets understanding.",
      "hero.link.email": "Email",
      "hero.link.personal_email": "Personal Email",
      "hero.link.university_email": "University Email",
      "hero.link.cv": "CV",
      "hero.link.github": "GitHub",
      "hero.link.linkedin": "LinkedIn",
      "hero.link.facebook": "Facebook",
      "hero.link.orcid": "ORCID",
      "news.kicker": "Updates",
      "news.heading": "News",
      "news.see_all": "See all news",
      "news.collapse": "Show less",
      "about.kicker": "Profile",
      "about.heading": "About",
      "about.p1": "I am a final-year B.Eng. Student in Information Technology at HCMC University of Technology and Engineering, concentrating in Artificial Intelligence and Computer Vision. My academic work focuses on intelligent visual systems that can analyze, reconstruct, and reason about complex visual data.",
      "about.publish_name.before": "I publish under the name",
      "about.publish_name.after": ".",
      "about.p2": "My current research spans efficient 3D reconstruction with 3D Gaussian Splatting, geometry-aware model compression, and medical image analysis. I have completed independent research on adaptive density pruning for 3DGS and university research on retinal vessel segmentation using deep learning.",
      "about.p3": "I am building a research foundation toward graduate study and international collaboration, with an interest in practical AI systems that remain rigorous, efficient, and useful in real-world scientific and clinical contexts.",
      "about.interests": "Research Interests",
      "interest.3d_reconstruction": "3D Reconstruction",
      "interest.medical_image": "Medical Image Analysis",
      "interest.retinal": "Retinal Vessel Segmentation",
      "interest.deep_learning": "Deep Learning",
      "interest.object_detection": "Object Detection",
      "interest.computer_vision": "Computer Vision",
      "research.kicker": "Selected Work",
      "research.heading": "Research",
      "research.note.before": "Author lines follow academic convention;",
      "research.note.after": "is bolded throughout.",
      "research.corresponding_note": "* corresponding author",
      "badge.rated_good": "Rated: Good",
      "link.code": "Code",
      "projects.kicker": "Technical Work",
      "projects.heading": "Projects",
      "status.research": "Research",
      "status.completed": "Completed",
      "experience.kicker": "Academic Life",
      "experience.heading": "Experience",
      "experience.exchange.type": "International Exchange",
      "experience.exchange.meta": "University of Ulsan, South Korea · January 2026",
      "experience.exchange.desc": "Inbound academic exchange focused on digital twins and AI-based industrial simulation.",
      "experience.leadership.type": "Leadership",
      "experience.leadership.title": "Youth Union Secretary",
      "experience.leadership.meta": "Class 23110FIE1, HCMUTE · 2023-Present",
      "experience.leadership.desc": "Class-level youth leadership role supporting student activities, academic communication, and community engagement.",
      "experience.volunteer.type": "Volunteer & Community",
      "experience.volunteer.title": "Campus and Social Activities",
      "experience.volunteer.desc": "Spring Volunteer Campaigns, Exam Season Support Program, and HCMUTE Running 21km completion in 2024.",
      "experience.volunteer.score": "Volunteer social work score: 99/100 for 2024-2025.",
      "awards.kicker": "Recognition",
      "awards.heading": "Awards",
      "awards.caption": "Awards and honors for Nguyen Nhat Phat",
      "awards.table.year": "Year",
      "awards.table.award": "Award",
      "awards.table.level": "Level",
      "awards.table.details": "Details",
      "skills.kicker": "Toolkit",
      "skills.heading": "Skills",
      "skills.languages": "Languages",
      "skills.ml": "ML / Deep Learning",
      "skills.cv": "Computer Vision",
      "skills.tools": "Tools & Platforms",
      "skills.web": "Database & Web",
      "skills.soft": "Languages & Soft Skills",
      "skill.vietnamese": "Vietnamese",
      "skill.english": "English",
      "skill.teamwork": "Teamwork",
      "skill.leadership": "Leadership",
      "skill.problem_solving": "Problem-Solving",
      "contact.kicker": "Get in Touch",
      "contact.heading": "Contact",
      "contact.text": "Open to research collaborations, internship opportunities, and academic discussions in AI, Computer Vision, 3D reconstruction, and medical image analysis.",
      "contact.academic_email": "Academic Email",
      "contact.personal_label": "Personal:",
      "contact.university_label": "University:",
      "details.see": "See details",
      "details.external": "External link",
      "gallery.kicker": "Certificates",
      "gallery.heading": "Certificates & Gallery",
      "footer.role": "- AI & Computer Vision Researcher",
      "footer.rights": "All rights reserved."
    },
    vi: {
      "skip": "Chuyển đến nội dung chính",
      "nav.home": "Trang chủ",
      "nav.news": "Tin tức",
      "nav.about": "Giới thiệu",
      "nav.research": "Nghiên cứu",
      "nav.projects": "Dự án",
      "nav.experience": "Kinh nghiệm",
      "nav.awards": "Giải thưởng",
      "nav.contact": "Liên hệ",
      "nav.cv": "CV",
      "hero.eyebrow": "Nhà nghiên cứu AI & Thị giác máy tính",
      "hero.title": "Sinh viên B.Eng. ngành Công nghệ thông tin, chuyên ngành Trí tuệ nhân tạo",
      "hero.tagline": "Theo đuổi Thị giác máy tính giống như tìm kiếm chén thánh của tri giác — nơi tối ưu hóa gặp gỡ sự thấu hiểu.",
      "hero.link.email": "Email",
      "hero.link.personal_email": "Email cá nhân",
      "hero.link.university_email": "Email trường",
      "hero.link.cv": "CV",
      "hero.link.github": "GitHub",
      "hero.link.linkedin": "LinkedIn",
      "hero.link.facebook": "Facebook",
      "hero.link.orcid": "ORCID",
      "news.kicker": "Cập nhật",
      "news.heading": "Tin tức",
      "news.see_all": "Xem tất cả tin tức",
      "news.collapse": "Thu gọn",
      "about.kicker": "Hồ sơ",
      "about.heading": "Giới thiệu",
      "about.p1": "Tôi là sinh viên năm cuối chương trình B.Eng. ngành Công nghệ thông tin tại HCMC University of Technology and Engineering, định hướng Trí tuệ nhân tạo và Thị giác máy tính. Công việc học thuật của tôi tập trung vào các hệ thống thị giác thông minh có khả năng phân tích, tái dựng và suy luận từ dữ liệu hình ảnh phức tạp.",
      "about.publish_name.before": "Tôi công bố học thuật dưới tên",
      "about.publish_name.after": ".",
      "about.p2": "Nghiên cứu hiện tại của tôi xoay quanh tái dựng 3D hiệu quả với 3D Gaussian Splatting, nén mô hình dựa trên hình học, và phân tích ảnh y sinh. Tôi đã hoàn thành nghiên cứu độc lập về adaptive density pruning cho 3DGS và nghiên cứu cấp trường về phân đoạn mạch máu võng mạc bằng học sâu.",
      "about.p3": "Tôi đang xây dựng nền tảng nghiên cứu hướng đến bậc sau đại học và hợp tác quốc tế, với mối quan tâm đến các hệ thống AI thực tiễn nhưng vẫn chặt chẽ, hiệu quả và hữu ích trong bối cảnh khoa học cũng như lâm sàng.",
      "about.interests": "Hướng nghiên cứu",
      "interest.3d_reconstruction": "Tái dựng 3D",
      "interest.medical_image": "Phân tích ảnh y sinh",
      "interest.retinal": "Phân đoạn mạch máu võng mạc",
      "interest.deep_learning": "Học sâu",
      "interest.object_detection": "Phát hiện đối tượng",
      "interest.computer_vision": "Thị giác máy tính",
      "research.kicker": "Công trình tiêu biểu",
      "research.heading": "Nghiên cứu",
      "research.note.before": "Dòng tác giả tuân theo quy ước học thuật;",
      "research.note.after": "được in đậm xuyên suốt.",
      "research.corresponding_note": "* tác giả liên hệ",
      "badge.rated_good": "Đánh giá: Tốt",
      "link.code": "Mã nguồn",
      "projects.kicker": "Sản phẩm kỹ thuật",
      "projects.heading": "Dự án",
      "status.research": "Nghiên cứu",
      "status.completed": "Hoàn thành",
      "experience.kicker": "Hoạt động học thuật",
      "experience.heading": "Kinh nghiệm",
      "experience.exchange.type": "Trao đổi quốc tế",
      "experience.exchange.meta": "University of Ulsan, South Korea · Tháng 01/2026",
      "experience.exchange.desc": "Chương trình trao đổi học thuật tập trung vào digital twin và mô phỏng công nghiệp dựa trên AI.",
      "experience.leadership.type": "Lãnh đạo",
      "experience.leadership.title": "Bí thư Chi đoàn",
      "experience.leadership.meta": "Lớp 23110FIE1, HCMUTE · 2023-Hiện tại",
      "experience.leadership.desc": "Vai trò lãnh đạo cấp lớp, hỗ trợ hoạt động sinh viên, truyền thông học thuật và gắn kết cộng đồng.",
      "experience.volunteer.type": "Tình nguyện & Cộng đồng",
      "experience.volunteer.title": "Hoạt động trường học và xã hội",
      "experience.volunteer.desc": "Tham gia Chiến dịch Xuân tình nguyện, chương trình Tiếp sức mùa thi và hoàn thành cự ly 21km tại HCMUTE Running 2024.",
      "experience.volunteer.score": "Điểm công tác xã hội tình nguyện: 99/100 cho năm học 2024-2025.",
      "awards.kicker": "Ghi nhận",
      "awards.heading": "Giải thưởng",
      "awards.caption": "Giải thưởng và danh hiệu của Nguyen Nhat Phat",
      "awards.table.year": "Năm",
      "awards.table.award": "Giải thưởng",
      "awards.table.level": "Cấp / Đơn vị",
      "awards.table.details": "Chi tiết",
      "skills.kicker": "Công cụ",
      "skills.heading": "Kỹ năng",
      "skills.languages": "Ngôn ngữ lập trình",
      "skills.ml": "Machine Learning / Học sâu",
      "skills.cv": "Thị giác máy tính",
      "skills.tools": "Công cụ & Nền tảng",
      "skills.web": "Cơ sở dữ liệu & Web",
      "skills.soft": "Ngôn ngữ & Kỹ năng mềm",
      "skill.vietnamese": "Tiếng Việt",
      "skill.english": "Tiếng Anh",
      "skill.teamwork": "Làm việc nhóm",
      "skill.leadership": "Lãnh đạo",
      "skill.problem_solving": "Giải quyết vấn đề",
      "contact.kicker": "Kết nối",
      "contact.heading": "Liên hệ",
      "contact.text": "Sẵn sàng trao đổi về hợp tác nghiên cứu, cơ hội thực tập và thảo luận học thuật trong AI, Thị giác máy tính, tái dựng 3D và phân tích ảnh y sinh.",
      "contact.academic_email": "Email học thuật",
      "contact.personal_label": "Cá nhân:",
      "contact.university_label": "Trường:",
      "details.see": "Xem chi tiết",
      "details.external": "Liên kết ngoài",
      "gallery.kicker": "Chứng chỉ",
      "gallery.heading": "Chứng chỉ & Thư viện ảnh",
      "footer.role": "- Nhà nghiên cứu AI & Thị giác máy tính",
      "footer.rights": "Bảo lưu mọi quyền."
    }
  };

  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const iconNameForTheme = (theme) => (theme === "dark" ? "sun" : "moon");

  const localized = (item, enKey, viKey) => (
    currentLanguage === "vi" ? item[viKey] || item[enKey] : item[enKey]
  );

  const renderNews = () => {
    if (!newsList) return;

    const expanded = newsToggle?.getAttribute("aria-expanded") === "true";
    newsList.innerHTML = "";

    siteData.news.forEach((item) => {
      const listItem = document.createElement("li");
      if (item.extra) {
        listItem.classList.add("news-extra");
        listItem.hidden = !expanded;
      }

      const time = document.createElement("time");
      time.dateTime = item.datetime;
      time.textContent = localized(item, "dateEn", "dateVi");

      const text = document.createElement("span");
      text.textContent = localized(item, "en", "vi");

      listItem.append(time, text);
      newsList.append(listItem);
    });

    newsExtras = Array.from(newsList.querySelectorAll(".news-extra"));
  };

  const attachDetailTriggers = (scope = document) => {
    scope.querySelectorAll("[data-detail-id]").forEach((trigger) => {
      if (trigger.dataset.detailBound === "true") return;
      trigger.dataset.detailBound = "true";

      trigger.addEventListener("click", (event) => {
        const detailId = event.currentTarget.dataset.detailId;
        if (detailId) {
          event.stopPropagation();
          openDetailModal(detailId);
        }
      });

      trigger.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const detailId = event.currentTarget.dataset.detailId;
        if (detailId) {
          event.preventDefault();
          openDetailModal(detailId);
        }
      });
    });
  };

  const renderAwards = () => {
    if (!awardsTbody) return;

    awardsTbody.innerHTML = "";

    siteData.awards.forEach((item) => {
      const row = document.createElement("tr");
      row.className = "award-row";
      row.dataset.detailId = item.detailId;
      row.tabIndex = 0;
      row.setAttribute("aria-haspopup", "dialog");

      const year = document.createElement("td");
      year.textContent = item.year;

      const award = document.createElement("td");
      award.textContent = localized(item, "awardEn", "awardVi");

      const level = document.createElement("td");
      level.textContent = localized(item, "levelEn", "levelVi");

      const details = document.createElement("td");
      const button = document.createElement("button");
      button.className = "detail-link";
      button.type = "button";
      button.dataset.detailId = item.detailId;
      button.dataset.i18n = "details.see";
      button.textContent = translations[currentLanguage]["details.see"];
      details.append(button);

      row.append(year, award, level, details);
      awardsTbody.append(row);
    });

    attachDetailTriggers(awardsTbody);
  };

  const renderAuthors = (authors) => {
    const fragment = document.createDocumentFragment();

    authors.forEach((author, index) => {
      if (index > 0) {
        fragment.append(document.createTextNode(", "));
      }

      const name = author.corresponding ? `${author.name}*` : author.name;
      if (author.bold) {
        const strong = document.createElement("strong");
        strong.textContent = name;
        fragment.append(strong);
      } else {
        fragment.append(document.createTextNode(name));
      }
    });

    return fragment;
  };

  const renderPapers = () => {
    if (!paperList) return;

    paperList.innerHTML = "";

    siteData.papers.forEach((item) => {
      const article = document.createElement("article");
      article.className = "paper";

      const thumb = document.createElement("a");
      thumb.className = "paper-thumb";
      thumb.href = item.links.code || item.links.pdf || "#";
      thumb.target = "_blank";
      thumb.rel = "noopener";
      thumb.setAttribute("aria-label", item.codeAriaLabel);

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.imageAlt;
      image.width = 320;
      image.height = 240;
      image.loading = "lazy";
      thumb.append(image);

      const content = document.createElement("div");
      content.className = "paper-content";

      const heading = document.createElement("h3");
      const titleLink = document.createElement("a");
      titleLink.href = item.links.code || item.links.pdf || "#";
      titleLink.target = "_blank";
      titleLink.rel = "noopener";
      titleLink.textContent = localized(item, "titleEn", "titleVi");
      heading.append(titleLink);

      const authors = document.createElement("p");
      authors.className = "authors";
      authors.append(renderAuthors(item.authors));

      const venue = document.createElement("p");
      venue.className = "venue";
      const venueText = document.createElement("span");
      venueText.textContent = localized(item, "venueEn", "venueVi");
      venue.append(venueText);

      if (item.hasBadge && item.badgeKey) {
        venue.append(document.createTextNode(" "));
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.dataset.i18n = item.badgeKey;
        badge.textContent = translations[currentLanguage][item.badgeKey];
        venue.append(badge);
      }

      const description = document.createElement("p");
      description.textContent = localized(item, "descEn", "descVi");

      const links = document.createElement("div");
      links.className = "inline-links";

      if (item.links.pdf) {
        const pdf = document.createElement("a");
        pdf.href = item.links.pdf;
        pdf.target = "_blank";
        pdf.rel = "noopener";
        pdf.textContent = "PDF";
        links.append(pdf);
      } else {
        const pdf = document.createElement("a");
        pdf.href = "#";
        pdf.className = "pdf-placeholder";
        pdf.dataset.pdfPlaceholder = "true";
        pdf.setAttribute("aria-disabled", "true");
        pdf.title = "Coming soon";
        pdf.innerHTML = '<i data-lucide="lock" aria-hidden="true"></i>PDF';
        links.append(pdf);
      }

      if (item.links.code) {
        const code = document.createElement("a");
        code.href = item.links.code;
        code.target = "_blank";
        code.rel = "noopener";
        code.dataset.i18n = "link.code";
        code.textContent = translations[currentLanguage]["link.code"];
        links.append(code);
      }

      content.append(heading, authors, venue, description, links);
      article.append(thumb, content);
      paperList.append(article);
    });

    refreshIcons();
  };

  const renderProjects = () => {
    if (!projectGrid) return;

    projectGrid.innerHTML = "";

    siteData.projects.forEach((item) => {
      const article = document.createElement("article");
      article.className = "project-card reveal";

      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.imageAlt;
      image.width = 320;
      image.height = 240;
      image.loading = "lazy";

      const body = document.createElement("div");
      body.className = "project-body";

      const meta = document.createElement("p");
      meta.className = "project-meta";
      meta.append(document.createTextNode(`${item.year} `));
      const status = document.createElement("span");
      status.className = `status ${item.status}`;
      status.dataset.i18n = `status.${item.status}`;
      status.textContent = translations[currentLanguage][`status.${item.status}`];
      meta.append(status);

      const title = document.createElement("h3");
      if (item.titleI18n) {
        title.dataset.i18n = item.titleI18n;
      }
      title.textContent = localized(item, "titleEn", "titleVi");

      const description = document.createElement("p");
      if (item.descI18n) {
        description.dataset.i18n = item.descI18n;
      }
      description.textContent = localized(item, "descEn", "descVi");

      const tags = document.createElement("div");
      tags.className = "tag-list compact";
      item.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.textContent = tag;
        tags.append(tagElement);
      });

      const link = document.createElement("a");
      link.className = "project-link";
      link.href = item.github;
      link.target = "_blank";
      link.rel = "noopener";
      link.innerHTML = '<i data-lucide="github" aria-hidden="true"></i><span data-i18n="hero.link.github">GitHub</span>';

      body.append(meta, title, description, tags, link);
      article.append(image, body);
      projectGrid.append(article);
    });

    refreshIcons();
  };

  const renderGallery = () => {
    if (!galleryTrack) return;

    galleryItems = siteData.gallery || [];
    galleryTrack.innerHTML = "";

    galleryItems.forEach((item, index) => {
      const slide = document.createElement("button");
      slide.className = "cert-carousel__slide reveal";
      slide.type = "button";
      slide.dataset.galleryIndex = String(index);

      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;
      image.width = 400;
      image.height = 280;
      image.loading = "lazy";

      const caption = document.createElement("span");
      caption.textContent = localized(item, "captionEn", "captionVi");

      slide.append(image, caption);
      galleryTrack.append(slide);
    });

    initCertCarousel();
  };

  const applyLanguage = (language) => {
    currentLanguage = language;
    root.setAttribute("lang", language);

    renderNews();
    renderAwards();
    renderPapers();
    renderProjects();
    renderGallery();

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      const value = translations[language]?.[key];
      if (value) {
        element.textContent = value;
      }
    });

    if (languageToggle) {
      const nextLanguage = language === "en" ? "vi" : "en";
      languageToggle.textContent = nextLanguage.toUpperCase();
      languageToggle.setAttribute(
        "aria-label",
        language === "en" ? "Switch to Vietnamese" : "Chuyển sang tiếng Anh"
      );
    }

    if (newsToggle) {
      const expanded = newsToggle.getAttribute("aria-expanded") === "true";
      newsToggle.textContent = expanded
        ? translations[language]["news.collapse"]
        : translations[language]["news.see_all"];
    }

    if (activeDetailId) {
      renderDetailModal(activeDetailId);
    }

    if (lightbox && !lightbox.hidden) {
      renderLightbox(activeGalleryIndex);
    }

    refreshIcons();
    setupRevealObserver();
  };

  const getFocusableElements = (container) => Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter((element) => element.offsetParent !== null || element === container);

  const renderDetailModal = (detailId) => {
    const item = detailContent[detailId];
    if (!item || !detailModal) return;

    const copy = item[currentLanguage] || item.en;
    detailModal.querySelector("[data-modal-title]").textContent = copy.title;
    detailModal.querySelector("[data-modal-org]").textContent = copy.organization;
    detailModal.querySelector("[data-modal-date]").textContent = copy.date;
    detailModal.querySelector("[data-modal-description]").textContent = copy.description;

    const gallery = detailModal.querySelector("[data-modal-gallery]");
    gallery.innerHTML = item.images.map((src, index) => (
      `<img src="${src}" alt="${copy.title} image ${index + 1}" width="400" height="300" loading="lazy">`
    )).join("");

    const tags = detailModal.querySelector("[data-modal-tags]");
    tags.innerHTML = item.tags.map((tag) => `<span>${tag}</span>`).join("");

    const external = detailModal.querySelector("[data-modal-link]");
    if (item.link) {
      external.href = item.link;
      external.hidden = false;
    } else {
      external.hidden = true;
    }
  };

  const openDetailModal = (detailId) => {
    if (!detailModal || !detailContent[detailId]) return;
    previousFocus = document.activeElement;
    activeDetailId = detailId;
    renderDetailModal(detailId);
    detailModal.hidden = false;
    document.body.classList.add("modal-open");
    window.setTimeout(() => detailPanel?.focus(), 0);
  };

  const closeDetailModal = () => {
    if (!detailModal || detailModal.hidden) return;
    detailModal.hidden = true;
    activeDetailId = null;
    document.body.classList.remove("modal-open");
    previousFocus?.focus?.();
  };

  const renderLightbox = (index) => {
    const item = galleryItems[index];
    if (!item || !lightbox) return;

    const image = lightbox.querySelector("[data-lightbox-image]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const captionText = localized(item, "captionEn", "captionVi");

    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = captionText;
  };

  const openLightbox = (index) => {
    if (!lightbox || !galleryItems[index]) return;
    previousFocus = document.activeElement;
    activeGalleryIndex = index;
    renderLightbox(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    window.setTimeout(() => lightboxFigure?.focus(), 0);
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    previousFocus?.focus?.();
  };

  const moveLightbox = (direction) => {
    const nextIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    activeGalleryIndex = nextIndex;
    renderLightbox(nextIndex);
  };

  const initCertCarousel = () => {
    const carousel = document.querySelector("[data-cert-carousel]");
    if (!carousel) return;

    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll(".cert-carousel__slide"));
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    if (!track || !slides.length || !dotsWrap) return;

    let activeIndex = 0;
    let scrollFrame = null;

    const setActiveDot = (index) => {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));
      dotsWrap.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === activeIndex);
        dot.setAttribute("aria-selected", String(dotIndex === activeIndex));
      });
    };

    const getNearestSlideIndex = () => slides.reduce((nearest, slide, index) => {
      const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
      return distance < nearest.distance ? { index, distance } : nearest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;

    const scrollToSlide = (index) => {
      const nextIndex = (index + slides.length) % slides.length;
      const behavior = reduceMotion.matches ? "auto" : "smooth";
      track.scrollTo({ left: slides[nextIndex].offsetLeft, behavior });
      setActiveDot(nextIndex);
    };

    dotsWrap.innerHTML = slides.map((_, index) => (
      `<button class="dot${index === 0 ? " active" : ""}" type="button" aria-label="Go to slide ${index + 1}" aria-selected="${index === 0 ? "true" : "false"}"></button>`
    )).join("");

    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        openLightbox(Number(slide.dataset.galleryIndex));
      });
    });

    dotsWrap.querySelectorAll("button").forEach((dot, index) => {
      dot.addEventListener("click", () => scrollToSlide(index));
    });

    if (prevButton) {
      prevButton.onclick = () => scrollToSlide(activeIndex - 1);
    }

    if (nextButton) {
      nextButton.onclick = () => scrollToSlide(activeIndex + 1);
    }

    track.onscroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        setActiveDot(getNearestSlideIndex());
      });
    };

    setActiveDot(0);
  };

  const trapFocus = (event, container) => {
    if (event.key !== "Tab" || !container) return;

    const focusable = getFocusableElements(container);
    if (!focusable.length) {
      event.preventDefault();
      container.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const applyTheme = (theme) => {
    activeTheme = theme;
    root.dataset.theme = theme;
    const videoDark = document.querySelector(".hero-video--dark");
    const videoLight = document.querySelector(".hero-video--light");

    if (activeTheme === "dark") {
      videoDark?.play().catch(() => {});
      videoLight?.pause();
    } else {
      videoLight?.play().catch(() => {});
      videoDark?.pause();
    }

    if (themeToggle) {
      const nextTheme = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
      themeToggle.innerHTML = `<i data-lucide="${iconNameForTheme(theme)}" aria-hidden="true"></i>`;
      refreshIcons();
    }
  };

  const getPreferredTheme = () => (
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  const closeNav = () => {
    if (!navToggle || !navMenu) return;
    document.body.classList.remove("nav-open");
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    navToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
    refreshIcons();
  };

  const openNav = () => {
    if (!navToggle || !navMenu) return;
    document.body.classList.add("nav-open");
    navMenu.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
    navToggle.innerHTML = '<i data-lucide="x" aria-hidden="true"></i>';
    refreshIcons();
  };

  const setScrolledState = () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 60);
    }
  };

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveSection = () => {
    if (!trackedSections.length) return;

    const headerOffset = header?.offsetHeight || 64;
    const activationPoint = window.scrollY + headerOffset + 64;
    const activeItem = trackedSections.reduce((current, item) => {
      const sectionTop = item.section.getBoundingClientRect().top + window.scrollY;
      return sectionTop <= activationPoint ? item : current;
    }, trackedSections[0]);

    setActiveLink(activeItem.navId);
  };

  const scheduleActiveSectionUpdate = () => {
    if (activeSectionFrame) return;

    activeSectionFrame = window.requestAnimationFrame(() => {
      activeSectionFrame = null;
      updateActiveSection();
    });
  };

  const setupActiveSectionObserver = () => {
    if (!trackedSections.length) return;

    updateActiveSection();
    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveSectionUpdate);
    window.addEventListener("load", scheduleActiveSectionUpdate);
  };

  const setupRevealObserver = () => {
    const revealItems = Array.from(document.querySelectorAll(".reveal"));

    if (!revealItems.length) return;

    if (revealObserver) {
      revealObserver.disconnect();
    }

    if (reduceMotion.matches) {
      revealItems.forEach((item) => item.classList.add("visible"));
      return;
    }

    revealItems.forEach((item, index) => {
      if (item.closest(".project-grid")) {
        item.style.transitionDelay = `${(index % 4) * 100}ms`;
      }
    });

    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.15
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  };

  /*
  // Disabled — replaced by Gaussian Splat renderer
  const initStarryCanvas = () => {
    const canvas = document.getElementById("starry-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve the modular simplex-noise createNoise2D from our declared exports
    const cjsExports = window.exports || (typeof exports !== "undefined" ? exports : null);
    if (!cjsExports || !cjsExports.createNoise2D) {
      console.warn("simplex-noise createNoise2D not found on exports.");
      return;
    }

    const noise2D = cjsExports.createNoise2D();

    let width = 0;
    let height = 0;
    let starsList = [];
    let particles = [];

    const colors = {
      dark: {
        blues: [
          { r: 10, g: 22, b: 40 },   // #0a1628
          { r: 13, g: 43, b: 78 },   // #0d2b4e
          { r: 26, g: 74, b: 122 },  // #1a4a7a
          { r: 46, g: 109, b: 164 }, // #2e6da4
          { r: 74, g: 144, b: 217 }  // #4a90d9
        ],
        yellows: [
          { r: 245, g: 200, b: 66 }, // #f5c842
          { r: 232, g: 160, b: 32 }, // #e8a020
          { r: 255, g: 244, b: 194 } // #fff4c2
        ]
      },
      light: {
        blues: [
          { r: 133, g: 163, b: 201 }, // washed-out blues
          { r: 169, g: 194, b: 224 },
          { r: 110, g: 133, b: 160 },
          { r: 184, g: 209, b: 242 },
          { r: 90, g: 115, b: 142 }
        ],
        yellows: [
          { r: 255, g: 248, b: 212 }, // pale gold / cream
          { r: 223, g: 186, b: 107 },
          { r: 242, g: 209, b: 128 }
        ]
      }
    };

    const starColorMap = {
      "#ffffff": { r: 255, g: 255, b: 255 },
      "#fff9d6": { r: 255, g: 249, b: 214 },
      "#c8e0ff": { r: 200, g: 224, b: 255 }
    };

    const starColors = ["#ffffff", "#fff9d6", "#c8e0ff"];

    const generateStars = () => {
      const arr = [];
      for (let i = 0; i < 80; i++) {
        arr.push({
          x: Math.random(),
          y: Math.random(),
          radius: 1 + Math.random() * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }
      return arr;
    };

    const generateParticles = () => {
      particles = [];
      const numParticles = 600;
      for (let i = 0; i < numParticles; i++) {
        const isBlue = Math.random() < 0.8;
        let darkRgb, lightRgb;
        if (isBlue) {
          const idx = Math.floor(Math.random() * colors.dark.blues.length);
          darkRgb = colors.dark.blues[idx];
          lightRgb = colors.light.blues[idx];
        } else {
          const idx = Math.floor(Math.random() * colors.dark.yellows.length);
          darkRgb = colors.dark.yellows[idx];
          lightRgb = colors.light.yellows[idx];
        }

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 0.3 + Math.random() * 0.5,
          size: 1.2 + Math.random() * 1.5,
          opacity: 0.45 + Math.random() * 0.55,
          trailLength: Math.floor(8 + Math.random() * 7),
          history: [],
          darkRgb,
          lightRgb
        });
      }
    };

    const drawStar = (star) => {
      const px = star.x * width;
      const py = star.y * height;
      const rgb = starColorMap[star.color];
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const opScale = isDark ? 0.85 : 0.25;

      // Circle 3 (outer glow)
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.15 * opScale})`;
      ctx.beginPath();
      ctx.arc(px, py, star.radius + 3, 0, Math.PI * 2);
      ctx.fill();

      // Circle 2 (inner glow)
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.4 * opScale})`;
      ctx.beginPath();
      ctx.arc(px, py, star.radius + 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Circle 1 (core)
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1.0 * opScale})`;
      ctx.beginPath();
      ctx.arc(px, py, star.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;

      starsList = generateStars();
      generateParticles();

      if (reduceMotion.matches) {
        drawStatic();
      }
    };

    let isHeroVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });

    const parent = canvas.parentElement;
    if (parent) {
      observer.observe(parent);
    }

    const drawStatic = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      canvas.style.opacity = isDark ? "0.85" : "0.25";

      ctx.clearRect(0, 0, width, height);
      starsList.forEach(drawStar);
    };

    let lastFrameTime = 0;
    const fpsInterval = 1000 / 30;

    const animate = (timestamp) => {
      if (reduceMotion.matches) {
        return;
      }

      requestAnimationFrame(animate);

      if (!isHeroVisible || document.hidden || document.visibilityState === "hidden") {
        return;
      }

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < fpsInterval) {
        return;
      }
      lastFrameTime = timestamp - (elapsed % fpsInterval);

      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      canvas.style.opacity = isDark ? "0.85" : "0.25";

      ctx.clearRect(0, 0, width, height);

      // 1. Render static stars
      starsList.forEach(drawStar);

      // 2. Render particle flow
      const noiseScale = 0.003;
      const timeOffset = timestamp * 0.00008;

      const v1 = { x: 0.25 * width, y: 0.35 * height, dir: -1 };
      const v2 = { x: 0.75 * width, y: 0.60 * height, dir: 1 };

      ctx.lineCap = "round";

      particles.forEach((p) => {
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > p.trailLength) {
          p.history.shift();
        }

        const noiseVal = noise2D(p.x * noiseScale, p.y * noiseScale + timeOffset);
        const noiseAngle = noiseVal * Math.PI * 2;

        const dx1 = p.x - v1.x;
        const dy1 = p.y - v1.y;
        const dist1 = Math.hypot(dx1, dy1) + 0.1;
        const inf1 = Math.exp(-dist1 / 180);
        const angle1 = Math.atan2(dy1, dx1) - Math.PI / 2;

        const dx2 = p.x - v2.x;
        const dy2 = p.y - v2.y;
        const dist2 = Math.hypot(dx2, dy2) + 0.1;
        const inf2 = Math.exp(-dist2 / 180);
        const angle2 = Math.atan2(dy2, dx2) + Math.PI / 2;

        let nx = Math.cos(noiseAngle);
        let ny = Math.sin(noiseAngle);

        nx += Math.cos(angle1) * inf1 * 1.5;
        ny += Math.sin(angle1) * inf1 * 1.5;

        nx += Math.cos(angle2) * inf2 * 1.5;
        ny += Math.sin(angle2) * inf2 * 1.5;

        const angle = Math.atan2(ny, nx);

        const vx = Math.cos(angle) * p.speed;
        const vy = Math.sin(angle) * p.speed;

        p.x += vx;
        p.y += vy;

        if (p.x < 0) p.x += width;
        if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        if (p.y > height) p.y -= height;

        const rgb = isDark ? p.darkRgb : p.lightRgb;
        const history = p.history;
        if (history.length >= 2) {
          for (let i = 1; i < history.length; i++) {
            const p1 = history[i - 1];
            const p2 = history[i];

            if (Math.abs(p1.x - p2.x) > width * 0.5 || Math.abs(p1.y - p2.y) > height * 0.5) {
              continue;
            }

            const opacityRatio = i / (history.length - 1);
            const op = p.opacity * opacityRatio;

            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${op})`;
            ctx.lineWidth = p.size * (0.3 + 0.7 * opacityRatio);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
    };

    const themeObserver = new MutationObserver(() => {
      if (reduceMotion.matches) {
        drawStatic();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    reduceMotion.addEventListener("change", () => {
      if (reduceMotion.matches) {
        drawStatic();
      } else {
        lastFrameTime = performance.now();
        requestAnimationFrame(animate);
      }
    });

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    resizeCanvas();

    if (!reduceMotion.matches) {
      requestAnimationFrame(animate);
    }
  };
  */

  const initStarryCanvas = () => {
    const canvas = document.getElementById("starry-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let splats = [];

    const colors = {
      blues: [
        { r: 74, g: 144, b: 217 },  // #4a90d9
        { r: 46, g: 109, b: 164 },  // #2e6da4
        { r: 26, g: 74, b: 122 },   // #1a4a7a
        { r: 107, g: 174, b: 214 }  // #6baed6
      ],
      lightBlues: [
        { r: 179, g: 212, b: 252 },
        { r: 208, g: 225, b: 253 },
        { r: 162, g: 196, b: 232 },
        { r: 225, g: 239, b: 252 }
      ],
      teals: [
        { r: 56, g: 178, b: 172 },  // #38b2ac
        { r: 77, g: 208, b: 196 },  // #4dd0c4
        { r: 44, g: 158, b: 152 }   // #2c9e98
      ],
      accents: [
        { r: 245, g: 200, b: 66 },  // #f5c842
        { r: 232, g: 160, b: 32 }   // #e8a020
      ],
      neutral: [
        { r: 200, g: 223, b: 245 }, // #c8dff5
        { r: 232, g: 244, b: 253 }  // #e8f4fd
      ]
    };

    const createSplat = (rx, ry) => {
      const r = Math.random();
      let darkColor, lightColor;
      if (r < 0.50) {
        const idx = Math.floor(Math.random() * colors.blues.length);
        darkColor = colors.blues[idx];
        lightColor = colors.lightBlues[idx];
      } else if (r < 0.75) {
        const idx = Math.floor(Math.random() * colors.teals.length);
        darkColor = lightColor = colors.teals[idx];
      } else if (r < 0.90) {
        const idx = Math.floor(Math.random() * colors.accents.length);
        darkColor = lightColor = colors.accents[idx];
      } else {
        const idx = Math.floor(Math.random() * colors.neutral.length);
        darkColor = lightColor = colors.neutral[idx];
      }

      const speed = 0.08 + Math.random() * 0.12;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const vRotation = (0.001 + Math.random() * 0.002) * (Math.random() < 0.5 ? 1 : -1);

      return {
        rx, ry,
        x: rx * width,
        y: ry * height,
        vx, vy,
        rotation: Math.random() * Math.PI * 2,
        vRotation,
        scaleX: 18 + Math.random() * 37,
        scaleY: 8 + Math.random() * 20,
        baseOpacity: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2,
        pulseAmp: 0.02 + Math.random() * 0.03,
        pulseSpeed: 0.0009 + Math.random() * 0.0007,
        darkColor,
        lightColor
      };
    };

    const updateSplatCount = () => {
      const targetCount = width > 900 ? 120 : 55;
      if (splats.length < targetCount) {
        const needed = targetCount - splats.length;
        for (let i = 0; i < needed; i++) {
          splats.push(createSplat(Math.random(), Math.random()));
        }
      } else if (splats.length > targetCount) {
        splats.length = targetCount;
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;

      updateSplatCount();

      splats.forEach((splat) => {
        splat.x = splat.rx * width;
        splat.y = splat.ry * height;
      });

      if (reduceMotion.matches) {
        drawStatic();
      }
    };

    let isHeroVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isHeroVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });

    const parent = canvas.parentElement;
    if (parent) {
      observer.observe(parent);
    }

    const drawSplat = (splat, timestamp) => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const color = isDark ? splat.darkColor : splat.lightColor;

      const minOp = isDark ? 0.06 : 0.04;
      const maxOp = isDark ? 0.18 : 0.10;
      const opacity = minOp + splat.baseOpacity * (maxOp - minOp);

      let currentOpacity = opacity + Math.sin(timestamp * splat.pulseSpeed + splat.pulsePhase) * splat.pulseAmp;
      currentOpacity = Math.max(0.01, Math.min(1.0, currentOpacity));

      ctx.save();
      ctx.translate(splat.x, splat.y);
      ctx.rotate(splat.rotation);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, splat.scaleX);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      ctx.scale(1, splat.scaleY / splat.scaleX);
      ctx.beginPath();
      ctx.arc(0, 0, splat.scaleX, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    };

    const drawStatic = () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = isDark ? "rgb(10, 14, 26)" : "rgb(245, 247, 252)";
      ctx.fillRect(0, 0, width, height);

      splats.forEach((splat) => {
        drawSplat(splat, 0);
      });
    };

    let lastFrameTime = 0;
    const fpsInterval = 1000 / 30;

    const animate = (timestamp) => {
      if (reduceMotion.matches) {
        return;
      }

      requestAnimationFrame(animate);

      if (!isHeroVisible || document.hidden || document.visibilityState === "hidden") {
        return;
      }

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < fpsInterval) {
        return;
      }
      lastFrameTime = timestamp - (elapsed % fpsInterval);

      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = isDark ? "rgba(10, 14, 26, 0.18)" : "rgba(245, 247, 252, 0.22)";
      ctx.fillRect(0, 0, width, height);

      splats.forEach((splat) => {
        splat.rotation += splat.vRotation;

        splat.x += splat.vx;
        splat.y += splat.vy;

        const limitX = splat.scaleX;
        const limitY = splat.scaleX;

        if (splat.x < -limitX) splat.x += width + limitX * 2;
        if (splat.x > width + limitX) splat.x -= width + limitX * 2;
        if (splat.y < -limitY) splat.y += height + limitY * 2;
        if (splat.y > height + limitY) splat.y -= height + limitY * 2;

        splat.rx = splat.x / width;
        splat.ry = splat.y / height;

        drawSplat(splat, timestamp);
      });
    };

    const themeObserver = new MutationObserver(() => {
      if (reduceMotion.matches) {
        drawStatic();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    reduceMotion.addEventListener("change", () => {
      if (reduceMotion.matches) {
        drawStatic();
      } else {
        lastFrameTime = performance.now();
        requestAnimationFrame(animate);
      }
    });

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    resizeCanvas();

    if (!reduceMotion.matches) {
      requestAnimationFrame(animate);
    }
  };

  applyTheme(getPreferredTheme());
  applyLanguage(currentLanguage);
  attachDetailTriggers();
  refreshIcons();
  setScrolledState();
  setupActiveSectionObserver();
  initStarryCanvas();

  window.addEventListener("scroll", setScrolledState, { passive: true });

  themeToggle?.addEventListener("click", () => {
    applyTheme(activeTheme === "dark" ? "light" : "dark");
  });

  languageToggle?.addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "vi" : "en");
  });

  newsToggle?.addEventListener("click", () => {
    const expanded = newsToggle.getAttribute("aria-expanded") === "true";
    newsExtras.forEach((item) => {
      item.hidden = expanded;
    });
    newsToggle.setAttribute("aria-expanded", String(!expanded));
    newsToggle.textContent = !expanded
      ? translations[currentLanguage]["news.collapse"]
      : translations[currentLanguage]["news.see_all"];
  });

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) {
        setActiveLink(id);
        window.setTimeout(scheduleActiveSectionUpdate, 250);
      }
      closeNav();
    });
  });

  detailModal?.querySelectorAll("[data-modal-close]").forEach((closeButton) => {
    closeButton.addEventListener("click", closeDetailModal);
  });

  lightbox?.querySelectorAll("[data-lightbox-close]").forEach((closeButton) => {
    closeButton.addEventListener("click", closeLightbox);
  });

  lightbox?.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => {
    moveLightbox(-1);
  });

  lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => {
    moveLightbox(1);
  });

  document.addEventListener("keydown", (event) => {
    if (detailModal && !detailModal.hidden) {
      trapFocus(event, detailPanel);
    }

    if (lightbox && !lightbox.hidden) {
      trapFocus(event, lightbox);
    }

    if (event.key === "Escape") {
      closeDetailModal();
      closeLightbox();
      closeNav();
    }

    if (lightbox && !lightbox.hidden && event.key === "ArrowLeft") {
      moveLightbox(-1);
    }

    if (lightbox && !lightbox.hidden && event.key === "ArrowRight") {
      moveLightbox(1);
    }
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 981px)").matches) {
      closeNav();
    }
  });

  window.addEventListener("load", refreshIcons);
})();
