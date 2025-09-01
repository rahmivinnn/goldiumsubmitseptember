'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ThreeJSBackgroundProps {
  className?: string
}

export default function ThreeJSBackground({ className = '' }: ThreeJSBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 50

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create blockchain network nodes
    const nodeGeometry = new THREE.SphereGeometry(0.3, 8, 6) // Low poly for performance
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8
    })

    const nodes: THREE.Mesh[] = []
    const nodeCount = 25 // Limited count for performance
    
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone())
      node.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40
      )
      
      // Random colors for variety
      const colors = [0x00ff88, 0xff6b35, 0x4ecdc4, 0xffe66d, 0xff6b9d]
      ;(node.material as THREE.MeshBasicMaterial).color.setHex(
        colors[Math.floor(Math.random() * colors.length)]
      )
      
      nodes.push(node)
      scene.add(node)
    }

    // Create connections between nodes
    const connectionMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ff88,
      transparent: true,
      opacity: 0.3
    })

    const connections: THREE.Line[] = []
    const connectionCount = 15 // Limited connections for performance
    
    for (let i = 0; i < connectionCount; i++) {
      const node1 = nodes[Math.floor(Math.random() * nodes.length)]
      const node2 = nodes[Math.floor(Math.random() * nodes.length)]
      
      if (node1 !== node2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          node1.position,
          node2.position
        ])
        
        const line = new THREE.Line(geometry, connectionMaterial.clone())
        connections.push(line)
        scene.add(line)
      }
    }

    // Create floating particles (transactions)
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 100 // Moderate count for performance
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100
      positions[i + 1] = (Math.random() - 0.5) * 80
      positions[i + 2] = (Math.random() - 0.5) * 60
      
      velocities[i] = (Math.random() - 0.5) * 0.02
      velocities[i + 1] = (Math.random() - 0.5) * 0.02
      velocities[i + 2] = (Math.random() - 0.5) * 0.02
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    })
    
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      // Rotate nodes slowly
      nodes.forEach((node, index) => {
        node.rotation.x += 0.005
        node.rotation.y += 0.005
        
        // Gentle floating motion
        node.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01
      })

      // Animate particles
      const positions = particles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i]
        positions[i + 1] += velocities[i + 1]
        positions[i + 2] += velocities[i + 2]
        
        // Wrap around boundaries
        if (Math.abs(positions[i]) > 50) velocities[i] *= -1
        if (Math.abs(positions[i + 1]) > 40) velocities[i + 1] *= -1
        if (Math.abs(positions[i + 2]) > 30) velocities[i + 2] *= -1
      }
      particles.geometry.attributes.position.needsUpdate = true

      // Pulse connections
      connections.forEach((connection, index) => {
        const material = connection.material as THREE.LineBasicMaterial
        material.opacity = 0.2 + Math.sin(Date.now() * 0.002 + index) * 0.1
      })

      // Gentle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0005) * 2
      camera.position.y = Math.cos(Date.now() * 0.0003) * 1
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Dispose of Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}