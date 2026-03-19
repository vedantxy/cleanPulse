import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const NatureBackground = () => {
    const { theme } = useTheme();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let particles = [];
        const particleCount = theme === 'dark' ? 30 : 0;

        if (theme === 'dark') {
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2,
                    angle: Math.random() * Math.PI * 2
                });
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (theme === 'dark') {
                particles.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(82, 183, 136, ${p.opacity})`;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#52B788';
                    ctx.fill();

                    // Natural floating movement
                    p.x += Math.cos(p.angle) * 0.2 + p.speedX;
                    p.y += Math.sin(p.angle) * 0.2 + p.speedY;
                    p.angle += 0.01;

                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;

                    // Subtle flickering
                    p.opacity += (Math.random() - 0.5) * 0.01;
                    if (p.opacity < 0.2) p.opacity = 0.2;
                    if (p.opacity > 0.7) p.opacity = 0.7;
                });
            }

            animationFrameId = window.requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <div className="nature-bg-overlay">
            {theme === 'light' && <div className="leaf-pattern" />}
            <div className="hero-breath" />
            <canvas 
                ref={canvasRef} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: theme === 'dark' ? 'block' : 'none' 
                }}
            />
        </div>
    );
};

export default NatureBackground;
