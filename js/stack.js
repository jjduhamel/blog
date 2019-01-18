console.log("RZA");

/*
var img = document.createElement("img");
img.src = "images/builder.png";
document.getElementById("stack").appendChild(img);
*/

var width = 600;
var height = 600;
var root;

var force = d3.layout.force();
force
  .size([width, height])
  .linkDistance(42)
  .on("tick", tick);

var svg = d3.select("#stack")
  .append("svg:svg")
  .attr("class", "skills-widget")
  .attr("width", "100%")
  .attr("height", height);

var node = svg.selectAll(".node");
var link = svg.selectAll(".link");

var ON = "on";
var OFF = "off";

var NODE_WIDTH = 36;
var NODE_HEIGHT = 36;

d3.json("js/stack.json", function(json) {
  root = json;
  root.px = width/2;
  root.py = height/3;
  root.fixed = true;
  console.log(root);
  update();
});

function update() {
  console.log("update");
  var nodes = flatten(root);
  var links = d3.layout.tree().links(nodes);

  force
    .nodes(nodes)
    .links(links)
    .charge(-420)
    .start();

  /*
  link = svg.selectAll("line.link")
    .data(links, function(d) { return d.target.id });

  link.enter()
    .insert("svg:line", ".node")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  link.exit().remove();
  /**/

  node = svg.selectAll("image.node")
    .data(nodes, function(d) { return d.id });

  node.enter()
    .append("image")
    .attr("class", "node")
    .attr("xlink:href", function(d) {
      if (d.image) {
        return d.image;
      }
    })
    .attr("x", function(d) { return d.x-NODE_WIDTH/2 })
    .attr("y", function(d) { return d.y-NODE_HEIGHT/2 })
    .attr("height", NODE_HEIGHT)
    .attr("width", NODE_WIDTH)
    .call(force.drag);

  node.exit().remove();
}

function _inbounds(target, limit) {
  if (target < 0) return 0;
  if (target > limit) return limit;
  return target;
}

function tick() {
  link
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  node
    .attr("x", function(d) { return _inbounds(d.x, width); })
    .attr("y", function(d) { return _inbounds(d.y, height-NODE_HEIGHT); });
}

function color(d) {
  return d._children ? "#3182bd" : "#c6dbef";
}

function flatten(root) {
  var nodes = [];
  var j = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++j;
    nodes.push(node);
  }

  recurse(root);

  root.x = nodes[0].x;
  root.y = nodes[0].y;

  return nodes;
}

console.log("JZA");
