import * as THREE from "three";

const canvas = document.querySelector("#space");
const labelLayer = document.querySelector(".node-labels");
const panelKicker = document.querySelector("#panel-kicker");
const panelTitle = document.querySelector("#panel-title");
const panelBody = document.querySelector("#panel-body");
const panelMetrics = document.querySelector("#panel-metrics");

const focusContent = {
  profile: {
    label: "Profile",
    title: "A data engineer who thinks like a field engineer.",
    body:
      "I taught myself software and data engineering, then applied it to concrete environments: offshore automation, product data pipelines, Oracle Database, Vector Search and Agentic AI.",
    metrics: ["Self-taught", "Data + mechanics", "Problem-solving"],
    position: [-1.9, 1.15, 0.2],
    color: 0x4fd6c7,
  },
  projects: {
    label: "Projects",
    title: "Pipelines that replace repetitive work with reliable flow.",
    body:
      "At Sagemcom, I built a Python and SQL pipeline able to transform Excel, PDF and XML inputs into usable data, then automated processing with Jenkins.",
    metrics: ["Python", "SQLAlchemy", "Jenkins"],
    position: [1.75, 0.9, -0.35],
    color: 0xf5c85b,
  },
  systems: {
    label: "Systems",
    title: "Mechanics, cloud and databases in the same mental model.",
    body:
      "My mechanical engineering background helps me reason through constraints, flows and optimization. Today I apply it to Oracle Database, OCI, PL/SQL and data architectures.",
    metrics: ["Oracle DB", "OCI", "Fluid mechanics"],
    position: [0.4, -1.25, 0.15],
    color: 0x9dd85d,
  },
  ai: {
    label: "Applied AI",
    title: "Useful AI starts with clean, structured data.",
    body:
      "I work on Vector Search and Agentic AI with a simple conviction: agents become truly powerful when pipelines and databases are robust.",
    metrics: ["Vector Search", "Agentic AI", "PyTorch"],
    position: [-0.6, 0.2, -1.65],
    color: 0xa78bfa,
  },
  automation: {
    label: "Automation",
    title: "Automating without losing touch with the field.",
    body:
      "At DORIS Engineering, I developed VBA tools for offshore sizing. The common thread with data engineering: remove friction without hiding the business logic.",
    metrics: ["VBA", "Offshore sizing", "Reliability"],
    position: [2.35, -0.85, 0.95],
    color: 0xff7b6e,
  },
  contact: {
    label: "Contact",
    title: "Available for data, applied AI and optimization topics.",
    body:
      "I am looking for environments where innovative ideas meet real problems: data platforms, automation, AI agents and smarter operations.",
    metrics: ["Paris", "Panama-ready", "French / English"],
    position: [-2.15, -0.95, 1.05],
    color: 0x4fd6c7,
  },
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.3, 7.4);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const root = new THREE.Group();
scene.add(root);

const ambient = new THREE.AmbientLight(0xffffff, 0.58);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3.8, 4.2, 4.8);
scene.add(keyLight);

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x6f746d,
  transparent: true,
  opacity: 0.36,
});

function makeLine(points, material = lineMaterial) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  root.add(line);
  return line;
}

const nodeKeys = Object.keys(focusContent);
const nodeMeshes = new Map();
const labels = new Map();

nodeKeys.forEach((key, index) => {
  const item = focusContent[key];
  const geometry =
    index % 2 === 0
      ? new THREE.OctahedronGeometry(0.18, 0)
      : new THREE.TetrahedronGeometry(0.23, 0);
  const material = new THREE.MeshStandardMaterial({
    color: item.color,
    emissive: item.color,
    emissiveIntensity: 0.16,
    metalness: 0.25,
    roughness: 0.45,
    wireframe: index % 3 === 0,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...item.position);
  mesh.userData.key = key;
  root.add(mesh);
  nodeMeshes.set(key, mesh);

  const ring = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.58, 0.58, 0.58)),
    new THREE.LineBasicMaterial({
      color: item.color,
      transparent: true,
      opacity: 0.28,
    }),
  );
  ring.position.copy(mesh.position);
  ring.rotation.set(0.4 + index * 0.17, 0.2, index * 0.2);
  root.add(ring);
  mesh.userData.ring = ring;

  const label = document.createElement("button");
  label.className = "node-label";
  label.type = "button";
  label.textContent = item.label;
  label.dataset.focus = key;
  label.addEventListener("click", () => focusNode(key, true));
  labelLayer.appendChild(label);
  labels.set(key, label);
});

