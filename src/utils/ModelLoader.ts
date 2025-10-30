import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

export class ModelLoader {
  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;
  private loadingManager: THREE.LoadingManager;

  constructor(onProgress?: (progress: number) => void) {
    this.loadingManager = new THREE.LoadingManager(
      () => {
        if (onProgress) onProgress(100);
      },
      (url, loaded, total) => {
        if (onProgress && total > 0) {
          onProgress((loaded / total) * 100);
        }
      }
    );

    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }

  async loadModel(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          resolve(gltf.scene);
        },
        undefined,
        reject
      );
    });
  }

  async loadTexture(url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(url, resolve, undefined, reject);
    });
  }

  async loadMultipleModels(urls: string[]): Promise<THREE.Group[]> {
    return Promise.all(urls.map(url => this.loadModel(url)));
  }
}
