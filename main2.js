document.querySelector('#new').addEventListener('click',register)
document.querySelector('#report').addEventListener('click',displayReport)
document.querySelector('#acceptContract').addEventListener('click', contractAccept)
document.querySelector('#waypoint').addEventListener('click', waypoint)
document.querySelector('#findYard').addEventListener('click', findYard)
document.querySelector('#viewContract').addEventListener('click', viewContract)
document.querySelector('#shopShips').addEventListener('click', shopShips)
document.querySelector('#buyShip').addEventListener('click', buyShip)
document.querySelector('#listShips').addEventListener('click', listShips)
document.querySelector('#clear').addEventListener('click',clear)
document.querySelector('#orbitShip').addEventListener('click',orbitShip)
document.querySelector('#searchSystem').addEventListener('click',searchSystem)
document.querySelector('#shipMove').addEventListener('click',shipMove)



//start
//agent
//systemSymbol
//waypointSymbol
//contractId
//contractStatus


//variables--------------------------------------
const launchText= document.querySelector('[data-launch]')
const reportText=document.querySelector('[data-report]')
const viewContractText=document.querySelector('[data-viewContract]')
const logBox = document.querySelector('[data-log]')
const shipSelect = document.querySelector('[data-orbitShip]')
const destination = document.querySelector('[data-destination]')

const waypointSymbol=localStorage.getItem('waypointSymbol')
const systemSymbol = localStorage.getItem('systemSymbol')


//Functions and beyond!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function clear(){
    logBox.innerText=''
}


async function register(){
    const callSign=document.querySelector('[data-callsign]').value
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            symbol: callSign,
            faction: "COSMIC",
        }),
        };
        try{
        const response= await fetch('https://api.spacetraders.io/v2/register', options)
        const data=await response.json()
        console.log(data)

        localStorage.setItem('start', JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem('start')))

        localStorage.setItem('callSign', callSign)
        console.log(localStorage.getItem('callSign'))

        localStorage.setItem('token', data.data.token)
        console.log(localStorage.getItem('agent'))

        localStorage.setItem('contractId', data.data.contract.id)
        console.log(localStorage.getItem('contractId'))

        localStorage.setItem('systemSymbol', data.data.ship.nav.systemSymbol)
        console.log(localStorage.getItem('systemSymbol'))

        localStorage.setItem('waypointSymbol',data.data.ship.nav.waypointSymbol)
        console.log(localStorage.getItem('waypointSymbol'))

        localStorage.setItem('contractStatus',data.data.contract.accepted)
        console.log(localStorage.getItem('contractStatus'))
        
        logBox.innerText+=`Congratualtions captain ${callSign}, adventure awaits!\n`

        }catch(error){
            console.log(error)
            launchText.innerText=`Failure to launch, see ${error}`
        }
    }

async function displayReport(){
    
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        
    };
    try{
        const response= await fetch('https://api.spacetraders.io/v2/my/agent', options)
        const data=await response.json()
        console.log(data)
        document.querySelector('[data-report]').innerText=`Credits: ${data.data.credits}`
        logBox.innerText+=JSON.stringify(data.data)+'\n'
        }catch(error){
            console.log(error)
            reportText.innerText=`See error: ${error}`
        }
}
//---------------------LOCATION
async function waypoint(){
    const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      };
    try{

        const response= await fetch(`https://api.spacetraders.io/v2/systems/${systemSymbol}/waypoints/${waypointSymbol}`, options)
        const data= await response.json()
        console.log(data)
        logBox.innerText+=JSON.stringify(data.data.symbol)+'\n'
        data.data.traits.forEach(element=>{
        logBox.innerText+= JSON.stringify(element)+'\n'})
        localStorage.setItem('x',data.data.x)
        localStorage.setItem('y',data.data.y)

    }catch(error){
        console.log(error)
    }
    
}
///////------------------------------CONTRACT
async function viewContract(){


const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  };
try{
    const response = await fetch('https://api.spacetraders.io/v2/my/contracts', options)
    const data=await response.json()
    console.log(data)
    localStorage.setItem('contractStatus', data.data[0].accepted)
    localStorage.setItem('contractFulfillment', data.data[0].fulfilled)
    localStorage.setItem('contractId', data.data[0].id)
    localStorage.setItem('contractTerms', data.data[0].terms)
    logBox.innerText+=JSON.stringify(data)+'\n'

}catch(error){
    console.log(error)
}  
}


