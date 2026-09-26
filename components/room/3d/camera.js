// Fixed isometric camera for the 3D room, built from the same constants as the
// plain-math projection the labels and picture fallback use.
import { OrthographicCamera, Vector3 } from "three";
import { TARGET, DIR, HALF, HALF_Y } from "../projection.js";

export function makeCamera() {
  const cam = new OrthographicCamera(-HALF, HALF, HALF_Y, -HALF_Y, 0.1, 100);
  cam.position.set(...TARGET).addScaledVector(new Vector3(...DIR).normalize(), 30);
  cam.lookAt(...TARGET);
  cam.manual = true; // keep our fixed frustum; r3f would otherwise resize it to pixels
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
  return cam;
}
