import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/hooks/useTheme';

const logoTexture = new THREE.TextureLoader().load('/aspiria_profile.png');

interface Robot3DProps {
  isDark: boolean;
  onPoke: () => void;
  isGreeting: boolean;
}

const Robot3D = ({ isDark, onPoke, isGreeting }: Robot3DProps) => {
  const { clock } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  
  // Visor face features
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  const globalMouseRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const clickTimeRef = useRef(-10); // Start far in the past
  const lastMouseMoveTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize client coordinates to [-1, 1] relative to the window
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      globalMouseRef.current = { x, y };
      lastMouseMoveTimeRef.current = Date.now();
    };

    const handleMouseLeave = () => {
      // Centered default when mouse leaves the page
      globalMouseRef.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useFrame((state) => {
    const time = clock.getElapsedTime();
    const timeSinceClick = time - clickTimeRef.current;
    const isClicked = timeSinceClick < 1.5; // Happy reaction lasts 1.5 seconds

    // Sleepy state if mouse hasn't moved for 10 seconds
    const isSleepy = (Date.now() - lastMouseMoveTimeRef.current) > 10000 && !isClicked && !isHoveredRef.current;

    // Floating breathing animation for the entire robot
    if (groupRef.current) {
      const floatSpeed = isClicked ? 3.5 : (isSleepy ? 0.7 : 1.5);
      const floatAmplitude = isClicked ? 0.22 : (isSleepy ? 0.05 : 0.15);
      groupRef.current.position.y = Math.sin(time * floatSpeed) * floatAmplitude - 0.2;
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
    }

    // Head tracking and active expressions wiggling
    if (headRef.current) {
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;

      if (isSleepy) {
        // Sleepy head droop
        targetX = 0.22;
        targetY = 0.0;
      } else {
        // Track mouse coords
        targetX = -globalMouseRef.current.y * 0.35; // Look up/down
        targetY = globalMouseRef.current.x * 0.65;  // Look left/right
      }

      let lerpSpeed = 0.08;
      if (isClicked) {
        // Happy wiggle rotation
        const wiggleProgress = timeSinceClick / 1.5;
        targetZ = Math.sin(timeSinceClick * 22) * 0.12 * (1 - wiggleProgress);
        targetX += Math.sin(timeSinceClick * 12) * 0.08 * (1 - wiggleProgress);
        lerpSpeed = 0.15; // Track faster during click
      }

      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetX, lerpSpeed);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, lerpSpeed);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetZ, lerpSpeed);
    }

    // Eye parallax shifting (offsetting pupils inside the visor viewport)
    let eyeOffsetX = 0;
    let eyeOffsetY = 0;
    if (!isSleepy) {
      eyeOffsetX = globalMouseRef.current.x * 0.035;
      eyeOffsetY = globalMouseRef.current.y * 0.025;
    }

    // Target scales, rotation, positions
    let targetLeftEyeScaleX = 1.0;
    let targetLeftEyeScaleY = 1.0;
    let targetRightEyeScaleX = 1.0;
    let targetRightEyeScaleY = 1.0;

    let targetColor = new THREE.Color(eyeColor);

    // Expressions State Machine inside useFrame
    if (isClicked) {
      // HAPPY EXCITED: Wink (left closed, right happy curved squint), gold color
      targetColor.set(brandGold);

      targetLeftEyeScaleX = 0.8;
      targetLeftEyeScaleY = 0.05; // Closed wink

      targetRightEyeScaleX = 1.4;
      targetRightEyeScaleY = 0.35; // Squint
    } else if (isSleepy) {
      // SLEEPY: Closed horizontal slits, indigo color
      targetColor.set("#6366f1");

      targetLeftEyeScaleX = 0.8;
      targetLeftEyeScaleY = 0.05;
      targetRightEyeScaleX = 0.8;
      targetRightEyeScaleY = 0.05;
    } else if (isHoveredRef.current) {
      // HOVERED / INTERESTED: Wider eyes, cyan color
      targetColor.set("#06b6d4");

      targetLeftEyeScaleX = 1.15;
      targetLeftEyeScaleY = 1.15;
      targetRightEyeScaleX = 1.15;
      targetRightEyeScaleY = 1.15;
    } else {
      // IDLE: Standard circular eyes
      targetColor.set(eyeColor);

      // Periodic blink timer (every 4 seconds)
      const blinkTimer = time % 4.0;
      let blinkScaleY = 1.0;
      if (blinkTimer > 3.8) {
        const progress = (blinkTimer - 3.8) / 0.2;
        blinkScaleY = Math.abs(Math.cos(progress * Math.PI)) * 0.95 + 0.05;
      }

      // Breathing glow pulse
      const eyePulse = Math.sin(time * 3) * 0.05 + 1.0;

      targetLeftEyeScaleX = eyePulse;
      targetLeftEyeScaleY = blinkScaleY * eyePulse;
      targetRightEyeScaleX = eyePulse;
      targetRightEyeScaleY = blinkScaleY * eyePulse;
    }

    // Right arm waving animation
    const shouldWave = isGreeting || isClicked;
    let targetRightArmRotX = -0.2;
    let targetRightArmRotY = -0.1;
    let targetRightArmRotZ = -0.12;

    if (shouldWave) {
      targetRightArmRotX = -0.6; // Tilt arm forward
      targetRightArmRotY = 0.0;
      // Wave from middle/horizontal (Z = 1.6) to upwards towards shoulder/head (Z = 2.5)
      targetRightArmRotZ = 2.05 + Math.sin(time * 16) * 0.45;
    }

    // Smoothly interpolate all face elements
    const lerpFactor = 0.12;

    // Apply eye scales & positions
    if (leftEyeRef.current) {
      leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, -0.14 + eyeOffsetX, lerpFactor);
      leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, 0.02 + eyeOffsetY, lerpFactor);
      leftEyeRef.current.scale.x = THREE.MathUtils.lerp(leftEyeRef.current.scale.x, targetLeftEyeScaleX, lerpFactor);
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, targetLeftEyeScaleY, lerpFactor);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, 0.14 + eyeOffsetX, lerpFactor);
      rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, 0.02 + eyeOffsetY, lerpFactor);
      rightEyeRef.current.scale.x = THREE.MathUtils.lerp(rightEyeRef.current.scale.x, targetRightEyeScaleX, lerpFactor);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, targetRightEyeScaleY, lerpFactor);
    }

    // Apply right arm waving
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRightArmRotX, lerpFactor);
      rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, targetRightArmRotY, lerpFactor);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetRightArmRotZ, lerpFactor);
    }

    // Lerp colors on all visor elements
    const elements = [leftEyeRef, rightEyeRef];
    elements.forEach((ref) => {
      if (ref.current) {
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.color.lerp(targetColor, lerpFactor);
        }
      }
    });
  });

  // Theme-specific and brand-harmonized colors matching Aspiria logo!
  const bodyColor = "#ffffff"; // Pure white body in both light and dark modes
  const brandBlue = "#2563eb"; // Royal Blue
  const brandGold = "#f59e0b"; // Gold/Orange
  const jointColor = brandBlue; // Royal Blue joints/shoulders
  const screenColor = "#0f172a"; // Dark screen
  const eyeColor = "#3b82f6"; // Bright blue eyes

  // Glossy lacquered plastic settings
  const bodyRoughness = isDark ? 0.1 : 0.15;
  const bodyMetalness = 0.1;

  return (
    <group 
      ref={groupRef} 
      position={[0, -0.2, 0]} 
      scale={[1.8, 1.8, 1.8]}
      onPointerEnter={(e) => {
        e.stopPropagation();
        isHoveredRef.current = true;
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        isHoveredRef.current = false;
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        clickTimeRef.current = clock.getElapsedTime();
        onPoke();
      }}
    >
      {/* ROBOT HEAD */}
      <group ref={headRef} position={[0, 0.78, 0]}>
        {/* Main Head Box */}
        <mesh>
          <boxGeometry args={[0.65, 0.5, 0.5]} />
          <meshStandardMaterial color={bodyColor} roughness={bodyRoughness} metalness={bodyMetalness} />
        </mesh>

        {/* Visor Screen */}
        <mesh position={[0, 0.02, 0.23]}>
          <boxGeometry args={[0.54, 0.32, 0.05]} />
          <meshStandardMaterial color={screenColor} roughness={0.05} metalness={0.9} />
        </mesh>

        {/* Glowing Eyes */}
        <mesh ref={leftEyeRef} position={[-0.14, 0.02, 0.26]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={eyeColor} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.14, 0.02, 0.26]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={eyeColor} />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 0.29, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
          <meshStandardMaterial color={brandBlue} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={brandGold} />
        </mesh>
      </group>

      {/* NECK JOINT */}
      <mesh position={[0, 0.50, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.14, 16]} />
        <meshStandardMaterial color={brandGold} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ROBOT BODY */}
      <group position={[0, -0.1, 0]}>
        {/* Main Torso */}
        <mesh>
          <capsuleGeometry args={[0.34, 0.48, 8, 24]} />
          <meshStandardMaterial color={bodyColor} roughness={bodyRoughness} metalness={bodyMetalness} />
        </mesh>

        {/* Two Standing Black Lines on Chest */}
        {/* Left Line */}
        <mesh position={[-0.14, 0.08, 0.325]}>
          <boxGeometry args={[0.015, 0.20, 0.03]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Right Line */}
        <mesh position={[0.14, 0.08, 0.325]}>
          <boxGeometry args={[0.015, 0.20, 0.03]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Aspiria Logo on Chest (placed between the two standing lines) */}
        <mesh position={[0, 0.08, 0.342]}>
          <planeGeometry args={[0.23, 0.23]} />
          <meshBasicMaterial map={logoTexture} transparent={true} />
        </mesh>

        {/* Shoulders & Arms (Resting naturally at sides) */}
        {/* Left Arm Group */}
        <group position={[-0.44, 0.08, 0.05]} rotation={[-0.2, 0.1, 0.12]}>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color={brandBlue} metalness={0.7} />
          </mesh>
          {/* Upper arm cylinder */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.035, 0.3, 16]} />
            <meshStandardMaterial color={bodyColor} roughness={bodyRoughness} metalness={bodyMetalness} />
          </mesh>
          {/* Wrist / Hand joint */}
          <mesh position={[0, -0.3, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={brandBlue} metalness={0.7} />
          </mesh>
        </group>

        {/* Right Arm Group */}
        <group ref={rightArmRef} position={[0.44, 0.08, 0.05]} rotation={[-0.2, -0.1, -0.12]}>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color={brandBlue} metalness={0.7} />
          </mesh>
          {/* Upper arm cylinder */}
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.035, 0.3, 16]} />
            <meshStandardMaterial color={bodyColor} roughness={bodyRoughness} metalness={bodyMetalness} />
          </mesh>
          {/* Wrist / Hand joint */}
          <mesh position={[0, -0.3, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={brandBlue} metalness={0.7} />
          </mesh>
        </group>

        {/* Hover Thruster Base */}
        <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.04, 8, 24]} />
          <meshStandardMaterial color={brandBlue} metalness={0.8} />
        </mesh>

        {/* Glowing Jet Flame (Floating Effect) */}
        <mesh position={[0, -0.72, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.18, 16]} />
          <meshBasicMaterial color={brandGold} />
        </mesh>
        <pointLight position={[0, -0.85, 0]} distance={1.5} intensity={isDark ? 4 : 2} color={brandGold} />
      </group>
    </group>
  );
};

