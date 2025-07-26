"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const works = [
  {
    id: 1,
    title: "AI Safety Platform",
    subtitle: "AegisIntellect",
    description: "Advanced AI safety monitoring and evaluation system built with clean HTML/CSS/JavaScript, enhanced by Three.js for spatial experiences and GSAP for fluid motion.",
    category: "AI/ML",
    year: "2024",
    image: "https://source.unsplash.com/400x600/0066cc/ffffff?text=AI+Safety"
  },
  {
    id: 2,
    title: "Reinforcement Learning Agent",
    subtitle: "BUPT Research",
    description: "Multi-agent reinforcement learning environment designed for optimal performance and research applications.",
    category: "Research",
    year: "2024",
    image: "https://source.unsplash.com/400x600/cc6600/ffffff?text=RL+Agent"
  },
  {
    id: 3,
    title: "Portfolio Website",
    subtitle: "Personal Project",
    description: "Modern responsive portfolio with 3D animations and interactive design elements.",
    category: "Web Dev",
    year: "2024",
    image: "https://source.unsplash.com/400x600/cc0066/ffffff?text=Portfolio"
  },
  {
    id: 4,
    title: "LLM Safety Framework",
    subtitle: "Research Project",
    description: "Comprehensive framework for large language model safety and evaluation.",
    category: "AI Safety",
    year: "2023",
    image: "https://source.unsplash.com/400x600/66cc00/ffffff?text=LLM+Safety"
  },
  {
    id: 5,
    title: "Interactive Design System",
    subtitle: "UI/UX Project",
    description: "Complete design system with component library and interaction guidelines.",
    category: "Design",
    year: "2023",
    image: "https://source.unsplash.com/400x600/6600cc/ffffff?text=Design+System"
  }
];

