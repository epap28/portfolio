import * as THREE from "three";

const canvas = document.querySelector("#space");
const stage = document.querySelector("#space-stage");
const labelLayer = document.querySelector(".node-labels");
const panel = document.querySelector(".focus-panel");
const panelKicker = document.querySelector("#panel-kicker");
const panelTitle = document.querySelector("#panel-title");
const panelBody = document.querySelector("#panel-body");
const panelMetrics = document.querySelector("#panel-metrics");
const panelDetails = document.querySelector("#panel-details");
const unzoomButton = document.querySelector("#unzoom-button");

const focusContent = {
  profile: {
    label: "Profile",
    title: "A data engineer shaped by mechanical engineering.",
    body:
      "I build clean pipelines, automate industrial friction and turn complex problems into useful data systems.",
    metrics: ["Data Engineering", "Applied AI", "Outside-the-box thinking"],
    details: [
      {
        title: "Oracle Graduate Program",
        body: "Data Engineering, Applied AI, Vector Search, PL/SQL, OCI.",
      },
      {
        title: "Self-taught software path",
        body: "Progress through projects, business needs and fast experimentation.",
      },
      {
        title: "Mechanical engineering DNA",
        body: "Fluids, sizing, modeling and attention to real-world constraints.",
      },
    ],
    position: [-1.8, 0.92, 0.35],
    color: 0x4fd6c7,
  },
  experience: {
    label: "Work Experience",
    title: "Three experiences where engineering meets automation.",
    body:
      "From Oracle AI work to custom product pipelines and offshore sizing tools, I focus on practical systems that make technical work faster and cleaner.",
    metrics: ["Oracle", "Sagemcom", "DORIS Engineering"],
    details: [
      {
        type: "experience",
        date: "Since Sept. 2025",
        title: "Graduate Program - Data Engineer & Applied AI",
        place: "Oracle, Paris",
        body:
          "Vector Search, Agentic AI, Python and PL/SQL pipelines, Oracle Database administration and OCI management.",
      },
      {
        type: "experience",
        date: "March - August 2025",
        title: "Data Engineer / Data Analyst - Product Environment",
        place: "Sagemcom, Bois-Colombes",
        body:
          "Custom Python and SQL pipeline transforming Excel, PDF and XML inputs into usable product data, automated with Jenkins.",
      },
      {
        type: "experience",
        date: "April - August 2024",
        title: "Automation Tools Developer",
        place: "DORIS Engineering, Paris",
        body:
          "VBA tools for offshore platform sizing, directly connected to fluid mechanics constraints.",
      },
    ],
    position: [1.65, 0.8, -0.35],
    color: 0xf5c85b,
  },
  stack: {
    label: "Stack",
    title: "The tools I use to make systems flow better.",
    body:
      "A data stack built around reliable pipelines, robust databases, applied AI and a mechanical engineer's taste for constraints.",
    metrics: ["Python", "Oracle DB", "Spark / dbt"],
    details: [
      {
        title: "Data pipelines",
        body: "Python, Pandas, SQLAlchemy, PL/SQL, Jenkins, Fivetran, GoldenGate, dbt.",
      },
      {
        title: "Platforms",
        body: "Oracle Database, MySQL, Snowflake, Databricks, Apache Spark, OCI.",
      },
      {
        title: "Applied AI",
        body: "Vector Search, Agentic AI, Scikit-learn, PyTorch, experimentation ML.",
      },
      {
        title: "Mechanical roots",
        body: "Fluid mechanics, CAD, material strength, MATLAB modeling.",
      },
    ],
    position: [0.25, -1.05, 0.1],
    color: 0x9dd85d,
  },
  mindset: {
    label: "Mindset",
    title: "What I bring beyond the stack.",
    body:
      "I approach data engineering with the habits of a mechanical engineer: observe constraints, model the flow, then optimize the system without losing sight of the field.",
    metrics: ["Proactivity", "Precision", "Out-of-the-box thinking"],
    details: [
      {
        title: "Proactivity",
        body: "I do not wait for a perfect brief: I clarify the goal, prototype quickly and make the next useful step visible.",
      },
      {
        title: "Attention to detail",
        body: "Clean data, stable pipelines and readable logic matter because small errors become expensive downstream.",
      },
      {
        title: "Versatility",
        body: "Mechanical engineering, automation and data work give me a broad way to connect business constraints with technical implementation.",
      },
      {
        title: "Problem-solving mindset",
        body: "I like problems where the obvious answer is not enough and the best solution comes from reframing the system.",
      },
    ],
    position: [-1.45, -1.05, -0.75],
    color: 0xa78bfa,
  },
  contact: {
    label: "Contact",
    title: "Available for data, applied AI and optimization topics.",
    body:
      "I am looking for environments where innovative ideas meet real problems: data platforms, automation, AI agents and smarter operations.",
    metrics: ["Paris", "Panama-ready", "French / English"],
    details: [
      {
        title: "Email",
        body: "edouardpapillon28@gmail.com",
      },
      {
        title: "Languages",
        body: "French native, English C1, beginner Spanish.",
      },
      {
        title: "Working style",
        body: "Proactive, detail-oriented, versatile and comfortable learning independently.",
      },
    ],
    position: [1.35, -0.95, 1.05],
    color: 0xff7b6e,
  },
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
const overviewCamera = new THREE.Vector3(0, 0.35, 7.1);
const overviewLookAt = new THREE.Vector3(0, 0, 0);
camera.position.copy(overviewCamera);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.outputColorSpace = THREE.SRGBColorSpace;

const root = new THREE.Group();
scene.add(root);

scene.add(new THREE.AmbientLight(0xffffff, 0.58));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3.8, 4.2, 4.8);
scene.add(keyLight);

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x6f746d,
  transparent: true,
  opacity: 0.34,
});

