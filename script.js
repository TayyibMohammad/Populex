import Chart from 'chart.js/auto';
// npx vite dev

alert("scroll (if you have to) to the bottom to stop the simulation at any time and get the results")

let size=0

const defaultLifeSpan=50
const defaultMetabolismInverse=50
const defaultMultiplyEvery=50
const defaultMultiplyFactor=5
const defaultPopulationInital=10

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let organisms_list=[]

let add_btn=document.getElementsByClassName("add")[0]
add_btn.addEventListener("click", () => {
    let organism_name=document.getElementById("add-input").value
    document.getElementById("add-input").value=""
    
    // bola tha react seekh lae(just ignore this piece of shit)
    // *****************************************************
    let organism=document.createElement("div")
    organism.classList.add("organism")

    let organism_name_html=document.createElement("p")
    organism_name_html.innerText=organism_name
    organism.appendChild(organism_name_html)
    
    let organism_prop=document.createElement("button")
    organism_prop.classList.add("settings")
    let r_value=Math.random()*255
    let g_value=Math.random()*255
    let b_value=Math.random()*255
    let color=`rgb(${r_value},${g_value},${b_value})`
    organism_prop.style.backgroundColor = color
    organism.appendChild(organism_prop)
    
    document.getElementById("list").appendChild(organism)
    // ****************************************************
    // haan bolo kya bol rahe the
    let organism_info={
      "rank":organisms_list.length,
      "name":organism_name,
      "color":color,
      "multiplyEvery": defaultMultiplyEvery,
      "multiplyFactor": defaultMultiplyFactor,
      "metabolism_inverse": defaultMetabolismInverse,
      "lifeSpan": defaultLifeSpan,
      "populationInitial": defaultPopulationInital
    }

    organisms_list.push(organism_info)

    addOrganismProp(organism_name, organisms_list.length);
    size+=1;

})

// display settings for each organism

const addOrganismProp = (Name, Rank) => {
    const parent=document.getElementById("params_adjust")

    let props=document.createElement("div")
    props.classList.add("props")
    console.log("_"+toString(Rank))
    props.classList.add(`_${Rank}`)
    
    props.innerHTML=`
        <p class="name">${Name}</p>
        <p class="rank">${Rank}</p>
        <div class="prop">
          <p>Multiply Every</p>
          <input type="range" min="1" max="100" class="${Rank} multiplyEvery">
        </div>
        <div class="prop">
          <p>Multiplying Factor</p>
          <input type="range" min="1" max="10" class="${Rank} multiplyFactor">
        </div>
        <div class="prop">
          <p>Metabolism Inverse</p>
          <input type="range" min="1" max="100" class="${Rank} metabolism_inverse">
        </div>
        <div class="prop">
          <p>Life Span</p>
          <input type="range" min="1" max="100" class="${Rank} lifeSpan">
        </div>
        <div class="prop">
          <p>Population Initial</p>
          <input type="range" min="1" max="100" class="${Rank} populationInitial">
        </div>
    `

    parent.appendChild(props)

    let all_sliders=parent.querySelectorAll('input')
    
    Array.from(all_sliders).forEach(slider => {
        slider.addEventListener("change", () => {
          let slider_value=slider.value
          let slider_rank=parseInt(slider.classList[0])

          organisms_list[slider_rank-1][slider.classList[1]]=slider_value

          // console.log(slider_value)
        })
    });
    
}

function getRandomCoordinate(min, max) {
    return Math.random() * (max - min) + min;
}

const canvas = document.getElementById('world');
const ctx = canvas.getContext('2d');

const circleRadius = 0.5; // Define your circle's radius

// Function to generate a random point within canvas bounds

const generateRandomPoint = () => {
    const minX = circleRadius;
    const maxX = canvas.width - circleRadius;
    const minY = circleRadius;
    const maxY = canvas.height - circleRadius;

    const randomX = getRandomCoordinate(minX, maxX);
    const randomY = getRandomCoordinate(minY, maxY);

    return [randomX, randomY];
}

let all_organisms={}

let data={}
const initialConditions = (organisms_list) => {
  for (let i=0; i<organisms_list.length;i++){
    all_organisms[organisms_list[i]["name"]]=[]
    data[organisms_list[i]["name"]]=[]
    for (let j=0; j<organisms_list[i]["populationInitial"]; j++){
      all_organisms[organisms_list[i]["name"]].push({
        "rank":organisms_list[i]["rank"],
        "posX":generateRandomPoint()[0],
        "posY":generateRandomPoint()[1],
        "lifeTick":0,
        "metabolismTick": 0,
        "multiplyTick": 0,
        "color":organisms_list[i]["color"]
      })
    }
  }
}

