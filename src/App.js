import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import axios from "axios";
import React from "react";
const hex2rgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // return {r, g, b} 
  return { r, g, b };
}

const Scene = ({ vertex, fragment ,colors }) => {
  const meshRef = useRef();
  useFrame((state) => {
    let time = state.clock.getElapsedTime();
    meshRef.current.material.uniforms.time.value = time;
    meshRef.current.material.uniforms.baseFirst.value=colors.baseFirst;
    meshRef.current.material.uniforms.baseSecond.value=colors.baseSecond;
    meshRef.current.material.uniforms.baseThird.value=colors.baseThird;
  });

  // Define the shader uniforms with memoization to optimize performance
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      baseFirst : { value: colors.baseFirst},
      baseSecond : { value: colors.baseSecond},
      baseThird : { value: colors.baseThird},
    }),
    []
  );

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 3]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

function App() {
  // State variables to store the vertex and fragment shaders as strings
  const [vertex, setVertex] = useState("");
  const [fragment, setFragment] = useState("");
  const [colors, setColors]=useState("");
  // Fetch the shaders once the component mounts
  useEffect(() => {
    // fetch the vertex and fragment shaders from public folder
    axios.get("/vertexShader.glsl").then((res) => setVertex(res.data));
    axios.get("/fragmentShader.glsl").then((res) => setFragment(res.data));
    setColors({baseFirst:new THREE.Vector3(120./255., 158./255., 113./255.),
    baseSecond:new THREE.Vector3(224./255., 148./255., 66./255.),
    baseThird:new THREE.Vector3(0./255., 0./255., 0./255.),})
  }, []);

  // If the shaders are not loaded yet, return null (nothing will be rendered)
  if (vertex == "" || fragment == "" || colors == "") return null;
  return (
    <div>
    <Canvas  style={{ width: "90vw", height: "90vh" }}>
      <Scene vertex={vertex} fragment={fragment}  colors={colors}/>
    </Canvas>
      <input type="color" onChange={(e)=>{
        let color=hex2rgb(e.target.value);
setColors({...colors, baseFirst:
new THREE.Vector3(color.r/225.,color.g/225.,color.b/225.) })}}  />
    <input type="color" onChange={(e)=>{
      let color=hex2rgb(e.target.value);
setColors({...colors, baseSecond:
new THREE.Vector3(color.r/225.,color.g/225.,color.b/225.) })}}  />
  <input type="color" onChange={(e)=>{
    let color=hex2rgb(e.target.value);
setColors({...colors, baseThird:
new THREE.Vector3(color.r/225.,color.g/225.,color.b/225.) })}}  />
</div>
      );
}

export default App;