const nodeKeys = Object.keys(focusContent);
const nodeMeshes = new Map();
const labels = new Map();
const hitTargets = [];
const connectorLines = [];
const targetRootPosition = new THREE.Vector3(0, 0, 0);

function makeLine(points, material = lineMaterial) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  root.add(line);
  connectorLines.push(line);
}

nodeKeys.forEach((key, index) => {
  const item = focusContent[key];
  const geometry =
    index % 2 === 0
      ? new THREE.OctahedronGeometry(0.2, 0)
      : new THREE.TetrahedronGeometry(0.26, 0);
  const material = new THREE.MeshStandardMaterial({
    color: item.color,
    emissive: item.color,
    emissiveIntensity: 0.18,
    metalness: 0.25,
    roughness: 0.45,
    transparent: true,
    opacity: 1,
    wireframe: index === 0,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...item.position);
  mesh.userData.key = key;
  root.add(mesh);
  nodeMeshes.set(key, mesh);

  const hitTarget = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 16, 16),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      colorWrite: false,
      depthWrite: false,
    }),
  );
  hitTarget.position.copy(mesh.position);
  hitTarget.userData.key = key;
  root.add(hitTarget);
  hitTargets.push(hitTarget);

  const ring = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.62, 0.62, 0.62)),
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
  label.addEventListener("click", () => focusNode(key));
  labelLayer.appendChild(label);
  labels.set(key, label);
});

for (let i = 0; i < nodeKeys.length; i += 1) {
  const a = focusContent[nodeKeys[i]].position;
  const b = focusContent[nodeKeys[(i + 1) % nodeKeys.length]].position;
  makeLine([new THREE.Vector3(...a), new THREE.Vector3(...b)]);
}

const grid = new THREE.GridHelper(8, 16, 0x4fd6c7, 0x6f746d);
grid.position.y = -1.75;
grid.rotation.x = 0.06;
grid.material.transparent = true;
grid.material.opacity = 0.16;
root.add(grid);