const Multiply = (all_organisms, organisms_list) => {
  for(let organism_type in all_organisms){
    for (let organism in all_organisms[organism_type]){
      let ran=(Math.random()*6)-3
      // console.log(ran)
      // console.log(all_organisms[organism_type][organism]["multiplyTick"])
      if(all_organisms[organism_type][organism]["multiplyTick"] >= (parseInt(organisms_list[all_organisms[organism_type][organism]["rank"]]["multiplyEvery"]) + ran )){
        all_organisms[organism_type][organism]["multiplyTick"]=0
        for(let i=0;i<organisms_list[all_organisms[organism_type][organism]["rank"]]["multiplyFactor"];i++){
          
            // ... (inside the inner for loop of the Multiply function)
          all_organisms[organism_type].push({
              "rank": all_organisms[organism_type][organism]["rank"], // Fix here
              "posX": generateRandomPoint()[0],
              "posY": generateRandomPoint()[1],
              "lifeTick": 0,
              "metabolismTick": 0,
              "multiplyTick": 0,
              "color": organisms_list[all_organisms[organism_type][organism]["rank"]]["color"] // also fix here
          });
        }
      }
    }
  }
}



let start_btn=document.getElementsByClassName("start")[0]
start_btn.addEventListener("click", () => {
  
  initialConditions(organisms_list)
  // Select all elements with type="range"
  const rangeInputs = document.querySelectorAll('input[type="range"]');

  // Loop through each element and set the disabled property
  rangeInputs.forEach(rangeInput => {
    rangeInput.disabled = true;
  });

  draw(all_organisms)

  simulation()


})

const draw = (organisms_list) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for(let organism_type in organisms_list){

    for (let organism in organisms_list[organism_type]){
      ctx.beginPath();
      ctx.arc(organisms_list[organism_type][organism]["posX"], organisms_list[organism_type][organism]["posY"], circleRadius, 0, 2 * Math.PI);
      ctx.fillStyle = organisms_list[organism_type][organism]["color"];
      ctx.fill();
    }
    
  }
}

const MoveOneTick = (organisms_list) => {
  for(let organism_type in organisms_list){
    for (let organism in organisms_list[organism_type]){
      organisms_list[organism_type][organism]["posX"]+=Math.random()*(4)-2
      organisms_list[organism_type][organism]["posY"]+=Math.random()*(4)-2
      organisms_list[organism_type][organism]["posX"]%=canvas.width
      organisms_list[organism_type][organism]["posY"]%=canvas.height
      organisms_list[organism_type][organism]["lifeTick"]++
      organisms_list[organism_type][organism]["metabolismTick"]++
      organisms_list[organism_type][organism]["multiplyTick"]++
    }
  }
}


const die = (all_organisms, organisms_list) => {
  // Loop through each type of organism (e.g., "Alice", "Bob") in all_organisms.
  for (const organism_type in all_organisms) {
    // A good practice to ensure the loop only considers properties of the object itself.
    if (Object.prototype.hasOwnProperty.call(all_organisms, organism_type)) {
      
      const current_organisms_array = all_organisms[organism_type];

      // Use the filter() method to create a new array with only living organisms.
      const updated_organisms_array = current_organisms_array.filter(organism => {
        // Find the corresponding species information using the rank.
        // Subtract 1 from the rank because organisms_list is a 0-indexed array.
        const organism_info = organisms_list[organism.rank];
        // console.log("life_tick: ", organism.lifeTick)
        // console.log("life span: ", organism_info.lifeSpan)
        // If the organism's lifeTick has reached or exceeded its lifespan, it dies.
        if (organism_info && (parseInt(organism.lifeTick) >= parseInt(organism_info.lifeSpan)+(Math.random()*6)-3)) {
          return false; // This organism will be filtered out (removed).
        }

        return true; // This organism lives and will be kept in the new array.
      });

      // Replace the old array with the new one containing only the living organisms.
      all_organisms[organism_type] = updated_organisms_array;
    }
  }
};

const record = (all_organisms) => {
  for(let organism_type in all_organisms){
    data[organism_type].push(all_organisms[organism_type].length)
  }
}

const RandomOrgType = (rank, size) => {
  let random_index=Math.random()*((size)-(rank+1))+rank
  return Math.ceil(random_index)
}