export const Hero3D = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [greeting, setGreeting] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show welcome greeting shortly after page load
    const timer = setTimeout(() => {
      setGreeting(true);
    }, 1200);
    
    // Auto-hide after 5.5 seconds
    const hideTimer = setTimeout(() => {
      setGreeting(false);
    }, 6700);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const triggerGreeting = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    setGreeting(true);
    // Auto-hide greeting after 4.5 seconds
    hideTimerRef.current = setTimeout(() => {
      setGreeting(false);
    }, 4500);
  };

  return (
    <div className="w-full h-full min-h-[400px] relative z-0">
      {/* Speech Bubble Overlay */}
      <div 
        className={`absolute top-[-20px] left-1/2 -translate-x-1/2 z-10 transition-all duration-500 transform ${
          greeting 
            ? 'opacity-100 translate-y-2 scale-100 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 px-4.5 py-2.5 rounded-2xl shadow-elegant text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 max-w-[280px] sm:max-w-xs relative text-center justify-center">
          <span>Hey! I'm <span className="text-primary font-bold">Aspy</span>. Welcome to Aspiria!</span>
          
          {/* Arrow pointing down */}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white/85 dark:bg-slate-900/85 border-r border-b border-slate-200/50 dark:border-slate-800/80 rotate-45" />
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 6.2], fov: 42 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={isDark ? 0.85 : 0.65} />
        <directionalLight position={[10, 10, 5]} intensity={isDark ? 2.5 : 1.2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={isDark ? 0.8 : 0.5} color={isDark ? "#8b5cf6" : "#bae6fd"} />
        <pointLight position={[0, -6, 6]} intensity={isDark ? 0.6 : 0.6} color={isDark ? "#7c3aed" : "#0ea5e9"} />
        
        <Robot3D isDark={isDark} onPoke={triggerGreeting} isGreeting={greeting} />
        
        <OrbitControls enableZoom={false} enablePan={false} />
        
        {isDark && (
          <Stars 
            radius={50} 
            depth={50} 
            count={2000} 
            factor={8} 
            saturation={0} 
            fade 
            speed={0.8} 
          />
        )}
      </Canvas>
    </div>
  );
};