const particleGeometry = new THREE.BufferGeometry();
const particleCount = 180;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const stride = i * 3;
  particlePositions[stride] = (Math.random() - 0.5) * 8;
  particlePositions[stride + 1] = (Math.random() - 0.5) * 5;
  particlePositions[stride + 2] = (Math.random() - 0.5) * 4.8;
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
const targetCamera = overviewCamera.clone();
const targetLookAt = overviewLookAt.clone();
const currentLookAt = overviewLookAt.clone();
const pointerDrift = new THREE.Vector2();
let activeKey = "profile";
let zoomedKey = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let rotationX = 0;
let rotationY = 0;
let panelTransitionTimer;
let hoveredKey = null;
let pointerInside = false;
let pointerBlocked = false;
let pointerClientX = 0;
let pointerClientY = 0;

function buildDetails(details) {
  panelDetails.replaceChildren(
    ...details.map((detail) => {
      const item = document.createElement("article");
      item.className = detail.type === "experience" ? "detail-item experience-detail" : "detail-item";

      const title = document.createElement("strong");
      title.textContent = detail.title;

      const body = document.createElement("p");
      body.textContent = detail.body;

      if (detail.type === "experience") {
        const date = document.createElement("div");
        date.className = "detail-date";
        date.textContent = detail.date;

        const place = document.createElement("p");
        place.className = "detail-place";
        place.textContent = detail.place;

        item.append(date, title, place, body);
        return item;
      }

      item.append(title, body);
      return item;
    }),
  );
}

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
  buildDetails(item.details);
  panel.classList.add("is-visible", "is-armed");
}

function transitionPanelTo(item, delay = 720) {
  window.clearTimeout(panelTransitionTimer);
  panel.classList.add("is-changing");
  panelTransitionTimer = window.setTimeout(() => {
    setPanel(item);
    window.requestAnimationFrame(() => panel.classList.remove("is-changing"));
  }, delay);
}

function syncActiveControls(key) {
  labels.forEach((label, labelKey) => {
    label.classList.toggle("is-active", labelKey === key);
  });
}

function syncHover(key) {
  hoveredKey = key;
  labels.forEach((label, labelKey) => {
    label.classList.toggle("is-hovered", labelKey === key);
  });
  const cursor = isDragging ? "grabbing" : key && !zoomedKey ? "pointer" : "grab";
  canvas.style.cursor = cursor;
  stage.style.cursor = cursor;
}

function showOverview(key = "profile") {
  window.clearTimeout(panelTransitionTimer);
  activeKey = key;
  zoomedKey = null;
  stage.classList.remove("is-focused");
  panel.classList.remove("is-visible", "is-armed", "is-changing");
  targetRootPosition.set(0, 0, 0);
  targetRotationX = 0;
  targetRotationY = 0;
  targetCamera.copy(overviewCamera);
  targetLookAt.copy(overviewLookAt);
  syncActiveControls(key);
  syncHover(null);
}

function focusNode(key) {
  const item = focusContent[key];
  const mesh = nodeMeshes.get(key);
  if (!item || !mesh) return;

  activeKey = key;
  zoomedKey = key;
  stage.classList.add("is-focused");
  transitionPanelTo(item, 780);
  syncActiveControls(key);
  syncHover(null);

  targetRootPosition.copy(mesh.position).multiplyScalar(-1);
  targetRotationX = 0;
  targetRotationY = 0;
  targetCamera.set(0, 0.08, 4.35);
  targetLookAt.set(0, 0, 0);
}

function resizeRenderer() {
  const rect = stage.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(width, height, false);
}

function updateLabels() {
  const rect = stage.getBoundingClientRect();
  nodeMeshes.forEach((mesh, key) => {
    const label = labels.get(key);
    const position = mesh.position.clone();
    root.localToWorld(position);
    position.project(camera);
    const visible = position.z < 1;
    label.style.opacity = visible ? "1" : "0";
    label.style.transform = `translate(-50%, -50%) translate(${(position.x * 0.5 + 0.5) * rect.width}px, ${(-position.y * 0.5 + 0.5) * rect.height}px)`;
  });
}

function isInteractiveTarget(target) {
  return target instanceof Element && Boolean(target.closest("a, button"));
}

function setPointerFromClient(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  return true;
}

