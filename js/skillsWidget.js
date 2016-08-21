var width = 600;
var height = 360;
var root;

var force = d3.layout.force();
force
  .size([width, height])
  .linkDistance(100)
  .on('tick', tick);

var svg = d3.select('body')
  .append('svg:svg')
  .attr('class', 'skills-widget')
  .attr('width', '100%')
  .attr('height', '100%');

var node = svg.selectAll('.node');
var link = svg.selectAll('.link');

d3.json('js/skillsTree.json', function(json) {
  root = json;
  root.fixed = true;
  compress(root);
});

function update() {
  var nodes = flatten(root);
  var links = d3.layout.tree().links(nodes);

  force
    .nodes(nodes)
    .links(links)
    .charge(-420)
    .start();

  /*
  link = svg.selectAll('line.link')
    .data(links, function(d) { return d.target.id });

  link.enter()
    .insert('svg:line', '.node')
    .attr('class', 'link')
    .attr('x1', function(d) { return d.source.x; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x; })
    .attr('y2', function(d) { return d.target.y; });

  link.exit().remove();
  /**/

  node = svg.selectAll('image.node')
    .data(nodes, function(d) { return d.id });

  node.enter()
    .append('image')
    .attr('class', 'node')
    .attr('xlink:href', function(d) {
      if (d.image) {
        return d.image;
      } else {
        return 'https://mdn.mozillademos.org/files/2917/fxlogo.png';
      }
    })
    .attr('x', function(d) { return d.x })
    .attr('y', function(d) { return d.y })
    .attr('height', 36)
    .attr('width', 36)
    .on('click', click)
    .call(force.drag);

  node.exit().remove();
}

function tick() {
  link
    .attr('x1', function(d) { return d.source.x; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x; })
    .attr('y2', function(d) { return d.target.y; });

  node
    .attr('x', function(d) { return d.x })
    .attr('y', function(d) { return d.y });
}

function color(d) {
  return d._children ? "#3182bd" : "#c6dbef";
}

function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
}

function compress(d) {
  if (d.children) {
    d.children.forEach(compress);
    toggle(d);
  }
}

function click(d) {
  if (!d3.event.defaultPrevented) {
    toggle(d);
  }
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

  return nodes;
}
