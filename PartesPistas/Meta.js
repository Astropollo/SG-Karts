class Meta{
    constructor(ancho , profundo, altoSuelo, escena){
        this.textura = new THREE.TextureLoader().load("imagenes/meta.jpg");
        this.textura.wrapS = THREE.RepeatWrapping;
        this.textura.wrapT = THREE.RepeatWrapping;
        this.textura.repeat.set( profundo, ancho );

        var material = new THREE.MeshPhongMaterial({map:this.textura});
        var materialP = Physijs.createMaterial(
            material,
            0,
            0
        );
        
        this.crearMetaSuelo(ancho, altoSuelo, profundo, materialP);

        this.metaS.addEventListener('collision', function(objeto, v, r, n) {
            if(objeto.id == 44){
                escena.cruzar();
            }
        });

        escena.add(this.metaS);

    }

    crearMetaSuelo(ancho, alto, profundo, material){
        var geo = new THREE.BoxGeometry(profundo,alto,ancho);

        this.metaS = new Physijs.BoxMesh(geo,material,0);     
    }


    mover(x,y,z){
        this.metaS.position.set(x,y,z);
        this.metaS.__dirtyPosition = true;
    }

}