function pickNode(event) {
  if (zoomedKey || isInteractiveTarget(event.target)) return;
  if (!setPointerFromClient(event.clientX, event.clientY)) return;
  scene.updateMatrixWorld(true);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(hitTargets, false);
  if (hits[0]?.object?.userData?.key) {
    focusNode(hits[0].object.userData.key);
  }
}

function refreshHoverFromPoint() {
  if (!pointerInside || zoomedKey || pointerBlocked) {
    syncHover(null);
    return;
  }

  if (!setPointerFromClient(pointerClientX, pointerClientY)) {
    syncHover(null);
    return;
  }

  scene.updateMatrixWorld(true);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(hitTargets, false);
  const nextKey = hits[0]?.object?.userData?.key ?? null;
  if (nextKey !== hoveredKey) {
    syncHover(nextKey);
  }
}

function updateHover(event) {
  pointerInside = true;
  pointerBlocked = isInteractiveTarget(event.target);
  pointerClientX = event.clientX;
  pointerClientY = event.clientY;
  refreshHoverFromPoint();
}

stage.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  pointerDrift.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  pointerDrift.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  updateHover(event);
  if (isDragging) {
    targetRotationY += (event.clientX - dragStartX) * 0.002;
    targetRotationX += (event.clientY - dragStartY) * 0.0015;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  }
});

stage.addEventListener("pointerdown", (event) => {
  if (event.target.closest("a, button")) return;
  isDragging = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  syncHover(hoveredKey);
});

window.addEventListener("pointerup", () => {
  isDragging = false;
  refreshHoverFromPoint();
});

stage.addEventListener("pointerleave", () => {
  pointerInside = false;
  pointerBlocked = false;
  syncHover(null);
});
stage.addEventListener("click", pickNode);

unzoomButton.addEventListener("click", () => showOverview("profile"));

document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

window.addEventListener("resize", resizeRenderer);

window.addEventListener("scroll", () => {
  const rect = stage.getBoundingClientRect();
  if (rect.top > window.innerHeight * 0.45 && zoomedKey) {
    showOverview("profile");
  }
});

function animate() {
  requestAnimationFrame(animate);
  resizeRenderer();

  rotationX += (targetRotationX - rotationX) * 0.08;
  rotationY += (targetRotationY - rotationY) * 0.08;
  root.position.lerp(targetRootPosition, 0.028);
  root.rotation.x = rotationX + (zoomedKey ? 0 : pointerDrift.y * 0.045);
  root.rotation.y = rotationY + (zoomedKey ? 0 : pointerDrift.x * 0.07);

  camera.position.lerp(targetCamera, 0.026);
  currentLookAt.lerp(targetLookAt, 0.032);
  camera.lookAt(currentLookAt);
  refreshHoverFromPoint();

  nodeMeshes.forEach((mesh, key) => {
    const isActive = key === activeKey;
    const isMuted = zoomedKey && !isActive;
    mesh.rotation.x += isActive ? 0.016 : 0.006;
    mesh.rotation.y += isActive ? 0.018 : 0.007;
    mesh.material.opacity += ((isMuted ? 0.16 : 1) - mesh.material.opacity) * 0.045;
    mesh.userData.ring.material.opacity += ((isMuted ? 0.05 : 0.28) - mesh.userData.ring.material.opacity) * 0.045;
    const scale = isActive && zoomedKey ? 1.95 : isActive ? 1.45 : 1;
    mesh.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.045);
    mesh.userData.ring.rotation.x += 0.004;
    mesh.userData.ring.rotation.y += isActive ? 0.01 : 0.004;
  });

  const lineOpacity = zoomedKey ? 0.08 : 0.34;
  connectorLines.forEach((line) => {
    line.material.opacity += (lineOpacity - line.material.opacity) * 0.045;
  });

  particles.rotation.y += 0.0009;
  renderer.render(scene, camera);
  updateLabels();
}

const initialKey = location.hash.replace("#", "");
if (focusContent[initialKey]) {
  focusNode(initialKey);
} else {
  syncActiveControls("profile");
}
animate();
