class Rampa{
    constructor(textura,ancho,largo,alto,tamBorde,radBorde,escena){

        this.largo = largo;

        var Rectas = new Recta(textura,ancho,this.largo,alto,tamBorde,radBorde,escena);

        var inclinacion = -Math.PI/18;

        this.mesh = Rectas;

        this.impulso = new Impulso(ancho-radBorde*4, radBorde*2, tamBorde/200,escena);
        this.impulso.position.set(0,-alto/4,this.largo/2-radBorde*2);
        this.impulso.rotation.y = Math.PI;
        this.impulso.__dirtyRotation = true;
        this.impulso.__dirtyPosition = true;

        this.rotarX(inclinacion);
        this.mover(0,Math.sin(Math.PI/18)*this.largo/2 - alto/2 ,0);
    }

    mover(x,y,z){
        this.mesh.mover(x,y,z);
        this.impulso.position.x += x;
        this.impulso.position.y += y;
        this.impulso.position.z += z;
        this.impulso.__dirtyPosition = true;
    }

    rotarX(inclinacion){
        this.mesh.rotarX(inclinacion);
        this.impulso.rotation.x = inclinacion;
        this.impulso.__dirtyRotation = true;
        this.impulso.position.y += Math.sin(Math.PI/18)*this.largo/2;
        this.impulso.__dirtyPosition = true;
    }

    
}

class Impulso{
    constructor(ancho , profundo, alto, escena){

        var textura = new THREE.TextureLoader().load("imagenes/pointer.gif");
        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set( 5, 1 );

        var material = new THREE.MeshStandardMaterial({map:textura});
        var materialP = Physijs.createMaterial(
            material,
            0,
            0
        );
        var geo = new THREE.BoxGeometry(ancho,alto,profundo);

        this.impulso = new Physijs.BoxMesh(geo,materialP,0);     

        escena.add(this.impulso);

        this.impulso.addEventListener('collision', function(objeto, v, r, n) {
            if(objeto.id >40) {
                escena.remove(this);
                var dir = escena.coche.direccion();
                var empuje = dir.normalize().multiplyScalar(7500);
                escena.coche.Chasis.applyCentralImpulse(empuje);
            }
        });
        return this.impulso;
    }
}