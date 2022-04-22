// Program 3

const canvas = new Canvas();
canvas.setBG("black");
const r1 = new Rectangle("r1", 150, 150, 100, 100);
r1.setRadius("50%");
r1.setBG("black");
r1.setBorder("white", 10);
r1.stroke("outline", "5s", "3", "stroking");
r1.animate("changeR", "rx", "0px;75px", "5s", "3");
r1.set("stroke", "blue", "stroking.begin");
r1.set("stroke", "skyblue", "stroking.repeat(1)");
r1.set("stroke", "pink", "stroking.repeat(2)");