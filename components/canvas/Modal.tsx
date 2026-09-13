"use client";

import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { Color, Group, MeshStandardMaterial } from "three";
import { IThreeDModelState } from "@/lib/types";
import { useRef } from "react";
import state from "@/store";

type ModalProps = {
  isCustomizable: boolean;
  threeDModelState: IThreeDModelState | null;
  showTexture?: boolean;
};

const Modal = ({
  isCustomizable = false,
  threeDModelState = null,
  showTexture: _showTexture = false,
}: ModalProps) => {
  const appState = useSnapshot(state);
  const group = useRef<Group>(null);

  const snap =
    !isCustomizable && threeDModelState ? threeDModelState : appState;
  const { nodes, materials } = useGLTF("/assets/threedmodels/shirt.glb");
  const object3dEventMap = nodes.T_Shirt_male as any;

  const logoImage = useTexture(snap.logoImage);
  const fullImage = useTexture(snap.fullImage);

  useFrame((_state, delta) => {
    const shirtMaterial = materials.lambert1 as MeshStandardMaterial;
    easing.dampC(shirtMaterial.color as Color, snap.color, 0.25, delta);
  });

  return (
    <group ref={group}>
      <mesh
        geometry={object3dEventMap.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
        position={[0, 0, 0]}
      >
        {snap.isFullImage && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullImage}
          />
        )}

        {snap.isLogoImage && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.18}
            map={logoImage}
            depthTest={false}
          />
        )}
      </mesh>
    </group>
  );
};

export default Modal;
