const API_URL_RANDOM='https://api.thedogapi.com/v1/images/search?limit=3';
const API_URL_FAVOURITES='https://api.thedogapi.com/v1/favourites';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD='https://api.thedogapi.com/v1/images/upload';

const spanError=document.getElementById('error');

const form=document.querySelector("form");
const dropArea=document.querySelector("#drop-area");
const textoDropArea=document.querySelector("#drop-area p");
//const button=dropArea.querySelector('button');
let files;

archivoInput=document.querySelector("#archivo");




async function loadRandomDogs(){
    const res=await fetch(API_URL_RANDOM);
    const data=await res.json();
    console.log('Random');
    console.log(data);
    if(res.status !==200 ){
        spanError.innerHTML="Hubo un error"+res.status;
    }
    else{
        const img1 = document.querySelector('#imagen1');
        const img2 = document.getElementById('imagen2');
        const img3 = document.getElementById('imagen3');
        const btn1 = document.getElementById('button1');
        const btn2 = document.getElementById('button2');
        const btn3 = document.getElementById('button3');
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick=() => SaveFavouriteDog(data[0].id);
        btn2.onclick=() => SaveFavouriteDog(data[1].id);
        btn3.onclick=() => SaveFavouriteDog(data[2].id);
    }
}

async function loadFavoritesDogs(){
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
          'X-API-KEY': 'live_uFmIqsYBFi8XXYKQ06rFZsxWKM35hwHCfINUws2to8kkPuMdRQAKyQHkpaGF2lBB',
        },
      });
    const data=await res.json();
    console.log('Favorites');
    console.log(data);

    if(res.status !==200 ){
        spanError.innerHTML="Hubo un error"+res.status;
    }else{
        const seccionFavoritos=document.getElementById('favourites-dogs');
        console.log(seccionFavoritos);
        seccionFavoritos.innerHTML="";        
        const favouritesDogs=document.getElementById('favourites-dogs');
        const cardsContainer=document.createElement('div');
        cardsContainer.setAttribute("id","cards-container2");
        favouritesDogs.appendChild(cardsContainer);
        data.forEach(dog =>{
            const cardsContainer=document.getElementById('cards-container2');
            const dogCard=document.createElement('div');
            dogCard.classList.add('dog-card');

            const imgFavoriteDog=document.createElement('img');
            imgFavoriteDog.setAttribute("id","imagen1");
            imgFavoriteDog.src=dog.image.url;
            imgFavoriteDog.setAttribute('alt','Imagen de perro favorita');

            
            const dogInfo=document.createElement('div');
            dogInfo.classList.add('dog-info');

            const caja=document.createElement('div');

            const botonQuitarFavoritos=document.createElement('button');
            botonQuitarFavoritos.classList.add('btn1');
            const btnText=document.createTextNode('Quitar de favoritos');

            botonQuitarFavoritos.appendChild(btnText);
            botonQuitarFavoritos.onclick=() => deleteFavouriteDog(dog.id);
            caja.appendChild(botonQuitarFavoritos);
            dogInfo.appendChild(caja);
            dogCard.appendChild(imgFavoriteDog);
            dogCard.appendChild(dogInfo);
            cardsContainer.appendChild(dogCard);      
        })
    }

}

async function SaveFavouriteDog(id){
    const id2=id.toString();
    const res = await fetch(API_URL_FAVOURITES, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json', 
             'X-API-KEY': 'live_uFmIqsYBFi8XXYKQ06rFZsxWKM35hwHCfINUws2to8kkPuMdRQAKyQHkpaGF2lBB',           
           },
           body: JSON.stringify({
           image_id: id2

        }),
    });
     const data = await res.json();     
     console.log(res);
     if(res.status ==200 ){
        spanError.innerHTML="Se añadio correctamente a mis favoritos";
        loadFavoritesDogs();
     }
}

async function deleteFavouriteDog(id){
    
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
           method: 'DELETE',
           headers: {    
             'X-API-KEY': 'live_uFmIqsYBFi8XXYKQ06rFZsxWKM35hwHCfINUws2to8kkPuMdRQAKyQHkpaGF2lBB',
           },                           
    });
     const data = await res.json();
     if(res.status ==200 ){
        spanError.innerHTML="Se eliminó correctamente a mis favoritos";
        loadFavoritesDogs();
     }

}

//subir archivo inicio

form.addEventListener('click',e => {
    
    archivoInput.click();   
    console.log('Entro a onclick');
});
    
archivoInput.addEventListener("change",e =>{
    files=archivoInput.files;
    form.classList.add("active");
    showFiles(files);
    form.classList.remove("active"); 
    console.log('Entro a onchange');
});

form.addEventListener("dragover",(e)=>{
    e.preventDefault(); 
    textoDropArea.innerHTML='Soltar';
    form.classList.add("active");
    
        
});

form.addEventListener("dragleave",(e)=>{
    e.preventDefault(); 
    textoDropArea.innerHTML='Seleccionar';
    form.classList.remove("active");
    
        
});

dropArea.addEventListener("drop",(e)=>{
    e.preventDefault();          
    files=e.dataTransfer.files;
    showFiles(files);     
    form.classList.remove("active");
    textoDropArea.innerHTML='Seleccionar';
        
});

function showFiles(files){
    if(files.length === undefined){
        processFile(files);
    }else{
        for(const file of files){
            processFile(file);
        }
    }
}

function processFile(file){
    const docType=file.type;
    const validExtensions=['image/jpeg','image/jpg','image/png'];
    if(validExtensions.includes(docType)){
        //archivo valido
        const fileReader = new FileReader();
        const id=`file-${Math.random().toString(32).substring(7)}`;

        fileReader.addEventListener('load', e =>{
            const fileUrl = fileReader.result;
            const image = `
                <div id="${id}" class="file-container">
                    <img src="${fileUrl}" alt="${file.name}" width="50px">
                    <div class="status">
                        <span>${file.name}</span>
                        <span class="status-text">
                            Loading...
                        </span>
                    </div>
                </div>
            `;
            const html=document.querySelector("#preview").innerHTML;
            document.querySelector("#preview").innerHTML = image + html;
        });
        fileReader.readAsDataURL(file);
        uploadDogPhoto(file,id);
    }else{
        //archivo invalido
        alert("no es un archivo valido");
    }
}

async function uploadDogPhoto(file,id){    

    const formData=new FormData();
    formData.append("file",file);

    try {
        const res = await fetch(API_URL_UPLOAD,{
            method: 'POST',
            headers: {
               
                'X-API-KEY': 'live_uFmIqsYBFi8XXYKQ06rFZsxWKM35hwHCfINUws2to8kkPuMdRQAKyQHkpaGF2lBB',
            },
            body: formData,                
        });
        const data = await res.json();
        console.log(data);

        document.querySelector(`#${id} .status-text`).innerHTML = `<span class="success">Archivo subido correctamente...</span>`;
        SaveFavouriteDog(data.id);
    } catch (error) {
        document.querySelector(`#${id} .status-text`).innerHTML = `<span class="failure">El archivo no pudo subirse...</span>`;
    }    
}
//subir archivo fin

function cambiar(){
    var pdrs = document.getElementById('file-upload').files[0].name;
    document.getElementById('info').innerHTML = pdrs;
}
loadRandomDogs();
loadFavoritesDogs();