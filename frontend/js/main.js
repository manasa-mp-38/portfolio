/**
 * ===================================================================
 * MANASA M P - MAIN UI & GSAP CONTROLLER
 * Smooth Scroll, 3D Tilt Mechanics, Filter Tabs, Modal Bindings & Accessibility
 * ===================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================================
       1. NAVBAR STICKY & ACTIVE LINK SPY
       =================================================================== */
    const navbar = document.querySelector('.navbar-custom');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavbarScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Active Section Spy
      let currentSectionId = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    /* ===================================================================
       2. REDUCE MOTION ACCESSIBILITY TOGGLE
       =================================================================== */
    const motionToggleBtn = document.getElementById('reduce-motion-btn');
    let motionReduced = localStorage.getItem('manasa_portfolio_reduced_motion') === 'true';

    function applyMotionPreference(reduced) {
      if (reduced) {
        document.body.classList.add('reduced-motion');
        if (motionToggleBtn) {
          motionToggleBtn.innerHTML = '<i class="bi bi-play-circle me-1"></i> Enable Motion';
          motionToggleBtn.classList.add('active');
        }
        if (window.toggleReduceMotion) window.toggleReduceMotion(true);
      } else {
        document.body.classList.remove('reduced-motion');
        if (motionToggleBtn) {
          motionToggleBtn.innerHTML = '<i class="bi bi-pause-circle me-1"></i> Reduce Motion';
          motionToggleBtn.classList.remove('active');
        }
        if (window.toggleReduceMotion) window.toggleReduceMotion(false);
      }
    }

    if (motionToggleBtn) {
      applyMotionPreference(motionReduced);
      motionToggleBtn.addEventListener('click', () => {
        motionReduced = !motionReduced;
        localStorage.setItem('manasa_portfolio_reduced_motion', motionReduced);
        applyMotionPreference(motionReduced);
      });
    }

    /* ===================================================================
       3. 3D CARD MOUSE-TILT EFFECT (Vanilla CSS 3D Transforms)
       =================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-3d');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (motionReduced) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });

    /* ===================================================================
       4. SKILLS FILTER TABS
       =================================================================== */
    const filterBtns = document.querySelectorAll('.skills-filter-btn');
    const skillCards = document.querySelectorAll('.skill-interactive-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            if (!motionReduced && window.gsap) {
              gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Skill Modal Information Panel (Triggered by 3D sphere or cards)
    window.showSkillModal = function (skill) {
      document.getElementById('modal-skill-name').textContent = skill.name;
      document.getElementById('modal-skill-category').textContent = skill.category;
      document.getElementById('modal-skill-category').style.borderColor = skill.color;
      document.getElementById('modal-skill-category').style.color = skill.color;

      const descriptions = {
        "Python": "Primary language used for object-oriented programming, data science and full-stack backend development.",
        "C": "Low-level system programming foundation, memory management and algorithmic thinking.",
        "R": "Statistical data analysis, quantitative research and exploratory data visualization.",
        "SQL": "Relational database querying, schema structuring, joins, indexing and data integrity.",
        "JavaScript": "Frontend interactivity, dynamic UI rendering, DOM manipulation and REST API integration.",
        "HTML": "Semantic HTML5 web markup and accessible web structuring.",
        "CSS": "Modern CSS3 styling, flexbox, grid, glassmorphism, responsive UI and keyframe animations.",
        "Bootstrap": "Responsive layout grid system, components and mobile-first frontend styling.",
        "Pandas": "High-performance data manipulation, dataframe analysis, cleaning and transformation.",
        "NumPy": "Multi-dimensional numerical computing, array operations and mathematical analysis.",
        "Seaborn": "Statistical graphics, heatmaps, categorical plotting and advanced dataset visualization.",
        "Matplotlib": "2D and 3D plotting library for publication-quality charts and distributions.",
        "VS Code": "Primary integrated development environment with extensions and terminal integration.",
        "Turbo C": "Foundational C programming tool and compiler environment.",
        "Google Colab": "Cloud-based Jupyter notebook environment for accelerated data science experimentation.",
        "Jupyter Notebook": "Interactive computing environment for data visualization, testing and machine learning workflows.",
        "Online Learning": "Demonstrated initiative in self-directed technical education and staying current with industry technologies.",
        "Leadership Skills": "Proven ability to guide team members, organize project deliverables and drive collaborative results.",
        "Communication Skills": "Clear technical communication, documentation, cross-functional collaboration and presentation."
      };

      document.getElementById('modal-skill-desc').textContent = descriptions[skill.name] || "Technical skill utilized in software projects and academic coursework.";

      const modalEl = document.getElementById('skillInfoModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    };

    // Attach click events on static skill cards
    skillCards.forEach(card => {
      card.addEventListener('click', () => {
        const name = card.getAttribute('data-name');
        const category = card.getAttribute('data-category');
        const color = card.getAttribute('data-color') || '#00f0ff';
        window.showSkillModal({ name, category, color });
      });
    });

    /* ===================================================================
       5. GSAP ENTRANCE ANIMATIONS
       =================================================================== */
    if (window.gsap && !motionReduced) {
      gsap.from('.hero-content > *', {
        opacity: 0,
        y: 25,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

  });
})();