const RandomOrg = (size) => {
  let random_index=Math.random()*size
  return Math.floor(random_index)
}

const eat = (all_organisms, organisms_list) => {
  // Use a different loop structure to avoid issues with deleting while iterating.
  // Object.values() returns an array of the object's property values.
  for (const organism_type_name of Object.keys(all_organisms)) {
    // We'll create a new array to hold the survivors.
    const survivors = [];
    const current_organisms = all_organisms[organism_type_name];
    
    // It's safer to loop over a copy or use a `while` loop that doesn't rely on indexes
    for (const organism of current_organisms) {
      const organism_rank = organism.rank;
      const organism_info = organisms_list[organism_rank];
      
      // Check if the organism's metabolism tick has reached its threshold.
      if (organism.metabolismTick >= parseInt(organism_info.metabolism_inverse)) {
        organism.metabolismTick = 0; // Reset metabolism tick for the next cycle.
        
        // Find a random prey type that is not the same as the predator.
        let prey_type_name = null;
        const all_organism_types = Object.keys(all_organisms);
        
        // Loop until a different type with a non-zero population is found.
        while (true) {
          const randomIndex = Math.floor(Math.random() * all_organism_types.length);
          prey_type_name = all_organism_types[randomIndex];

          if (prey_type_name !== organism_type_name && all_organisms[prey_type_name].length > 0) {
            break; // Found a valid prey type.
          }
          // If no other organisms exist, the predator starves.
          if (all_organism_types.length <= 1 || all_organisms[prey_type_name].length === 0) {
             console.log("This organism is going to starve", organism_type_name);
             organism.lifeTick = parseInt(organism_info.lifeSpan) + 3; // Starve to death
             survivors.push(organism); // Push the starving organism to survivors
             break; // Exit the while loop
          }
        }
        
        if (prey_type_name !== null) {
          // If a prey organism was found, we will remove one.
          const prey_list = all_organisms[prey_type_name];
          const prey_index = Math.floor(Math.random() * prey_list.length);
          prey_list.splice(prey_index, 1); // Remove the eaten organism.
          survivors.push(organism); // The predator survives to the next tick.
        }
      } else {
        // If the metabolism tick isn't up, the organism survives.
        survivors.push(organism);
      }
    }
    // Update the original array with the survivors.
    all_organisms[organism_type_name] = survivors;
  }
};

let shouldStop=false

let stop = document.getElementsByClassName('stop')[0]
stop.addEventListener('click', () => {
  shouldStop=true
})

let textP=document.getElementsByClassName('time')[0]


// *********************main**********************************************
const simulation =  async () => {
  
  let i=0;
  while(i<1000 && !shouldStop){
    textP.innerText=`time = ${i}`
    record(all_organisms)
    eat(all_organisms, organisms_list)
    MoveOneTick(all_organisms)
    die(all_organisms, organisms_list)
    Multiply(all_organisms, organisms_list)
    draw(all_organisms)
    // console.log(all_organisms["Alice"].length)
    await delay(10)
    i+=1
  }

  prepare(labels_x_time, datasets_y_charts, data)
  displayCharts(datasets_y_charts, labels_x_time)
}
// ******************main end**********************************************


let labels_x_time = [];
let datasets_y_charts = [];

const prepare = (labels_x_time, datasets_y_charts, data) => {
  // Correctly populate the x-axis labels with a simple count.
  // We'll use a for loop to add numerical strings.
  // This loop assumes your simulation runs for 1000 "ticks" or time steps.
  for (let i = 0; i < 1000; i += 1) {
    labels_x_time.push(i.toString());
  }
  

  // Populate the datasets for the chart.
  // This part of your code was mostly correct.
  for (let organism_type in data) {
    let single_dataset = {};
    single_dataset.type = "line";
    single_dataset.label = organism_type;
    single_dataset.data = data[organism_type];
    datasets_y_charts.push(single_dataset);
  }
};

const context = document.getElementById("result");

const displayCharts = (data_y, data_x) => {
  // Check if the canvas element exists before trying to create a chart.
  if (!context) {
    console.error("Canvas element with ID 'result' not found.");
    return;
  }

  const mixedChart = new Chart(context, {
    data: {
      datasets: data_y,
      labels: data_x,
    },
    // Adding options here can customize your chart,
    // like giving it a title or scaling the axes.
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (in ticks)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Population",
          },
          beginAtZero: true,
        },
      },
    },
  });
};









