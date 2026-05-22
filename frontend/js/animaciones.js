/* Traductor de Idioma 
 <!-- =========================================
         8. SCRIPTS (INTERACTIVIDAD Y ANIMACIONES)
    ========================================= -->
*/
        let currentLang = 'es';
        function switchLanguage() {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            document.getElementById('langToggleBtn').innerText = currentLang === 'es' ? 'EN' : 'ES';
            
            const elements = document.querySelectorAll(`[data-${currentLang}]`);
            elements.forEach(el => {
                el.innerHTML = el.getAttribute(`data-${currentLang}`);
            });
        }

        /* Canvas: Partículas e Interacción con Mouse */
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 40 : 90;
        
        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
        window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 - distance/800})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                if (mouse.x !== null) {
                    const mdx = particles[i].x - mouse.x;
                    const mdy = particles[i].y - mouse.y;
                    const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                    
                    if (mDist < 180) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 - mDist/450})`;
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        resizeCanvas();
        initParticles();
        animateParticles();

        /* Observadores de UI (Scroll Nav, Menú Móvil, Reveal) */
        document.addEventListener('DOMContentLoaded', () => {
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            });

            const toggle = document.querySelector('.mobile-toggle');
            const links = document.querySelector('.nav-links');
            toggle.addEventListener('click', () => links.classList.toggle('active'));

            const sections = document.querySelectorAll('section');
            const navItems = document.querySelectorAll('.nav-links a');
            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (scrollY >= (sectionTop - section.clientHeight / 3)) {
                        current = section.getAttribute('id');
                    }
                });
                navItems.forEach(li => {
                    li.classList.remove('active');
                    if (li.getAttribute('href') && li.getAttribute('href').includes(current)) {
                        li.classList.add('active');
                    }
                });
            });

            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('active');
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

            revealElements.forEach(el => revealObserver.observe(el));
        });
  