async function contractAccept(){
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      };
    try{
        
        console.log(localStorage.getItem('contractStatus'))
        if((localStorage.getItem('contractStatus'))==('false')){
            const response= await fetch(`https://api.spacetraders.io/v2/my/contracts/${localStorage.getItem('contractId')}/accept`, options)
            const data=await response.json()
            console.log(`contract accepted`)
            console.log(data)
            logBox.innerText+='Contract Newly Accepted\n'
            localStorage.setItem('contractStatus', data.data.contract.accepted)
        }else if(localStorage.getItem('contractStatus')==('true')){
            logBox.innerText+='Contract Already Accepted'+'\n'
            console.log(localStorage.getItem('contractStatus'))
        }else{
            logBox.innerText+='Contract Error, View Contract for more information.'+'\n'
        }
        
        
    }catch(error){
        console.log(error)
    }  
}

//----------------Find Shipyard    

async function findYard(){
    const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      };
    try{
        const response= await fetch(`https://api.spacetraders.io/v2/systems/${localStorage.getItem('systemSymbol')}/waypoints`, options)
        const data=await response.json()
        console.log(data)
        data.data.forEach(element => {
            const regex=/SHIPYARD/
            element.traits.forEach(trait=>{
                if(regex.test(trait.symbol)){
                    console.log(element)
                    localStorage.setItem('shipyard',element.symbol)
                }
            })
        });
        
    }catch(error){
        console.log(error)  
    } 
}
// View Available ships
async function shopShips(){
    const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      };
    try{
        const response = await fetch(`https://api.spacetraders.io/v2/systems/${localStorage.getItem('systemSymbol')}/waypoints/${localStorage.getItem('shipyard')}/shipyard`, options)
        const data=await response.json()
        console.log(data)
        logBox.innerText+=JSON.stringify(data.data.shipTypes)+'\n'
    }catch(error){
        console.log(error)
    }
}









//-------------Purchase Ship
async function buyShip(){
    const shipPick=document.querySelector('[data-pickShip]').value
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          shipType: shipPick,
          waypointSymbol: localStorage.getItem('shipyard'),
        }),
      };
    try{
        const response = await fetch('https://api.spacetraders.io/v2/my/ships', options)
        const data = await response.json()
        console.log(data)
    }catch(error){
        logBox.innerText+='Ship Purchase Error Detected'+'\n'
        console.log(error)
    }
}


//List Ships

async function listShips(){
    const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      };
    try{
        const response = await fetch(`https://api.spacetraders.io/v2/my/ships`, options)
        const data=await response.json()
        console.log(data)
        const shipNum = data.data.length
        console.log(shipNum)
        data.data.forEach(element=>{
            logBox.innerText+= element.symbol+'\n'
        })
    }catch(error){
        console.log(error)
    }
}

//Launch ship into orbit
async function orbitShip(){
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      };

    try{
        console.log(shipSelect.value)
        const response = await fetch(`https://api.spacetraders.io/v2/my/ships/${shipSelect.value}/orbit`, options)
        const data = await response.json()
        console.log(data)

    }catch(error){
        console.log(error)
    }
}

//Send ship to waypoint
async function shipMove(){
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          waypointSymbol: destination.value,
        }),
      };

      try{
        const response = await fetch(`https://api.spacetraders.io/v2/my/ships/${shipSelect.value}/navigate`, options)
        const data= await response.json()
        console.log(data)
      }catch(error){
        console.log(error)  
    }

}

//Scan for astroid field----------------
async function searchSystem(){
    const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      };
    try{
        const response= await fetch(`https://api.spacetraders.io/v2/systems/${localStorage.getItem('systemSymbol')}/waypoints`, options)
        const data=await response.json()
        console.log(data)
        data.data.forEach(element => {
            logBox.innerText+=JSON.stringify(element.symbol)+', '+JSON.stringify(element.type) +'\n'      
            })
        
        
    }catch(error){
        console.log(error)  
    }
} 

//Dock Ship-------------------------------






//Refuel Ship------------------



//Extract ores and minerals----------------------
