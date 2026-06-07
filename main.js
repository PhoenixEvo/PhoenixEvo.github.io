(() => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const languageToggle = document.querySelector("[data-lang-toggle]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const detailModal = document.querySelector("[data-detail-modal]");
  const detailPanel = document.querySelector(".detail-modal__panel");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxFigure = document.querySelector(".lightbox__figure");
  const galleryTriggers = Array.from(document.querySelectorAll("[data-gallery-index]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTheme = "light";
  let currentLanguage = "en";
  let activeDetailId = null;
  let activeGalleryIndex = 0;
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
      "news.kicker": "Updates",
      "news.heading": "News",
      "news.date.1": "Jan 2026",
      "news.date.2": "2026",
      "news.date.3": "2025",
      "news.date.4": "2024",
      "news.date.5": "2024",
      "news.item.1": "Participated in the BMW Digital Twin & AI-Based Industrial Simulation exchange at University of Ulsan, South Korea.",
      "news.item.2": "Completed Adaptive Density Pruning for Efficient 3D Gaussian Splatting, achieving 30% smaller model size with no quality loss.",
      "news.item.3": "Received the Advanced Youth \"Following Uncle Ho\" award at university level.",
      "news.item.4": "Completed HCMUTE student research on retinal vessel segmentation with a \"Good\" evaluation.",
      "news.item.5": "Awarded Student of Five Merits at Ho Chi Minh City level.",
      "about.kicker": "Profile",
      "about.heading": "About",
      "about.p1": "Nguyen Nhat Phat is a third-year Bachelor of Information Technology student at HCMC University of Technology and Education, concentrating in Artificial Intelligence and Computer Vision. His academic work focuses on intelligent visual systems that can analyze, reconstruct, and reason about complex visual data.",
      "about.publish_name.before": "I publish under the name",
      "about.publish_name.after": ".",
      "about.p2": "His current research spans efficient 3D reconstruction with 3D Gaussian Splatting, geometry-aware model compression, and medical image analysis. He has completed independent research on adaptive density pruning for 3DGS and university research on retinal vessel segmentation using deep learning.",
      "about.p3": "He is building a research foundation toward graduate study and international collaboration, with an interest in practical AI systems that remain rigorous, efficient, and useful in real-world scientific and clinical contexts.",
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
      "research.paper1.venue": "Independent Research · 2026",
      "research.paper1.desc": "A geometry-aware pruning method for 3D scene reconstruction models. It uses adaptive density estimation to remove spatially redundant components while preserving critical structures, producing a 30% smaller model with no quality loss across 11 scenes and two benchmarks.",
      "research.paper2.venue": "HCMUTE University Research Program · 2024",
      "research.paper2.desc": "A deep-learning approach for retinal blood vessel segmentation from medical images. The project applies convolutional neural networks and image processing to support high-resolution pixel-level medical image analysis.",
      "badge.rated_good": "Rated: Good",
      "link.code": "Code",
      "projects.kicker": "Technical Work",
      "projects.heading": "Projects",
      "projects.p1.desc": "Geometry-aware model compression for efficient 3D scene reconstruction.",
      "projects.p2.title": "Retinal Vessel Segmentation",
      "projects.p2.desc": "High-resolution retinal blood vessel segmentation using deep learning for medical imaging.",
      "projects.p3.title": "Cassava Leaf Disease Classification",
      "projects.p3.desc": "MobileNetV3 classifier with k-fold cross-validation, data augmentation, and a GUI interface.",
      "projects.p4.title": "Visual Graph Drawing Tool",
      "projects.p4.desc": "Interactive graph visualization with drag-and-drop editing, Dijkstra's algorithm, and save/load support.",
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
      "awards.advanced_youth": "Advanced Youth \"Following Uncle Ho\"",
      "awards.five_merits": "Student of Five Merits",
      "awards.good_rating": "University Research \"Good\" Rating",
      "awards.running": "HCMUTE Running - 21km Completion",
      "awards.scholarship": "Talented Student Scholarship",
      "awards.samsung": "Samsung Innovation Campus (AI Program)",
      "awards.ielts": "IELTS 6.0",
      "awards.level.university": "University Level",
      "awards.level.hcmc": "Ho Chi Minh City Level",
      "awards.level.university_short": "University",
      "awards.level.international": "International",
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
      "gallery.item.ielts": "IELTS 6.0 Certificate",
      "gallery.item.five_merits": "Student of Five Merits (HCMC)",
      "gallery.item.scholarship": "Talented Student Scholarship",
      "gallery.item.samsung": "Samsung Innovation Campus",
      "gallery.item.bmw": "BMW Program Certificate",
      "gallery.item.research": "HCMUTE Research Certificate",
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
      "news.kicker": "Cập nhật",
      "news.heading": "Tin tức",
      "news.date.1": "01/2026",
      "news.date.2": "2026",
      "news.date.3": "2025",
      "news.date.4": "2024",
      "news.date.5": "2024",
      "news.item.1": "Tham gia chương trình trao đổi BMW Digital Twin & AI-Based Industrial Simulation tại University of Ulsan, South Korea.",
      "news.item.2": "Hoàn thành nghiên cứu Adaptive Density Pruning for Efficient 3D Gaussian Splatting, giảm 30% kích thước mô hình mà không làm suy giảm chất lượng.",
      "news.item.3": "Đạt danh hiệu Thanh niên tiên tiến làm theo lời Bác cấp trường.",
      "news.item.4": "Hoàn thành đề tài nghiên cứu sinh viên tại HCMUTE về phân đoạn mạch máu võng mạc với đánh giá \"Tốt\".",
      "news.item.5": "Đạt danh hiệu Sinh viên 5 tốt cấp Thành phố Hồ Chí Minh.",
      "about.kicker": "Hồ sơ",
      "about.heading": "Giới thiệu",
      "about.p1": "Nguyen Nhat Phat là sinh viên năm ba ngành Công nghệ thông tin tại HCMC University of Technology and Education, định hướng Trí tuệ nhân tạo và Thị giác máy tính. Hướng học thuật của Phat tập trung vào các hệ thống thị giác thông minh có khả năng phân tích, tái dựng và suy luận từ dữ liệu hình ảnh phức tạp.",
      "about.publish_name.before": "Tôi công bố học thuật dưới tên",
      "about.publish_name.after": ".",
      "about.p2": "Nghiên cứu hiện tại của Phat xoay quanh tái dựng 3D hiệu quả với 3D Gaussian Splatting, nén mô hình dựa trên hình học, và phân tích ảnh y sinh. Phat đã hoàn thành nghiên cứu độc lập về adaptive density pruning cho 3DGS và nghiên cứu cấp trường về phân đoạn mạch máu võng mạc bằng học sâu.",
      "about.p3": "Phat đang xây dựng nền tảng nghiên cứu hướng đến bậc sau đại học và hợp tác quốc tế, với mối quan tâm đến các hệ thống AI thực tiễn nhưng vẫn chặt chẽ, hiệu quả và hữu ích trong bối cảnh khoa học cũng như lâm sàng.",
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
      "research.paper1.venue": "Nghiên cứu độc lập · 2026",
      "research.paper1.desc": "Một phương pháp cắt tỉa dựa trên hình học cho mô hình tái dựng cảnh 3D. Phương pháp dùng ước lượng mật độ thích nghi để loại bỏ các thành phần dư thừa về mặt không gian trong khi vẫn giữ cấu trúc quan trọng, tạo ra mô hình nhỏ hơn 30% mà không giảm chất lượng trên 11 cảnh và hai bộ benchmark.",
      "research.paper2.venue": "Chương trình Nghiên cứu Sinh viên HCMUTE · 2024",
      "research.paper2.desc": "Một hướng tiếp cận học sâu cho bài toán phân đoạn mạch máu võng mạc từ ảnh y khoa. Dự án áp dụng mạng nơ-ron tích chập và xử lý ảnh để hỗ trợ phân tích ảnh y sinh ở cấp độ pixel với độ phân giải cao.",
      "badge.rated_good": "Đánh giá: Tốt",
      "link.code": "Mã nguồn",
      "projects.kicker": "Sản phẩm kỹ thuật",
      "projects.heading": "Dự án",
      "projects.p1.desc": "Nén mô hình dựa trên hình học cho tái dựng cảnh 3D hiệu quả.",
      "projects.p2.title": "Phân đoạn mạch máu võng mạc",
      "projects.p2.desc": "Phân đoạn mạch máu võng mạc độ phân giải cao bằng học sâu cho ảnh y sinh.",
      "projects.p3.title": "Phân loại bệnh lá sắn",
      "projects.p3.desc": "Bộ phân loại MobileNetV3 với k-fold cross-validation, tăng cường dữ liệu và giao diện GUI.",
      "projects.p4.title": "Công cụ vẽ đồ thị trực quan",
      "projects.p4.desc": "Ứng dụng trực quan hóa đồ thị tương tác với kéo-thả, thuật toán Dijkstra và chức năng lưu/tải.",
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
      "awards.advanced_youth": "Thanh niên tiên tiến làm theo lời Bác",
      "awards.five_merits": "Sinh viên 5 tốt",
      "awards.good_rating": "Đề tài nghiên cứu sinh viên đạt loại \"Tốt\"",
      "awards.running": "HCMUTE Running - Hoàn thành 21km",
      "awards.scholarship": "Học bổng Sinh viên tài năng",
      "awards.samsung": "Samsung Innovation Campus (Chương trình AI)",
      "awards.ielts": "IELTS 6.0",
      "awards.level.university": "Cấp trường",
      "awards.level.hcmc": "Cấp Thành phố Hồ Chí Minh",
      "awards.level.university_short": "Cấp trường",
      "awards.level.international": "Quốc tế",
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
      "gallery.item.ielts": "Chứng chỉ IELTS 6.0",
      "gallery.item.five_merits": "Sinh viên 5 tốt cấp TP.HCM",
      "gallery.item.scholarship": "Học bổng Sinh viên tài năng",
      "gallery.item.samsung": "Samsung Innovation Campus",
      "gallery.item.bmw": "Chứng chỉ BMW Program",
      "gallery.item.research": "Chứng nhận nghiên cứu HCMUTE",
      "footer.role": "- Nhà nghiên cứu AI & Thị giác máy tính",
      "footer.rights": "Bảo lưu mọi quyền."
    }
  };

  const detailContent = {
    "bmw-program": {
      images: [
        "https://picsum.photos/seed/korea1/400/300",
        "https://picsum.photos/seed/korea2/400/300"
      ],
      tags: ["Digital Twin", "Industrial Simulation", "AI", "International Collaboration"],
      link: "https://www.ulsan.ac.kr/",
      en: {
        title: "BMW Program - Digital Twin & AI-Based Industrial Simulation",
        organization: "University of Ulsan, South Korea",
        date: "January 2026",
        description: "Participated in hands-on sessions covering Digital Twin technology and AI-based industrial simulation. Collaborated with international students from South Korea and other countries."
      },
      vi: {
        title: "BMW Program - Digital Twin & AI-Based Industrial Simulation",
        organization: "University of Ulsan, South Korea",
        date: "Tháng 01/2026",
        description: "Tham gia các buổi thực hành về công nghệ Digital Twin và mô phỏng công nghiệp dựa trên AI. Hợp tác với sinh viên quốc tế từ South Korea và các quốc gia khác."
      }
    },
    "youth-union": {
      images: ["https://picsum.photos/seed/youth-union/400/300"],
      tags: ["Leadership", "Communication", "Student Activities"],
      link: "",
      en: {
        title: "Youth Union Secretary",
        organization: "Class 23110FIE1, HCMUTE",
        date: "2023-Present",
        description: "Served as a class-level Youth Union Secretary, helping coordinate student activities, academic communication, class initiatives, and community engagement across the academic year."
      },
      vi: {
        title: "Bí thư Chi đoàn",
        organization: "Lớp 23110FIE1, HCMUTE",
        date: "2023-Hiện tại",
        description: "Đảm nhiệm vai trò Bí thư Chi đoàn cấp lớp, hỗ trợ điều phối hoạt động sinh viên, truyền thông học thuật, sáng kiến của lớp và hoạt động cộng đồng trong năm học."
      }
    },
    "volunteer-community": {
      images: ["https://picsum.photos/seed/community-volunteer/400/300"],
      tags: ["Volunteerism", "Community Service", "Teamwork"],
      link: "",
      en: {
        title: "Campus and Social Activities",
        organization: "HCMUTE",
        date: "2024-2025",
        description: "Participated in Spring Volunteer Campaigns, Exam Season Support activities, and community events. Completed 21km at HCMUTE Running 2024 and earned a 99/100 volunteer social work score."
      },
      vi: {
        title: "Hoạt động trường học và xã hội",
        organization: "HCMUTE",
        date: "2024-2025",
        description: "Tham gia Chiến dịch Xuân tình nguyện, hoạt động Tiếp sức mùa thi và các sự kiện cộng đồng. Hoàn thành cự ly 21km tại HCMUTE Running 2024 và đạt điểm công tác xã hội tình nguyện 99/100."
      }
    },
    "advanced-youth": {
      images: ["https://picsum.photos/seed/advanced-youth/400/300"],
      tags: ["Leadership", "Conduct", "Social Contribution"],
      link: "",
      en: {
        title: "Advanced Youth \"Following Uncle Ho\"",
        organization: "HCMUTE",
        date: "2024-2025",
        description: "Recognized at university level for youth development, conduct, learning attitude, leadership, and contribution to student and community activities."
      },
      vi: {
        title: "Thanh niên tiên tiến làm theo lời Bác",
        organization: "HCMUTE",
        date: "2024-2025",
        description: "Được ghi nhận cấp trường về rèn luyện thanh niên, đạo đức, tinh thần học tập, năng lực lãnh đạo và đóng góp cho hoạt động sinh viên cũng như cộng đồng."
      }
    },
    "student-five-merits": {
      images: ["https://picsum.photos/seed/award-ceremony/400/300"],
      tags: ["Academic Performance", "Conduct", "Volunteerism", "Physical Fitness"],
      link: "",
      en: {
        title: "Student of Five Merits - HCMC Level",
        organization: "Ho Chi Minh City",
        date: "2023-2024",
        description: "Awarded at Ho Chi Minh City level for outstanding academic performance, conduct, physical fitness, volunteerism, and social contribution."
      },
      vi: {
        title: "Sinh viên 5 tốt - Cấp Thành phố Hồ Chí Minh",
        organization: "Ho Chi Minh City",
        date: "2023-2024",
        description: "Được trao cấp Thành phố Hồ Chí Minh cho thành tích nổi bật về học tập, đạo đức, thể lực, tình nguyện và đóng góp xã hội."
      }
    },
    "student-five-merits-university": {
      images: ["https://picsum.photos/seed/five-merits-campus/400/300"],
      tags: ["Academic Performance", "Conduct", "Volunteerism"],
      link: "",
      en: {
        title: "Student of Five Merits - University Level",
        organization: "HCMUTE",
        date: "2023-2024",
        description: "Recognized at university level for balanced development across academic performance, ethics, volunteer activities, integration, and physical fitness."
      },
      vi: {
        title: "Sinh viên 5 tốt - Cấp trường",
        organization: "HCMUTE",
        date: "2023-2024",
        description: "Được ghi nhận cấp trường cho sự phát triển toàn diện về học tập, đạo đức, hoạt động tình nguyện, hội nhập và thể lực."
      }
    },
    "hcmute-research-good": {
      images: ["https://picsum.photos/seed/research-lab/400/300"],
      tags: ["Deep Learning", "Medical Image Analysis", "Research Defense"],
      link: "https://github.com/PhoenixEvo/retinal-vessel-segmentation",
      en: {
        title: "HCMUTE University Research - Rated Good",
        organization: "HCMUTE University Research Program",
        date: "2024",
        description: "Successfully defended the research project on retinal vessel segmentation using deep learning. Evaluated by university academic committee."
      },
      vi: {
        title: "Nghiên cứu sinh viên HCMUTE - Đánh giá Tốt",
        organization: "HCMUTE University Research Program",
        date: "2024",
        description: "Bảo vệ thành công đề tài nghiên cứu về phân đoạn mạch máu võng mạc bằng học sâu. Đề tài được hội đồng học thuật cấp trường đánh giá."
      }
    },
    "hcmute-running": {
      images: ["https://picsum.photos/seed/running-21k/400/300"],
      tags: ["Discipline", "Endurance", "Campus Activity"],
      link: "",
      en: {
        title: "HCMUTE Running - 21km Completion",
        organization: "HCMUTE",
        date: "2024",
        description: "Completed the 21km community running event at HCMUTE, reflecting consistency, discipline, and commitment to student life beyond academics."
      },
      vi: {
        title: "HCMUTE Running - Hoàn thành 21km",
        organization: "HCMUTE",
        date: "2024",
        description: "Hoàn thành sự kiện chạy cộng đồng cự ly 21km tại HCMUTE, thể hiện sự bền bỉ, kỷ luật và tinh thần tham gia đời sống sinh viên ngoài học thuật."
      }
    },
    "talented-scholarship": {
      images: ["https://picsum.photos/seed/scholarship-detail/400/300"],
      tags: ["Scholarship", "Academic Merit", "Recognition"],
      link: "",
      en: {
        title: "Talented Student Scholarship",
        organization: "HCMUTE",
        date: "Academic recognition",
        description: "Received scholarship recognition from HCMUTE for academic potential, learning effort, and contribution to the university community."
      },
      vi: {
        title: "Học bổng Sinh viên tài năng",
        organization: "HCMUTE",
        date: "Ghi nhận học thuật",
        description: "Nhận học bổng từ HCMUTE cho tiềm năng học thuật, nỗ lực học tập và đóng góp cho cộng đồng đại học."
      }
    },
    "samsung-campus": {
      images: ["https://picsum.photos/seed/samsung-campus-detail/400/300"],
      tags: ["AI Program", "Technology", "Training"],
      link: "",
      en: {
        title: "Samsung Innovation Campus (AI Program)",
        organization: "Samsung",
        date: "Certificate program",
        description: "Completed AI-oriented learning through Samsung Innovation Campus, strengthening foundations in modern technology, applied AI concepts, and practical problem solving."
      },
      vi: {
        title: "Samsung Innovation Campus (Chương trình AI)",
        organization: "Samsung",
        date: "Chương trình chứng chỉ",
        description: "Hoàn thành chương trình học định hướng AI tại Samsung Innovation Campus, củng cố nền tảng công nghệ hiện đại, khái niệm AI ứng dụng và giải quyết vấn đề thực tế."
      }
    },
    "ielts": {
      images: ["https://picsum.photos/seed/ielts-detail/400/300"],
      tags: ["English", "Academic Communication", "IELTS 6.0"],
      link: "",
      en: {
        title: "IELTS 6.0",
        organization: "International English Certification",
        date: "Certificate",
        description: "Achieved IELTS 6.0, supporting academic communication, English research reading, and participation in international learning environments."
      },
      vi: {
        title: "IELTS 6.0",
        organization: "Chứng chỉ tiếng Anh quốc tế",
        date: "Chứng chỉ",
        description: "Đạt IELTS 6.0, hỗ trợ giao tiếp học thuật, đọc tài liệu nghiên cứu tiếng Anh và tham gia môi trường học tập quốc tế."
      }
    }
  };

  const galleryItems = [
    {
      src: "https://picsum.photos/seed/ielts-cert/400/280",
      captionKey: "gallery.item.ielts",
      alt: "IELTS 6.0 Certificate"
    },
    {
      src: "https://picsum.photos/seed/certificate-1/400/280",
      captionKey: "gallery.item.five_merits",
      alt: "Student of Five Merits certificate"
    },
    {
      src: "https://picsum.photos/seed/scholarship/400/280",
      captionKey: "gallery.item.scholarship",
      alt: "Talented Student Scholarship"
    },
    {
      src: "https://picsum.photos/seed/samsung-cert/400/280",
      captionKey: "gallery.item.samsung",
      alt: "Samsung Innovation Campus"
    },
    {
      src: "https://picsum.photos/seed/bmw-cert/400/280",
      captionKey: "gallery.item.bmw",
      alt: "BMW Program Certificate"
    },
    {
      src: "https://picsum.photos/seed/research-cert/400/280",
      captionKey: "gallery.item.research",
      alt: "HCMUTE Research Certificate"
    }
  ];

  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const iconNameForTheme = (theme) => (theme === "dark" ? "sun" : "moon");

  const applyLanguage = (language) => {
    currentLanguage = language;
    root.setAttribute("lang", language);

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

    if (activeDetailId) {
      renderDetailModal(activeDetailId);
    }

    if (lightbox && !lightbox.hidden) {
      renderLightbox(activeGalleryIndex);
    }
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
    const captionText = translations[currentLanguage]?.[item.captionKey] || translations.en[item.captionKey];

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
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const setupActiveSectionObserver = () => {
    if (!sections.length || reduceMotion.matches) return;

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        setActiveLink(visible.target.id);
      }
    }, {
      rootMargin: "-35% 0px -50% 0px",
      threshold: [0.12, 0.3, 0.6]
    });

    sections.forEach((section) => sectionObserver.observe(section));
  };

  const setupRevealObserver = () => {
    const revealItems = Array.from(document.querySelectorAll(".reveal"));

    if (!revealItems.length) return;

    if (reduceMotion.matches) {
      revealItems.forEach((item) => item.classList.add("visible"));
      return;
    }

    revealItems.forEach((item, index) => {
      if (item.closest(".project-grid")) {
        item.style.transitionDelay = `${(index % 4) * 100}ms`;
      }
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
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

  applyTheme(getPreferredTheme());
  applyLanguage(currentLanguage);
  refreshIcons();
  setScrolledState();
  setupRevealObserver();
  setupActiveSectionObserver();

  window.addEventListener("scroll", setScrolledState, { passive: true });

  themeToggle?.addEventListener("click", () => {
    applyTheme(activeTheme === "dark" ? "light" : "dark");
  });

  languageToggle?.addEventListener("click", () => {
    applyLanguage(currentLanguage === "en" ? "vi" : "en");
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
    link.addEventListener("click", closeNav);
  });

  document.querySelectorAll("[data-detail-id]").forEach((trigger) => {
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

  detailModal?.querySelectorAll("[data-modal-close]").forEach((closeButton) => {
    closeButton.addEventListener("click", closeDetailModal);
  });

  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox(Number(trigger.dataset.galleryIndex));
    });
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