for (let i = 0; i < nodeKeys.length; i += 1) {
  const a = focusContent[nodeKeys[i]].position;
  const b = focusContent[nodeKeys[(i + 1) % nodeKeys.length]].position;
  const c = focusContent[nodeKeys[(i + 2) % nodeKeys.length]].position;
  makeLine([
    new THREE.Vector3(...a),
    new THREE.Vector3((a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3),
    new THREE.Vector3(...b),
  ]);
}

const grid = new THREE.GridHelper(9, 18, 0x4fd6c7, 0x6f746d);
grid.position.y = -1.9;
grid.rotation.x = 0.06;
grid.material.transparent = true;
grid.material.opacity = 0.16;
root.add(grid);

const particleGeometry = new THREE.BufferGeometry();
const particleCount = 220;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const stride = i * 3;
  particlePositions[stride] = (Math.random() - 0.5) * 9;
  particlePositions[stride + 1] = (Math.random() - 0.5) * 5.5;
  particlePositions[stride + 2] = (Math.random() - 0.5) * 5;
}
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    color: 0xf4f1e8,
    size: 0.018,
    transparent: true,
    opacity: 0.36,
  }),
);
root.add(particles);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const targetCamera = new THREE.Vector3(0, 0.3, 7.4);
const targetLookAt = new THREE.Vector3(0, 0, 0);
const currentLookAt = new THREE.Vector3(0, 0, 0);
const pointerDrift = new THREE.Vector2();
let activeKey = "profile";
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let rotationX = 0;
let rotationY = 0;

function setPanel(item) {
  panelKicker.textContent = item.label;
  panelTitle.textContent = item.title;
  panelBody.textContent = item.body;
  panelMetrics.replaceChildren(
    ...item.metrics.map((metric) => {
      const span = document.createElement("span");
      span.textContent = metric;
      return span;
    }),
  );
}

function syncActiveControls(key) {
  document.querySelectorAll("[data-focus]").forEach((control) => {
    control.classList.toggle("is-active", control.dataset.focus === key);
  });
}

function focusNode(key, updateHash = false) {
  const item = focusContent[key];
  const mesh = nodeMeshes.get(key);
  if (!item || !mesh) return;

  activeKey = key;
  setPanel(item);
  syncActiveControls(key);

  const direction = mesh.position.clone().normalize();
  targetCamera.copy(mesh.position).add(direction.multiplyScalar(3.2));
  targetCamera.z += 2.4;
  targetCamera.y += 0.32;
  targetLookAt.copy(mesh.position);

  if (updateHash) {
    history.replaceState(null, "", `#${key}`);
  }
}

function updateLabels() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  nodeMeshes.forEach((mesh, key) => {
    const label = labels.get(key);
    const position = mesh.position.clone();
    root.localToWorld(position);
    position.project(camera);
    const visible = position.z < 1;
    label.style.opacity = visible ? "1" : "0";
    label.style.transform = `translate(-50%, -50%) translate(${(position.x * 0.5 + 0.5) * width}px, ${(-position.y * 0.5 + 0.5) * height}px)`;
  });
}

function pickNode(event) {
  if (event.target.closest("a, button")) return;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([...nodeMeshes.values()], false);
  if (hits[0]?.object?.userData?.key) {
    focusNode(hits[0].object.userData.key, true);
  }
}

window.addEventListener("pointermove", (event) => {
  pointerDrift.x = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerDrift.y = (event.clientY / window.innerHeight - 0.5) * 2;
  if (isDragging) {
    targetRotationY += (event.clientX - dragStartX) * 0.002;
    targetRotationX += (event.clientY - dragStartY) * 0.0015;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  }
});

window.addEventListener("pointerdown", (event) => {
  if (event.target.closest("a, button")) return;
  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
});

window.addEventListener("pointerup", () => {
  isDragging = false;
});

window.addEventListener("click", pickNode);

document.querySelectorAll("[data-focus]").forEach((control) => {
  control.addEventListener("click", () => focusNode(control.dataset.focus, true));
});

document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
});

function animate() {
  requestAnimationFrame(animate);
  const scroll = Math.min(window.scrollY / 900, 1.5);

  rotationX += (targetRotationX - rotationX) * 0.08;
  rotationY += (targetRotationY - rotationY) * 0.08;
  root.rotation.x = rotationX + pointerDrift.y * 0.045 - scroll * 0.08;
  root.rotation.y = rotationY + pointerDrift.x * 0.07 + scroll * 0.12;

  camera.position.lerp(targetCamera, 0.045);
  currentLookAt.lerp(targetLookAt, 0.06);
  camera.lookAt(currentLookAt);

  nodeMeshes.forEach((mesh, key) => {
    const isActive = key === activeKey;
    mesh.rotation.x += isActive ? 0.016 : 0.006;
    mesh.rotation.y += isActive ? 0.018 : 0.007;
    mesh.scale.lerp(new THREE.Vector3(isActive ? 1.45 : 1, isActive ? 1.45 : 1, isActive ? 1.45 : 1), 0.08);
    mesh.userData.ring.rotation.x += 0.004;
    mesh.userData.ring.rotation.y += isActive ? 0.01 : 0.004;
  });

  particles.rotation.y += 0.0009;
  grid.position.z = (scroll % 1) * 0.45;

  renderer.render(scene, camera);
  updateLabels();
}

const initialKey = location.hash.replace("#", "");
focusNode(focusContent[initialKey] ? initialKey : "profile", false);
animate();
