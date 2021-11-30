async function readJson(path) {
  const response = await fetch(path);
  const data = await response.json();
  return data;
}

async function init() {
  // json file generated with https://csvjson.com/csv2json
  const data = await readJson('fashion_table.json');
  let sourceData = data.map((d) => {
    return {
      cityName: d['value_chain_category_individual'],
      warmestMonth: d['current_percentage_of_emission'],
      coldestMonth: d ['value_chain_category_groups']
    };
  });
  // scaling function, thank you nicola :)) 
  function scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  console.log('sourceData: ', sourceData);
  console.log('arraylength: ', sourceData.length);
  const Ydisplacement = 150;
  const circlesXcoordinate = 100;
  const dataValueScaling = 1.3;

  // Create canvas
  const svg = d3 // Variable linking to D3 library
    .select('#d3') // Selects ID from html file
    .append('svg') // Creates svg
    .attr("width", 2000) // Width of svg
    .attr("height", sourceData.length * Ydisplacement + 100); // Height of svg

  // enters data into function
  const circlesWarmest = svg.selectAll('circlesWarmest').data(sourceData).enter();
  const circlesColdest = svg.selectAll('circlesColdest').data(sourceData).enter();
  const textLabel = svg.selectAll('textLabel').data(sourceData).enter();
  const lines = svg.selectAll('lines').data(sourceData).enter();
//draw lines between the cold and warm circels 
  lines
  .append('line')
  .style("stroke", "black")
  .style("stroke-width", 1)
  .attr("x1", 100)
  .attr("y1",(value,index) => {
    return index * Ydisplacement + circlesXcoordinate;
   })
  .attr("x2", 1090)
  .attr("y2",(value,index) => {
    return index * Ydisplacement + circlesXcoordinate;
   });
   // create main text
svg.append('text')
.attr('x', 50)
.attr('y', 20)
.attr('id', 'textColorCold')
.text('Coldest month of the year');
svg.append('text')
.attr('x', 1000)
.attr('y', 20)
.attr('id', 'textColorWarm')
.text('Warmest month of the year');
  // Creates circles for Warmest temperature
  circlesWarmest
    .append('circle')
    .attr('cx', (value, index) => {
      return  circlesXcoordinate + 1000;
    })
    .attr('cy', (value,index) => {
      return index * Ydisplacement + circlesXcoordinate;
    })
    .attr('r', (value, index) => {
      return scale(value.warmestMonth, -40, 40, 0, 40) * dataValueScaling;
    })
    .attr('id', 'colorSecondary');

  // Creates circles for Coldest temperature
  circlesColdest
    .append('circle')
    .attr('cx', (value, index) => {
      return  circlesXcoordinate;
    })
    .attr('cy', (value,index) => {
      return index * Ydisplacement + circlesXcoordinate;
    })
    .attr('r', (value, index) => {
      return  scale(value.coldestMonth, -40, 40, 0, 40) * dataValueScaling;
    })
    .attr('id', 'colorMain');

  // Create text city labels
  textLabel
    .append('text')
    .attr('x', 500)
    .attr('y', (value,index) => {
      return index * Ydisplacement + circlesXcoordinate;
    })
    .attr('id', 'textColorMain')
    .text((value, index) => {
      return value.cityName;
    })
    // text for cold temptraue 
    textLabel
    .append('text')
    .attr('x', 85)
    .attr('y', (value,index) => {
      return index * Ydisplacement + circlesXcoordinate + 70;
    })
    .attr('id', 'textColdTemp')
    .text((value, index) => {
      return value.coldestMonth;
    })
    // text for warm tempture
    textLabel
    .append('text')
    .attr('x', 1085)
    .attr('y', (value,index) => {
      return index * Ydisplacement + circlesXcoordinate + 70;
    })
    .attr('id', 'textWarmTemp')
    .text((value, index) => {
      return value.warmestMonth;
    })
       }




init();