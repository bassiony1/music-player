

let shuffle = false
let paused = true
let volume = true

const track =document.querySelector('audio')
let seek_pointer = document.querySelector('.seek_pointer');
let seeker = document.querySelector('.seeker')
let pause_btn = document.querySelector('[data-pause]') 
let back_btn = document.querySelector('[data-back]')
let next_btn = document.querySelector('[data-next]')
let shuffle_btn = document.querySelector('[data-shuffle]')
const backgrounds = ["media/aizenbackground.png" , 'media/ichigobackground.jpg',"media/orihimebackground.jpg" , 'media/byakuyabackground.jpg',"media/ulquiorrabackground.jpg", "media/grimjawbackground.jpg"]
const playerImages = ["media/aizen.png" , "media/ichigo.png" ,"media/orihime.png", 'media/byakuya.png','media/Ulquiorra.jpg',"media/grimjaw.jpg"]
const playertracks = ['media/aizen.mpeg', 'media/ichigo.mpeg', "media/orihime.mpeg",'media/byakuya.mpeg' , 'media/Ulquiorra.mpeg',"media/grimjaw.mpeg"]
let selected_character = 0

let x ;

shuffle_btn.addEventListener('click' , (e)=> {
    e.target.classList.toggle('active')
    shuffle = !shuffle
})
document.querySelectorAll('[data-tooglecontainer]').forEach((c)=>{
    c.addEventListener('click' , (e)=> {
        c.classList.toggle('active')
    })
})

pause_btn.addEventListener('click',(c)=>{
    
    if (paused) {
        track.play()
       
    }else {
        track.pause()
    }

    paused = !paused
    
})
document.querySelector('[data-volume]').addEventListener('click',(c)=>{
    if(volume){
        track.volume = 0
    }else {
        track.volume = 1
    }
    volume = !volume
   
})

next_btn.addEventListener('click' , (e)=>{

    e.target.style.pointerEvents = "none"
    if (shuffle) {
       let  rand = Math.ceil(Math.random()*100)%(playerImages.length)
      
        while (selected_character === rand ||  selected_character+1 === rand) {
            rand = Math.ceil(Math.random()*100)%(playerImages.length)
        }

        selected_character =  rand
    }else 
    {
        selected_character = (selected_character+1)% (playerImages.length)
    }
    document.body.style.backgroundImage = `url(${backgrounds[selected_character]})`
    document.querySelector('[data-playerimg]').style.backgroundImage = `url(${playerImages[selected_character]})`
    track.src = playertracks[selected_character]
    setTimeout(()=>e.target.style.pointerEvents = "auto" , 1000)
    if (!paused) { 
        track.play()
        
    }

})

back_btn.addEventListener('click' , (e)=>{

    e.target.style.pointerEvents = "none"

    selected_character = (selected_character-1)
    if (selected_character == -1) {
        selected_character = playerImages.length-1
    }
    document.body.style.backgroundImage = `url(${backgrounds[selected_character]})`
    document.querySelector('[data-playerimg]').style.backgroundImage = `url(${playerImages[selected_character]})`
    track.src = playertracks[selected_character]
    setTimeout(()=>e.target.style.pointerEvents = "auto" , 1000)
    if (!paused) { 
        track.play()
    }
})

track.addEventListener('play', ()=> {
      x = setInterval(()=> {
            let new_position = `${((Math.round((track.currentTime/track.duration)*10000))/100)%100}%`
           
              seek_pointer.style.setProperty('--seek-postion',`${new_position}`)
              seeker.style.setProperty('--seeker-width',`${new_position}`)
        },400)
})
track.addEventListener('ended' , ()=> {
    if (selected_character === playertracks.length-1 && !shuffle) {
        paused = true 
        next_btn.click()  
        pause_btn.classList.remove('active')
    }else {
        next_btn.click()
    }
    
})

track.addEventListener('pause', ()=>{
    clearInterval(x)

})

seeker.addEventListener('click' ,  (e)=> {
    
    track.currentTime =  (track.duration)* ((e.layerX/e.target.clientWidth)*100)/100
    if (paused)
        pause_btn.click()
})


document.addEventListener('mouseup', () => {
    
    document.removeEventListener('mousemove' , handlemouseover , false)
})



seek_pointer.addEventListener('mousedown' , (e)=> {
    e.preventDefault()    
    document.addEventListener('mousemove',handlemouseover)
})

function handlemouseover(e) {
    e.preventDefault()
    let pos = (e.layerX) 
        if (pos < seek_pointer.clientWidth) {
            return
        }
       if ( pos  > seeker.clientWidth) {
            pos = seeker.clientWidth
       }else if (e.pageX < seeker.getBoundingClientRect().left ){
            pos = 0 
       }
       let ctime = (track.duration)* ((pos/seeker.clientWidth)*100)/100
       track.currentTime =  ctime ? ctime : 0 
       if (paused)
       pause_btn.click()
    }