export default function WorksPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{ cleanup: () => void } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initThreeScene = async () => {
      const THREE = await import('three');
      
      if (!canvasRef.current) return;

      const scene = new THREE.Scene();
      scene.background = null;

      // 设置相机 - 模仿demo.html的视角
      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
      camera.position.set(-1, -1, 15);

      // 优化渲染器设置
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current,
        antialias: true,
        precision: 'highp',
        powerPreference: 'high-performance',
        alpha: true,
      });

      renderer.setClearAlpha(0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      // 设置光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 7);
      scene.add(directionalLight);

      // 卡片配置 - 完全模仿demo.html
      const CARD_WIDTH = 3.2;
      const CARD_HEIGHT = 1.8; 
      const CARD_DEPTH = 0.01;
      const CARD_SPACING = 0.6;
      const TOTAL_CARDS = works.length;

      // 创建卡片组
      const cardsGroup = new THREE.Group();
      scene.add(cardsGroup);
      
      // 设置卡片组的位置和旋转 - 模仿demo.html
      cardsGroup.position.set(-3.8, 0, 0.1);
      cardsGroup.rotation.y = Math.PI * 0.22;
      cardsGroup.rotation.x = Math.PI * 0.09;
      cardsGroup.scale.set(0.85, 0.85, 0.85);

      const cards: any[] = [];
      const commonRotationY = Math.PI * 0.05;
      const commonRotationX = Math.PI * -0.02;

      // 创建每张卡片
      works.forEach((work, i) => {
        const geometry = new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH);
        
        // 创建材质
        const colors = [0xd73a49, 0xd73a49, 0xd73a49, 0xd73a49, 0xd73a49];
        const frontMaterial = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
        const backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0xdddddd });
        
        const materials = [
          edgeMaterial,     // 右侧
          edgeMaterial,     // 左侧
          edgeMaterial,     // 顶部
          edgeMaterial,     // 底部
          frontMaterial,    // 正面
          backMaterial      // 背面
        ];
        
        const card = new THREE.Mesh(geometry, materials);
        
        // 设置卡片位置 - 模仿demo.html的堆叠
        const zOffset = i * CARD_SPACING;
        const xOffset = i * 0.02;
        
        card.position.set(xOffset, 0, zOffset);  // 从Y=0开始，不是-10
        card.rotation.set(commonRotationX, commonRotationY, 0);
        
        // 存储卡片数据
        card.userData = {
          index: TOTAL_CARDS - 1 - i,
          origX: xOffset,
          origY: 0,
          origZ: zOffset,
          zIndex: i,
          data: work,
          originalPosition: { x: xOffset, y: 0, z: zOffset },
          originalRotation: { x: commonRotationX, y: commonRotationY, z: 0 }
        };
        
        cardsGroup.add(card);
        cards.push(card);
      });

      // 鼠标交互
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let hoveredCard: any = null;

      const onMouseMove = (event: MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cards);

        // 重置所有卡片状态
        cards.forEach(card => {
          gsap.to(card.position, {
            y: card.userData.origY,
            duration: 0.5,
            overwrite: true
          });
          
          gsap.to(card.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            overwrite: true
          });
        });

        // 处理悬停效果
        if (intersects.length > 0) {
          const newHoveredCard = intersects[0].object;
          hoveredCard = newHoveredCard;
          
          // 悬停卡片抬起 - 模仿demo.html的效果
          gsap.to(hoveredCard.position, {
            y: hoveredCard.userData.origY + 0.8,
            duration: 0.4,
            overwrite: true
          });
          
          // 悬停卡片放大
          gsap.to(hoveredCard.scale, {
            x: 1.05,
            y: 1.05,
            z: 1.05,
            duration: 0.3,
            overwrite: true
          });
          
          setHoveredCard(hoveredCard.userData.index);
          canvasRef.current!.style.cursor = 'pointer';
        } else {
          if (hoveredCard) {
            setHoveredCard(null);
          }
          hoveredCard = null;
          canvasRef.current!.style.cursor = 'default';
        }
      };

      const onMouseLeave = () => {
        if (hoveredCard) {
          setHoveredCard(null);
          hoveredCard = null;
          
          // 重置所有卡片状态
          cards.forEach(card => {
            gsap.to(card.position, {
              y: card.userData.origY,
              duration: 0.5,
              overwrite: true
            });
            
            gsap.to(card.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              overwrite: true
            });
          });
        }
      };

      canvasRef.current?.addEventListener('mousemove', onMouseMove);
      canvasRef.current?.addEventListener('mouseleave', onMouseLeave);

      // 渲染循环
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!canvasRef.current) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
      };

      window.addEventListener('resize', handleResize);

      sceneRef.current = {
        cleanup: () => {
          window.removeEventListener('resize', handleResize);
          canvasRef.current?.removeEventListener('mousemove', onMouseMove);
          canvasRef.current?.removeEventListener('mouseleave', onMouseLeave);
          renderer.dispose();
        }
      };
    };

    initThreeScene();

    return () => {
      sceneRef.current?.cleanup();
    };
  }, []);

  const handleCardHover = (cardIndex: number) => {
    setHoveredCard(cardIndex);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f2f2f2' }}>
      {/* Header */}
      <header className="relative z-50 bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-black font-bold">
              <div className="text-sm">OhMyKing's</div>
              <div className="text-lg font-black">Space</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/#whoami" className="hover:underline">WHOAMI</Link>
            <span>/</span>
            <Link href="/works" className="hover:underline text-red-500 font-bold">WORK</Link>
            <span>/</span>
            <Link href="/#contact" className="hover:underline">CONTACT</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-black rounded"></div>
            <div className="w-6 h-6 bg-black rounded"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Title Section */}
        <div className="absolute top-16 left-8 z-20">
          <h1 className="text-6xl md:text-8xl font-black mb-4 text-black">Works</h1>
          <div className="w-48 h-px bg-black mb-4"></div>
          <Link 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-black hover:underline"
          >
            to my Blog 
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Canvas Wrapper - 模仿demo.html结构 */}
        <div 
          id="canvas-wrapper" 
          className="relative w-full h-screen"
          style={{ zIndex: 1 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          />
        </div>

        {/* Preview Border - 模仿demo.html */}
        <div 
          className={`preview-border fixed right-96 top-0 w-px h-full bg-black transition-transform duration-500 ease-out ${
            hoveredCard !== null ? 'opacity-100' : 'opacity-0'
          }`} 
          style={{ zIndex: 10 }}
        ></div>

        {/* Preview Container - 模仿demo.html结构 */}
        <div 
          className={`preview-container fixed right-0 top-0 w-96 h-full bg-white transition-transform duration-500 ease-out ${
            hoveredCard !== null ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ zIndex: 15 }}
        >
          <div className="preview-wrapper h-full flex flex-col">
            {hoveredCard !== null && (
              <div className="preview-content p-8 h-full flex flex-col justify-center animate-fadeIn">
                <div className="preview-image mb-6">
                  <div className="w-full h-48 bg-gradient-to-br from-red-400 to-red-600 rounded-lg"></div>
                </div>
                <div className="preview-date text-sm text-gray-500 mb-2">
                  {works[hoveredCard].year}-06-28
                </div>
                <h2 className="preview-title text-3xl font-black mb-2 text-black">
                  {works[hoveredCard].title}
                </h2>
                <h3 className="preview-subtitle text-lg font-medium mb-4 text-gray-700">
                  {works[hoveredCard].subtitle}
                </h3>
                <p className="preview-description text-gray-600 leading-relaxed mb-6">
                  {works[hoveredCard].description}
                </p>
                <div className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                  {works[hoveredCard].category}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-8 left-8 z-20">
          <div className="text-2xl font-black mb-2 text-black">@OhMyKing</div>
          <p className="text-sm text-gray-600 max-w-md">
            Exploring the intersection of AI safety, full-stack development, and creative design.
          </p>
        </div>
      </main>
    </div>
  );
} 