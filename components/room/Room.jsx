import RoomStage from "@/components/room/RoomStage";

// Home: the room. (The sidebar with the 3D me lives in the root layout.)
// The box keeps the camera's aspect (projection.js ASPECT = 1.15) and grows to
// whatever the viewport height allows.
export default function Room() {
  return (
    <div className="lg:min-h-[calc(100vh-0.75rem)] flex items-center">
      <div data-room className="relative w-full max-w-[min(100%,calc((100vh-1.5rem)*1.15))] mx-auto aspect-[1.15/1]">
        <RoomStage />
      </div>
    </div>
  );
}
