'use client';

import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 180 };

    // Particle representation class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      radius: number;
      color: string;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // Super slow, elegant drifting speeds
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseRadius = Math.random() * 2 + 1;
        this.radius = this.baseRadius;
        this.color = '';
      }

      update(w: number, h: number, isDark: boolean) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > w) this.vx = -this.vx;
        if (this.y < 0 || this.y > h) this.vy = -this.vy;

        // Boundary safety checks
        if (this.x < 0) this.x = 0;
        if (this.x > w) this.x = w;
        if (this.y < 0) this.y = 0;
        if (this.y > h) this.y = h;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            // Gentle push away from mouse
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force * 0.8;
            const pushY = Math.sin(angle) * force * 0.8;

            this.x -= pushX;
            this.y -= pushY;
            // Slightly grow particle size under hover
            this.radius = this.baseRadius * (1 + force * 0.8);
          } else {
            // Smoothly recover base radius
            this.radius += (this.baseRadius - this.radius) * 0.1;
          }
        } else {
          this.radius += (this.baseRadius - this.radius) * 0.1;
        }

        // Color selection based on theme
        if (isDark) {
          // Dynamic gradient colors for dark mode: Indigo, Violet, Teal
          const randomVal = (this.x + this.y) % 3;
          if (randomVal < 1) {
            this.color = 'rgba(99, 102, 241, 0.35)'; // Indigo
          } else if (randomVal < 2) {
            this.color = 'rgba(168, 85, 247, 0.3)';  // Violet/Purple
          } else {
            this.color = 'rgba(16, 185, 129, 0.25)'; // Emerald/Teal
          }
        } else {
          // Subtle slate/indigo colors for light mode
          const randomVal = (this.x + this.y) % 2;
          if (randomVal < 1) {
            this.color = 'rgba(79, 70, 229, 0.15)'; // Light Indigo
          } else {
            this.color = 'rgba(100, 116, 139, 0.15)'; // Slate
          }
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
      }
    }

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize particles based on canvas size
    const initParticles = () => {
      particles = [];
      const density = 16000; // Pixels per particle
      const numParticles = Math.min(120, Math.floor((canvas.width * canvas.height) / density));
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Main animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear the canvas with transparent backing to allow the global background CSS to show through
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check current theme
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // Draw particle network lines
      const maxDistance = 140;
      const lineOpacityFactor = isDark ? 0.08 : 0.04;
      const lineColorHex = isDark ? '99, 102, 241' : '79, 70, 229';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width, canvas.height, isDark);
        particles[i].draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            // Closer particles have stronger/brighter lines
            const alpha = (1 - dist / maxDistance) * lineOpacityFactor;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColorHex}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw connections to the mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * (lineOpacityFactor * 2.2);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${lineColorHex}, ${alpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up resources on component unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -5,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
