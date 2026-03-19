import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const StarField = () => {
    const { theme } = useTheme();
    const canvasRef = useRef(null);

    useEffect(() => {
        if (theme !== 'dark') return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Resize canvas to fill screen
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Star properties
        const starCount = 150;
        const stars = [];
        const colors = ['#ffffff', '#e2e8f0', '#bae6fd', '#a5f3fc'];

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1, // 1-3px
                speedX: (Math.random() - 0.5) * 0.2, // slow drift
                speedY: (Math.random() - 0.5) * 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random()
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.globalAlpha = star.opacity;
                ctx.fill();

                // Move stars
                star.x += star.speedX;
                star.y += star.speedY;

                // Wrap around edges
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Subtle twinkling
                star.opacity += (Math.random() - 0.5) * 0.02;
                if (star.opacity < 0.1) star.opacity = 0.1;
                if (star.opacity > 0.8) star.opacity = 0.8;
            });

            animationFrameId = window.requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    if (theme !== 'dark') return null;

    return (
        <canvas 
            ref={canvasRef} 
            className="star-canvas"
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                zIndex: -1, 
                background: '#050810' 
            }}
        />
    );
};

export default StarField;
