class Recta {

    constructor(textura,ancho,largo,alto,tamBorde,radBorde,escena){

        this.ancho = ancho;
        this.largo = largo;
        this.alto = alto;
        this.tamBorde = tamBorde;
        this.radBorde = radBorde;

        this.textura = textura;

        this.crearGeometria();

        this.crearMesh();
        
        escena.add(this.carretera);
        escena.add(this.filaDerecha);
        escena.add(this.filaIzquierda);
    }


    crearGeometria(){
        this.crearCarretera();
        this.crearArrayCilindros();
    }

    crearCarretera(){
        this.geometriaCarretera = new THREE.BoxGeometry(this.ancho,this.alto,this.largo);
        //this.geometriaCarretera.translate(0,-this.alto/2,0);
    }

    crearArrayCilindros(){

        this.CilindrosIzquierda = new THREE.Object3D();
        this.crearFila(this.CilindrosIzquierda);
        
        
        this.CilindrosDerecha = new THREE.Object3D();
        this.crearFila(this.CilindrosDerecha);

    }

    crearFila(padre){
        var recorrido = (this.largo/2)-this.radBorde;
        for(let i = 0; i<(this.largo/(this.radBorde*2)); i++){
            var gCil = new THREE.CylinderGeometry(this.radBorde,this.radBorde,this.tamBorde,6,1);
            gCil.translate(0,0,recorrido);

            var color =  Math.random() * 0xffffff;
            var materialBorde = new THREE.MeshPhongMaterial({color : color, opacity : 0.5, map: this.textura});

            var cil = new THREE.Mesh(gCil,materialBorde);
            recorrido -= this.radBorde*2;
            padre.add(cil);
        }
    }


    crearMesh(){

        var materialPista = Physijs.createMaterial(
            new THREE.MeshPhongMaterial({color : 0x111111, shininess: 1}),
            10, // alta friccion
            0 // bajo rebote
        );

        
        var materialBorde = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({transparent : true , opacity : 0}),
            .1, // baja friccion
            .5 // alto rebote
        );

        this.carretera = new Physijs.BoxMesh(this.geometriaCarretera,materialPista,0,100,100,100);
        this.carretera.position.y = -this.alto/2;
        this.carretera.__dirtyPosition=true;
    
        var bounding = new THREE.BoxHelper(this.CilindrosDerecha);
        bounding.geometry.computeBoundingBox();
        var bb = bounding.geometry.boundingBox;
        var cajaColisionD = new THREE.BoxGeometry(bb.max.x-bb.min.x , bb.max.y-bb.min.y , bb.max.z-bb.min.z);
        this.filaDerecha = new Physijs.BoxMesh(cajaColisionD,materialBorde,0);

        this.filaDerecha.position.x=(this.ancho/2 - this.radBorde);
        this.filaDerecha.position.y=(this.tamBorde/2);
        this.filaDerecha.__dirtyPosition=true;

        this.filaDerecha.add(this.CilindrosDerecha);

        var cajaColisionI = new THREE.BoxGeometry(bb.max.x-bb.min.x , bb.max.y-bb.min.y , bb.max.z-bb.min.z);

        this.filaIzquierda = new Physijs.BoxMesh(cajaColisionI,materialBorde,0);
        this.filaIzquierda.position.x=(-this.ancho/2 + this.radBorde);
        this.filaIzquierda.position.y=(this.tamBorde/2);
        this.filaIzquierda.__dirtyPosition=true;

        this.filaIzquierda.add(this.CilindrosIzquierda);


    }

    rotar(indice){
        var angulo = 0;
        if(indice == 1){
            angulo = Math.PI/2;
            this.filaIzquierda.position.z += -this.ancho/2+ this.radBorde;
            this.filaIzquierda.position.x -= -this.ancho/2 + this.radBorde/2;
            this.filaDerecha.position.z += this.ancho/2- this.radBorde;
            this.filaDerecha.position.x -= this.ancho/2 - this.radBorde/2;
        }
        this.filaIzquierda.rotation.y += angulo
        this.filaDerecha.rotation.y += angulo

        

        this.filaIzquierda.__dirtyRotation = true;
        this.filaDerecha.__dirtyRotation = true;
        this.filaIzquierda.__dirtyPosition = true;
        this.filaDerecha.__dirtyPosition = true;

        this.carretera.rotation.y += angulo
        this.carretera.__dirtyRotation = true;
    }

    rotarX(angulo){
        this.filaIzquierda.rotation.x = angulo
        this.filaDerecha.rotation.x = angulo
        this.carretera.rotation.x = angulo
        this.carretera.__dirtyRotation = true;
        this.filaIzquierda.__dirtyRotation = true;
        this.filaDerecha.__dirtyRotation = true;
    }

    mover(x,y,z){
        this.filaDerecha.position.x += x;
        this.filaIzquierda.position.x += x;
        this.carretera.position.x += x;
        
        this.filaDerecha.position.y += y;
        this.filaIzquierda.position.y += y;
        this.carretera.position.y += y ;
        
        this.filaDerecha.position.z += z;
        this.filaIzquierda.position.z += z;
        this.carretera.position.z += z;

        this.filaDerecha.__dirtyPosition = true;
        this.filaIzquierda.__dirtyPosition = true;
        this.carretera.__dirtyPosition = true;

    }

} 