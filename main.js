document.querySelector('#new').addEventListener('click',register)
document.querySelector('#report').addEventListener('click',displayReport)
document.querySelector('#contract').addEventListener('click', contractAccept)
document.querySelector('#waypoint').addEventListener('click', waypoint)
document.querySelector('#findYard').addEventListener('click', findYard)
document.querySelector('#viewContract').addEventListener('click', viewContract)
document.querySelector('#shopShips').addEventListener('click', shopShips)
document.querySelector('#buyShip').addEventListener('click', buyShip)
document.querySelector('#listShips').addEventListener('click', listShips)

//start
//agent
//systemSymbol
//waypointSymbol
//contractId
//contractStatus

const launchText= document.querySelector('[data-launch]')
const reportText=document.querySelector('[data-report]')
const viewContractText=document.querySelector('[data-viewContract]')

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

        localStorage.setItem('agent', data.data.token)
        console.log(localStorage.getItem('agent'))

        localStorage.setItem('contractId', data.data.contract.id)
        console.log(localStorage.getItem('contractId'))

        localStorage.setItem('systemSymbol', data.data.ship.nav.systemSymbol)
        console.log(localStorage.getItem('systemSymbol'))

        localStorage.setItem('waypointSymbol',data.data.ship.nav.waypointSymbol)
        console.log(localStorage.getItem('waypointSymbol'))

        localStorage.setItem('contractStatus',data.data.contract.accepted)
        console.log(localStorage.getItem('contractStatus'))
        
        launchText.innerText=`Congratualtions captain ${callSign}, adventure awaits!`

        }catch(error){
            console.log(error)
            launchText.innerText=`Failure to launch, see ${error}`
        }
    }

async function displayReport(){
    
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('agent')}`
        }
        
    };
    try{
        const response= await fetch('https://api.spacetraders.io/v2/my/agent', options)
        const data=await response.json()
        console.log(data)
        reportText.innerText=JSON.stringify(data.data)
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
          'Authorization': `Bearer ${localStorage.getItem('agent')}`
        },
      };
    try{
        const bulk=JSON.parse(localStorage.getItem('start'))
        console.log(bulk.data.ship.nav.waypointSymbol)
        const sys=bulk.data.ship.nav.systemSymbol
        const wayz=bulk.data.ship.nav.waypointSymbol
        const response= await fetch(`https://api.spacetraders.io/v2/systems/${sys}/waypoints/${wayz}`, options)
        const data= await response.json()
        console.log(data.data.systemSymbol)
        localStorage.setItem('systemSymbol',data.data.systemSymbol)
        console.log(localStorage.getItem('systemSymbol'))
        document.querySelector('[data-waypoint]').innerText=JSON.stringify(data.data)
    }catch(error){
        console.log(error)
    }
    
}
///////------------------------------CONTRACT
async function viewContract(){


const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('agent')}`
    },
  };
try{
    const response = await fetch('https://api.spacetraders.io/v2/my/contracts', options)
    const data=await response.json()
    console.log(data)
    viewContractText.innerText=JSON.stringify(data)

}catch(error){
    console.log(error)
}  
}


async function contractAccept(){
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('agent')}`
        },
      };
    try{
        
        console.log(localStorage.getItem('contractStatus'))
        if((localStorage.getItem('contractStatus'))==('false')){
            const response= await fetch(`https://api.spacetraders.io/v2/my/contracts/${localStorage.getItem('contractId')}/accept`, options)
            const data=await response.json()
            console.log(`contract data response`)
            console.log(data)
            console.log(localStorage.getItem('contractStatus'))
            document.querySelector('#contractStatus').innerText='Contract Newly Accepted'
            localStorage.setItem('contractStatus', 'true')
            console.log(localStorage.getItem('contractStatus'))
        }else{
            document.querySelector('#contractStatus').innerText='Contract Still Accepted'
            console.log(localStorage.getItem('contractStatus'))
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
          'Authorization': `Bearer ${localStorage.getItem('agent')}`
        },
      };
    try{
        const response= await fetch(`https://api.spacetraders.io/v2/systems/${localStorage.getItem('systemSymbol')}/waypoints`, options)
        const data=await response.json()
        data.data.forEach(element => {
            const regex=/SHIPYARD/
            console.log(element.traits)
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
          'Authorization': `Bearer ${localStorage.getItem('agent')}`
        },
      };
    try{
        const response = await fetch(`https://api.spacetraders.io/v2/systems/${localStorage.getItem('systemSymbol')}/waypoints/${localStorage.getItem('shipyard')}/shipyard`, options)
        const data=await response.json()
        console.log(data)
        document.querySelector('[data-shopShips]').innerText=JSON.stringify(data.data.shipTypes)
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
          'Authorization': `Bearer ${localStorage.getItem('agent')}`
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
        console.log(error)
    }
}


//List Ships

async function listShips(){
    const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('agent')}`
        },
      };
    try{
        const response = await fetch(`https://api.spacetraders.io/v2/my/ships`, options)
        const data=await response.json()
        console.log(data)
        const shipNum = data.data.length
        console.log(shipNum)
        data.data.forEach(element=>{
            document.querySelector('[data-listShips]').innerText+= element.symbol+', '
        })
        for(let i=0;i<shipNum;i++){

        }
        // document.querySelector('[data-listShips]').innerText=JSON.stringify(data.data.symbol)
    }catch(error){
        console.log(error)
    }
}
