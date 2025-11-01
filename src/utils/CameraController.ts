import CameraControls from 'camera-controls';
import * as THREE from 'three';

CameraControls.install({ THREE });

export class CameraController {
  public controls: CameraControls;

  constructor(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, domElement: HTMLElement) {
    this.controls = new CameraControls(camera, domElement);

    this.controls.minDistance = 5;
    this.controls.maxDistance = 30;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
    this.controls.dampingFactor = 0.05;
    this.controls.draggingDampingFactor = 0.25;
    this.controls.smoothTime = 0.25;
  }

  update(delta: number): boolean {
    return this.controls.update(delta);
  }

  async moveTo(position: THREE.Vector3, target: THREE.Vector3, enableTransition = true): Promise<void> {
    await this.controls.setLookAt(
      position.x, position.y, position.z,
      target.x, target.y, target.z,
      enableTransition
    );
  }

  async focusOn(target: THREE.Vector3, distance = 10): Promise<void> {
    await this.controls.moveTo(target.x, target.y, target.z, true);
    await this.controls.dollyTo(distance, true);
  }

  reset(): void {
    this.controls.reset(true);
  }

  dispose(): void {
    this.controls.dispose();
  }
}
