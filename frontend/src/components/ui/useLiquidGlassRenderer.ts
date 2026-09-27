import { useEffect, useRef } from 'react';
import { GLASS_SHADERS } from './glassShaders';

export interface LiquidGlassOptions {
  ior?: number;
  dispersion?: number;
  maxThickness?: number;
  bevelRadius?: number;
  sigmaA?: [number, number, number];
  scatterDensity?: number;
  lightColor?: [number, number, number];
  steps?: number;
}

export function useLiquidGlassRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  backgroundElementRef: React.RefObject<HTMLElement | null>,
  panelBounds: { x: number; y: number; width: number; height: number },
  options: LiquidGlassOptions = {}
) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof navigator === 'undefined' || !navigator.gpu) return;

    let isRunning = true;
    let animFrame: number;

    (async () => {
      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (!adapter || !isRunning) return;
        const device = await adapter.requestDevice();
        if (!device || !isRunning) return;

        const context = canvas.getContext('webgpu') as GPUCanvasContext | null;
        if (!context) return;

        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        const dpr = window.devicePixelRatio || 1;
        const width = (canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr)));
        const height = (canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr)));

        context.configure({
          device,
          format: presentationFormat,
          alphaMode: 'premultiplied',
        });

        const shaderModule = device.createShaderModule({ code: GLASS_SHADERS });
        const linearSampler = device.createSampler({
          magFilter: 'linear',
          minFilter: 'linear',
          addressModeU: 'mirror-repeat',
          addressModeV: 'mirror-repeat',
        });

        // 1. Allocate Sharp Texture Capture
        const sharpTexture = device.createTexture({
          size: [width, height, 1],
          format: 'rgba8unorm',
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });

        // Initialize sharpTexture with clean white pixels
        const initialPixels = new Uint8Array(width * 4);
        initialPixels.fill(255);
        for (let y = 0; y < Math.min(height, 64); y++) {
          device.queue.writeTexture(
            { texture: sharpTexture, origin: [0, y, 0] },
            initialPixels,
            { bytesPerRow: width * 4 },
            [width, 1, 1]
          );
        }

        // 2. Allocate Downsample Blur Level (Half-Resolution)
        const blurW = Math.max(1, Math.floor(width / 2));
        const blurH = Math.max(1, Math.floor(height / 2));
        const blurTexture = device.createTexture({
          size: [blurW, blurH, 1],
          format: 'rgba8unorm',
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
        });

        // Blur Uniforms
        const blurUniformBuffer = device.createBuffer({
          size: 16,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(blurUniformBuffer, 0, new Float32Array([1.0 / blurW, 1.0 / blurH, 0, 0]));

        const blurBindGroupLayout = device.createBindGroupLayout({
          entries: [
            { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
            { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
          ],
        });

        const blurBindGroup = device.createBindGroup({
          layout: blurBindGroupLayout,
          entries: [
            { binding: 0, resource: { buffer: blurUniformBuffer } },
            { binding: 1, resource: linearSampler },
            { binding: 2, resource: sharpTexture.createView() },
          ],
        });

        const downPipeline = device.createRenderPipeline({
          layout: device.createPipelineLayout({ bindGroupLayouts: [blurBindGroupLayout] }),
          vertex: { module: shaderModule, entryPoint: 'vs_fullscreen' },
          fragment: { module: shaderModule, entryPoint: 'fs_downsample', targets: [{ format: 'rgba8unorm' }] },
          primitive: { topology: 'triangle-list' },
        });

        // 3. Glass Uniform Buffer & Pipeline
        const glassUniformBuffer = device.createBuffer({
          size: 96,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const glassBindGroupLayout = device.createBindGroupLayout({
          entries: [
            { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
            { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
            { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
            { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' } },
          ],
        });

        const glassBindGroup = device.createBindGroup({
          layout: glassBindGroupLayout,
          entries: [
            { binding: 0, resource: { buffer: glassUniformBuffer } },
            { binding: 1, resource: linearSampler },
            { binding: 2, resource: sharpTexture.createView() },
            { binding: 3, resource: blurTexture.createView() },
          ],
        });

        const glassPipeline = device.createRenderPipeline({
          layout: device.createPipelineLayout({ bindGroupLayouts: [glassBindGroupLayout] }),
          vertex: { module: shaderModule, entryPoint: 'vs_fullscreen' },
          fragment: { module: shaderModule, entryPoint: 'fs_glass', targets: [{ format: presentationFormat }] },
          primitive: { topology: 'triangle-list' },
        });

        // Internal Virtual Texture Canvas for capturing DOM content
        const virtualCanvas = document.createElement('canvas');
        virtualCanvas.width = width;
        virtualCanvas.height = height;
        const vCtx = virtualCanvas.getContext('2d');

        const render = () => {
          if (!isRunning) return;

          // Render backing graphics to the canvas stream if dynamic
          if (vCtx && backgroundElementRef.current) {
            // If background element is a canvas or video, write directly via copyExternalImageToTexture
            if (
              backgroundElementRef.current instanceof HTMLCanvasElement ||
              backgroundElementRef.current instanceof HTMLVideoElement
            ) {
              device.queue.copyExternalImageToTexture(
                { source: backgroundElementRef.current },
                { texture: sharpTexture },
                [width, height]
              );
            }
          }

          // Write glass parameters
          const sigA = options.sigmaA || [0.0, 0.0, 0.0];
          const lCol = options.lightColor || [1.0, 0.95, 0.9];
          const uniformData = new Float32Array(24);
          uniformData[0] = width;
          uniformData[1] = height;
          uniformData[2] = mouseRef.current.x * dpr;
          uniformData[3] = mouseRef.current.y * dpr;
          uniformData[4] = panelBounds.x * dpr;
          uniformData[5] = panelBounds.y * dpr;
          uniformData[6] = panelBounds.width * dpr;
          uniformData[7] = panelBounds.height * dpr;
          uniformData[8] = (options.bevelRadius ?? 24.0) * dpr;
          uniformData[9] = options.ior ?? 1.52;
          uniformData[10] = options.dispersion ?? 0.025;
          uniformData[11] = options.maxThickness ?? 12.0;
          uniformData[12] = sigA[0];
          uniformData[13] = sigA[1];
          uniformData[14] = sigA[2];
          uniformData[15] = options.scatterDensity ?? 0.0;
          uniformData[16] = lCol[0];
          uniformData[17] = lCol[1];
          uniformData[18] = lCol[2];
          uniformData[19] = 0.0; // float bitcast for uint steps
          const uintView = new Uint32Array(uniformData.buffer);
          uintView[19] = options.steps ?? 6;
          uintView[23] = options.steps ?? 6;

          device.queue.writeBuffer(glassUniformBuffer, 0, uniformData);

          const encoder = device.createCommandEncoder();

          // Pass 1: Downsample blur pass
          const blurPass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view: blurTexture.createView(),
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
              },
            ],
          });
          blurPass.setPipeline(downPipeline);
          blurPass.setBindGroup(0, blurBindGroup);
          blurPass.draw(3, 1, 0, 0);
          blurPass.end();

          // Pass 2: Main Refractive Glass pass
          const mainPass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view: context.getCurrentTexture().createView(),
                loadOp: 'clear',
                storeOp: 'store',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
              },
            ],
          });
          mainPass.setPipeline(glassPipeline);
          mainPass.setBindGroup(0, glassBindGroup);
          mainPass.draw(3, 1, 0, 0);
          mainPass.end();

          device.queue.submit([encoder.finish()]);
          animFrame = requestAnimationFrame(render);
        };

        animFrame = requestAnimationFrame(render);
      } catch (err) {
        console.warn('WebGPU useLiquidGlassRenderer initialization failed:', err);
      }
    })();

    return () => {
      isRunning = false;
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [
    panelBounds.x,
    panelBounds.y,
    panelBounds.width,
    panelBounds.height,
    options.bevelRadius,
    options.ior,
    options.dispersion,
    options.maxThickness,
    options.scatterDensity,
    options.steps,
  ]);
}
