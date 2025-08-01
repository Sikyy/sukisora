"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

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

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{ cleanup: () => void } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 产品轮播图片数据
  const productImages = [
    { id: 1, name: "Front View" },
    { id: 2, name: "Angle View" },
    { id: 3, name: "Top View" }
  ];

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
    const carousel = document.querySelector('.product-gallery__carousel');
    if (carousel) {
      const slideWidth = carousel.scrollWidth / productImages.length;
      carousel.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initThreeScene = async () => {
      const THREE = await import('three');
      
      if (!canvasRef.current) return;

      const scene = new THREE.Scene();
      scene.background = null;

      // 设置相机
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

      // 卡片配置
      const CARD_WIDTH = 3.2;
      const CARD_HEIGHT = 1.8; 
      const CARD_DEPTH = 0.01;
      const CARD_SPACING = 0.6;
      const TOTAL_CARDS = works.length;

      // 创建卡片组
      const cardsGroup = new THREE.Group();
      scene.add(cardsGroup);
      
      // 设置卡片组的位置和旋转
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
        
        // 设置卡片位置
        const zOffset = i * CARD_SPACING;
        const xOffset = i * 0.02;
        
        card.position.set(xOffset, 0, zOffset);
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
          
          // 悬停卡片抬起
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

    // 简化初始化逻辑 - 直接在组件挂载时初始化
    const timeoutId = setTimeout(() => {
      if (canvasRef.current && !sceneRef.current) {
        initThreeScene();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      sceneRef.current?.cleanup();
    };
  }, []);

  // 轮播功能的独立useEffect
  useEffect(() => {
    const handleCarouselScroll = () => {
      const carousel = document.querySelector('.product-gallery__carousel');
      if (carousel) {
        const slideWidth = carousel.scrollWidth / productImages.length;
        const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
        setCurrentSlide(currentIndex);
      }
    };

    const carousel = document.querySelector('.product-gallery__carousel');
    if (carousel) {
      carousel.addEventListener('scroll', handleCarouselScroll);
      
      return () => {
        carousel.removeEventListener('scroll', handleCarouselScroll);
      };
    }
  }, [productImages.length]);

  return (
    <div className="min-h-screen text-black overflow-hidden scroll-smooth">
      {/* Fixed Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 ohmyking-red">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="text-black font-bold">
              <div className="text-2xl font-black">Sukisora</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-lg font-medium">
            <a href="#whoami" className="hover:underline transition-colors">WHOAMI</a>
            <span>/</span>
            <a href="#products" className="hover:underline transition-colors">PRODUCTS</a>
            <span>/</span>
            <a href="#works" className="hover:underline transition-colors">WORK</a>
            <span>/</span>
            <a href="#contact" className="hover:underline transition-colors">CONTACT</a>
          </nav>

          <div className="text-lg font-medium">中文</div>
        </div>
      </header>

      {/* Page 1: Hero Section */}
      <section className="min-h-screen ohmyking-red relative flex items-center pt-20">
        {/* Large Typography Section with Black Diagonal */}
        <div className="relative w-full py-8">
          {/* Black diagonal sections */}
          <div className="absolute top-0 left-0 w-full h-32 bg-black transform skew-y-1"></div>
          <div className="absolute bottom-0 right-0 w-4/5 h-24 bg-black transform -skew-y-2"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[400px]">
              {/* Left side - Large Overlapping Typography */}
              <div className="relative overlapping-text pt-16">
                <div className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight space-y-0">
                  <div className="relative">
                    <span className="text-black">Learner</span>
                  </div>
                  <div className="relative -mt-4">
                    <span className="text-black">Developer</span>
                  </div>
                  <div className="relative -mt-4">
                    <span className="text-black">Designer</span>
                  </div>
                  <div className="relative -mt-4">
                    <span className="text-black">Creator</span>
                  </div>
                  <div className="relative -mt-4">
                    <span className="text-black opacity-70">Learner</span>
                  </div>
                </div>

                {/* Overlapping background text */}
                <div className="absolute top-20 left-8 text-6xl md:text-8xl font-black text-black opacity-20 select-none">
                  <div>Learner</div>
                  <div>Developer</div>
                  <div>Designer</div>
                  <div>Creator</div>
                  <div>Learner</div>
                </div>
              </div>

              {/* Right side - Main Branding */}
              <div className="text-right pt-8">
                <div className="text-white">
                  <div className="text-6xl md:text-8xl lg:text-9xl font-black">Sukisora</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page 2: WHOAMI Section */}
      <section id="whoami" className="min-h-screen ohmyking-red flex items-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-6xl md:text-8xl font-black mb-8">OhMyKing</h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-6">
              BUPT student specializing in Agents Reinforcement Learning and LLM Safety
            </p>
            <p className="text-lg leading-relaxed max-w-4xl mx-auto">
              Communist Party member. Full-stack developer committed to advancing Artificial General Intelligence.
              Co-founding AegisIntellect to advance AI safety technologies. Devoted to comprehensive excellence
              and unwavering humanistic values. Passionate about all forms of beauty.
            </p>
          </div>

          {/* Three Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {/* A Learner */}
            <div className="text-center">
              <h3 className="text-3xl font-black mb-4">A Learner</h3>
              <div className="mb-4 math-formula">
                <div className="text-lg font-mono mb-1">f(x) = 0</div>
                <div className="text-sm font-mono mb-2">x<sub>k+1</sub> = x<sub>k</sub> - f(x<sub>k</sub>)</div>
                <div className="text-xs font-bold tracking-wider mb-3">GRADIENT DESCENT</div>
                <div className="text-sm font-mono mb-1">min f(x)</div>
                <div className="text-sm font-mono mb-2">s.t. g(x) ≤ 0</div>
                <div className="text-xs font-bold tracking-wider mb-3">CONSTRAINED OPTIMIZATION</div>
                <div className="text-sm font-mono mb-1">f(x) ≥ 0</div>
                <div className="text-xs font-bold tracking-wider mb-3">CONVEXITY CONDITION</div>
              </div>
              <a href="#" className="inline-block bg-black px-4 py-2 text-sm font-bold hover:bg-gray-800" style={{color: '#eb2c3c'}}>
                to my Blog
              </a>
            </div>

            {/* A Designer */}
            <div className="text-center">
              <h3 className="text-3xl font-black mb-4">A Designer</h3>
              <div className="mb-4">
                <p className="text-sm">Know a little about</p>
                <p className="text-sm font-medium">Interaction design,</p>
                <p className="text-sm font-medium">Graphic design,</p>
                <p className="text-sm font-medium">3D design,</p>
              </div>
              <a href="#" className="inline-block bg-black px-4 py-2 text-sm font-bold hover:bg-gray-800" style={{color: '#eb2c3c'}}>
                to my Blog
              </a>
              <div className="mt-4 text-sm font-bold">Beauty is Purpose</div>
            </div>

            {/* A Developer */}
            <div className="text-center">
              <h3 className="text-3xl font-black mb-4">A Developer</h3>
              <div className="mb-4">
                <div className="text-sm font-bold">Creation is Vitality.</div>
              </div>
              <a href="#works" className="inline-block bg-black px-4 py-2 text-sm font-bold hover:bg-gray-800" style={{color: '#eb2c3c'}}>
                View My Works
              </a>
              <div className="mt-4 text-sm font-bold">Works</div>
            </div>
          </div>
        </div>
      </section>

      {/* Page 3: Product Showcase Section */}
      <section id="products" className="min-h-screen bg-white text-black py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="product grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left side - Product Gallery */}
            <div className="product-gallery">
              <div className="product-gallery__image-list">
                <div className="relative">
                  {/* Main carousel */}
                  <div className="product-gallery__carousel scroll-area overflow-x-auto snap-x snap-mandatory">
                    <div className="flex space-x-0">
                      {/* Image 1 */}
                      <div className="product-gallery__media snap-center flex-none w-full">
                        <div className="aspect-square relative">
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden">
                            {/* Simple product simulation without background frame */}
                            <div className="absolute inset-12 bg-black rounded shadow-lg"></div>
                            <div className="absolute bottom-20 left-20 w-6 h-4 bg-gray-800 rounded-sm shadow"></div>
                            <div className="absolute top-12 right-12 opacity-20">
                              <div className="text-black font-light text-sm">SK</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Image 2 */}
                      <div className="product-gallery__media snap-center flex-none w-full">
                        <div className="aspect-square relative">
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 relative overflow-hidden">
                            <div className="absolute inset-10 bg-black rounded transform rotate-6 shadow-xl"></div>
                            <div className="absolute top-1/2 left-1/2 w-5 h-3 bg-gray-800 rounded-sm transform -translate-x-1/2 -translate-y-1/2 rotate-6"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Image 3 */}
                      <div className="product-gallery__media snap-center flex-none w-full">
                        <div className="aspect-square relative">
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-250 relative overflow-hidden">
                            <div className="absolute inset-16 bg-black rounded"></div>
                            <div className="absolute bottom-20 right-20 w-8 h-5 bg-gray-900 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zoom button */}
                  <button className="product-zoom-button absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow border border-gray-100 hover:bg-gray-50 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 15 15" className="text-gray-500">
                      <path d="M7 0L7 7H0V8H7V15H8V8L15 8V7L8 7L8 0H7Z" fill="currentColor"></path>
                    </svg>
                    <span className="sr-only">Zoom</span>
                  </button>
                </div>

                {/* Carousel Navigation Dots */}
                <div className="product-gallery__controls-floating mt-4">
                  <div className="flex justify-center space-x-1.5">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToSlide(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          currentSlide === index ? 'bg-black' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Product Info (Sticky) */}
            <div className="product-info lg:sticky lg:top-16">
              <div className="product-info__block-list space-y-6">
                
                {/* Product Title */}
                <div className="product-info__block-item">
                  <h2 className="product-title text-2xl lg:text-3xl font-normal tracking-tight text-black">
                    SK-001 (BLACK)
                  </h2>
                </div>

                {/* Price */}
                <div className="product-info__block-item">
                  <div className="price-list">
                    <span className="text-xl font-normal">¥199.00</span>
                  </div>
                </div>

                {/* Product Description */}
                <div className="product-info__block-item">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-sm mb-4">
                      The SK-001 (Sukisora 001) provides an unparalleled development experience designed for 
                      high accuracy coding, combined with a premium build quality for a full performance 
                      optimization.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      The precision engineering is micro-crafted for a unique user experience and optimized 
                      for workflow efficiency to achieve the same structure and durability of professional 
                      development tools also known as productivity enhancers.
                    </p>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="product-info__block-item">
                  <button className="button w-full bg-black text-white py-3 px-6 font-normal text-sm tracking-wide hover:bg-gray-900 transition-colors duration-200">
                    ADD TO CART
                  </button>
                </div>

                {/* Icons with Text - Features */}
                <div className="product-info__block-item">
                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="text-black mt-1 text-xs">→</span>
                      <span className="text-xs font-normal text-gray-700 tracking-wide uppercase">PREMIUM DEVELOPMENT TOOLS</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-black mt-1 text-xs">→</span>
                      <span className="text-xs font-normal text-gray-700 tracking-wide uppercase">ULTRA HIGH PRECISION FOR COMPETITIVE CODING</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-black mt-1 text-xs">→</span>
                      <span className="text-xs font-normal text-gray-700 tracking-wide uppercase">OPTIMIZED WORKFLOW FOR TIMELESS CONSISTENCY</span>
                    </div>
                  </div>
                </div>

                {/* Large Product Image */}
                <div className="product-info__block-item mt-8">
                  <div className="constrained-image">
                    <div className="w-full h-32 bg-gradient-to-r from-gray-100 to-gray-300 relative overflow-hidden">
                      {/* Simulating angled mousepad view */}
                      <div className="absolute inset-3 bg-black rounded transform -rotate-1 shadow-lg"></div>
                      <div className="absolute top-1/2 right-6 w-6 h-4 bg-gray-700 rounded-sm transform -translate-y-1/2 -rotate-1 shadow"></div>
                      <div className="absolute bottom-3 left-3 opacity-30">
                        <div className="text-black font-light text-xs transform -rotate-1">SUKISORA</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Page 4: Works Section */}
      <section id="works" className="min-h-screen text-black relative" style={{ backgroundColor: '#f2f2f2' }}>
        {/* Title Section */}
        <div className="absolute top-20 left-8 z-20 pt-20">
          <h1 className="text-6xl md:text-8xl font-black mb-4 text-black">Works</h1>
          <div className="w-48 h-px bg-black mb-4"></div>
          <a 
            href="/blog" 
            className="inline-flex items-center text-sm font-medium text-black hover:underline"
          >
            to my Blog 
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Canvas Wrapper - 始终渲染但初始化延迟到可见时 */}
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

        {/* Preview Border */}
        <div 
          className={`preview-border fixed right-96 top-0 w-px h-full bg-black transition-transform duration-500 ease-out ${
            hoveredCard !== null ? 'opacity-100' : 'opacity-0'
          }`} 
          style={{ zIndex: 10 }}
        ></div>

        {/* Preview Container */}
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen bg-black text-white py-16">
        <div className="container mx-auto px-4 h-full min-h-screen flex flex-col justify-center">
          {/* Top section with title and contact info */}
          <div className="text-center mb-16">
            <div className="text-sm text-gray-400 mb-4">联系</div>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8">Sukisora</h2>
            <div className="space-y-2 text-lg">
              <div>quarkwang@bupt.edu.cn</div>
              <div>+86 18310619188</div>
              <div className="text-gray-400">北京邮电大学</div>
              <div className="text-gray-400">北京市海淀区西土城路10号</div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Company info and social links */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Sukisora</h3>
                <div className="space-y-2 text-gray-300">
                  <div>quarkwang@bupt.edu.cn</div>
                  <div>+86 18310619188</div>
                  <div>北京邮电大学</div>
                  <div>北京市海淀区西土城路10号</div>
                </div>
              </div>

              {/* Navigation links */}
              <div className="space-y-2">
                <a href="#works" className="block text-white hover:text-gray-300 transition-colors">作品集</a>
                <a href="#whoami" className="block text-white hover:text-gray-300 transition-colors">个人介绍</a>
                <a href="#contact" className="block text-red-400 font-medium">联系我们</a>
              </div>

              {/* Social media icons */}
              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                  <span className="text-sm font-bold">W</span>
                </a>
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                  <span className="text-sm font-bold">G</span>
                </a>
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
                  <span className="text-sm font-bold">T</span>
                </a>
              </div>
            </div>

            {/* Right side - Contact form */}
            <div className="bg-white rounded-2xl p-8 text-black">
              <h3 className="text-xl font-bold mb-6">准备好合作了吗？</h3>
              
              <form className="space-y-6">
                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">名 *</label>
                    <input 
                      type="text" 
                      placeholder="John"
                      className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">姓 *</label>
                    <input 
                      type="text" 
                      placeholder="Smith"
                      className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium mb-2">电子邮件 *</label>
                  <input 
                    type="email" 
                    placeholder="hello@example.com"
                    className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none"
                  />
                </div>

                {/* Message field */}
                <div>
                  <label className="block text-sm font-medium mb-2">信息 *</label>
                  <textarea 
                    rows={4}
                    placeholder="Type your message here"
                    className="w-full border-b-2 border-gray-300 bg-transparent py-2 resize-none focus:border-black focus:outline-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    提交
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="#" className="hover:text-white transition-colors">隐私政策</a>
                <a href="#" className="hover:text-white transition-colors">服务条款</a>
                <a href="#" className="hover:text-white transition-colors">退款政策</a>
              </div>
              <div>© 2024 by Sukisora™</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
  