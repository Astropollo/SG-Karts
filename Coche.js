class Coche {

    constructor(velocidad,potencia,unidades,escena){

        this.unidades= unidades;

        this.velocidad = velocidad;
        this.potencia = potencia;

        this.zeroSpeed = new THREE.Vector3();

        this.reloj = new THREE.Clock();

        this.freno = false;

        var unidades_c = unidades * 0.1;

        this.forward = false;
        this.backward = false;
        this.right = false;
        this.left = false;

        this.anguloVolante = 0;

        this.crearChasis(unidades_c);

        this.añadirChasis(unidades_c,escena);

        this.crearRuedas(unidades_c);

        this.añadirRuedas(escena);

        this.crearRestricciones(escena);

        this.crearLuz(unidades_c);

    }

    reiniciar(){
        var dir = this.direccion();
        this.Chasis.position.y += 10;
        this.Chasis.rotation.x = 0;
        this.Chasis.rotation.z = 0;
        this.Chasis.__dirtyRotation = true;
        this.Chasis.__dirtyPosition = true;
    }

    crearLuz(unidades_c){

        this.luz = new THREE.PointLight(0xf5f5f5, 0.7);
        this.Chasis.add(this.luz);
        this.luz.position.set(0,10*unidades_c,0);
    }



    crearChasis(unidades_c){

        var loader = new THREE.TextureLoader();
        var textura = loader.load("imagenes/volante.png");
        var bumpmap = loader.load("imagenes/bumpMap.png");
        var bumpmap2 = loader.load("imagenes/bumMap2.png");

        var mat = new THREE.MeshLambertMaterial({color : 0xFF0000});
        var mat_v = new THREE.MeshPhongMaterial({ map: textura , bumpMap : bumpmap2, bumpScale : 0.1});
        var mat_a = new THREE.MeshPhongMaterial({color: 0x111111});
        var mat_a_b = new THREE.MeshPhongMaterial({color: 0x111111 , bumpMap : bumpmap, bumpScale : 0.5});
        var mat_t = new THREE.MeshPhongMaterial({color: 0x565353});

        this.parachoquesDelantero = new Parachoques(mat,unidades_c);
        
        //mover Mesh ParachoquesD
        this.parachoquesDelantero.position.set(0,0,30*unidades_c/2);
        this.parachoquesDelantero.scale.y = 0.5;
        this.parachoquesDelantero.rotation.y = Math.PI;


        this.parachoquesTrasero = new Parachoques(mat,unidades_c);

        //mover Mesh ParachoquesT
        this.parachoquesTrasero.position.set(0,0,-30*unidades_c/2);


        var guardabarros = new Guardabarros(mat,unidades_c);

        var suelo = new Suelo(mat,unidades_c);

        var asiento = new Asiento(mat_a_b,unidades_c);

        var salpicadero = new Salpicadero(mat_a,unidades_c);

        var volante = new Volante(mat_v,mat_t,unidades_c);
        this.volante = volante;

        var faroIzq = new Faro(mat,unidades_c);
        faroIzq.mesh.position.set(-10*unidades_c,5*unidades_c,20*unidades_c);
        faroIzq.mesh.rotation.y = Math.PI/2;
        this.faroIzq = faroIzq;
        var faroDer = new Faro(mat,unidades_c);
        faroDer.mesh.position.set(10*unidades_c,5*unidades_c,20*unidades_c);
        faroDer.mesh.rotation.y = Math.PI/2;
        this.faroDer = faroDer;

        var ejeDD = new Eje(mat,unidades_c);
        ejeDD.position.set((35*unidades_c/2),0.5*unidades_c + 1*unidades_c, (30*unidades_c/2 + 10*unidades_c/2 - 2.5*unidades_c));
        var ejeDI = new Eje(mat,unidades_c);
        ejeDI.position.set(-(35*unidades_c/2),0.5*unidades_c + 1*unidades_c, (30*unidades_c/2 + 10*unidades_c/2 - 2.5*unidades_c));
        var ejeAD = new Eje(mat,unidades_c);
        ejeAD.position.set((35*unidades_c/2),0.5*unidades_c + 1*unidades_c, -(30*unidades_c/2 + 10*unidades_c/2 - 2.5*unidades_c));
        var ejeAI = new Eje(mat,unidades_c);
        ejeAI.position.set(-(35*unidades_c/2),0.5*unidades_c + 1*unidades_c, -(30*unidades_c/2 + 10*unidades_c/2 - 2.5*unidades_c));
        

        this.meshChasis = new THREE.Object3D();

        this.meshChasis.add(this.parachoquesDelantero);
        this.meshChasis.add(this.parachoquesTrasero);
        this.meshChasis.add(guardabarros);
        this.meshChasis.add(suelo);
        this.meshChasis.add(asiento);
        this.meshChasis.add(salpicadero);
        this.meshChasis.add(volante);
        this.meshChasis.add(faroDer.mesh);
        this.meshChasis.add(faroIzq.mesh);

        this.meshChasis.add(ejeDD);
        this.meshChasis.add(ejeDI);
        this.meshChasis.add(ejeAD);
        this.meshChasis.add(ejeAI);

        this.meshChasis.position.y -= 12.5 * unidades_c/2 + 1 * unidades_c/2 + 0.25 * unidades_c/2;
        
    }

    añadirChasis(unidades,escena){
        var bounding = new THREE.BoxHelper(this.meshChasis);
        bounding.geometry.computeBoundingBox();
        var bb = bounding.geometry.boundingBox;
        var cajaColisionChasis = new THREE.BoxGeometry(bb.max.x-bb.min.x - 16*unidades , bb.max.y-bb.min.y , bb.max.z-bb.min.z);
 
        var materialChasis = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({transparent : true , opacity : 0}),
            .1, // alta friccion
            .9 // bajo rebote
        );


        this.Chasis = new Physijs.BoxMesh(cajaColisionChasis,materialChasis,500);
        this.Chasis.position.y = 12.5 * unidades/2 + 1 * unidades/2 + 0.25 * unidades/2;
        this.Chasis.rotation.y = Math.PI/2;
        this.Chasis.__dirtyRotation = true;
        this.Chasis.__dirtyPosition = true;

        
        this.Chasis.add(this.meshChasis);
        escena.add(this.Chasis);
        
    }


    crearRuedas(unidades_c){
        var x = (30*unidades_c/2 + 10*unidades_c/2 - 2.5*unidades_c);
        var z = (25*unidades_c/2 + 4*2*unidades_c);
        this.ruedaDD = new Rueda(unidades_c);
        this.ruedaDD.position.set(x,0.5*unidades_c + 1*unidades_c, z);
        
        this.ruedaDI = new Rueda(unidades_c);
        this.ruedaDI.position.set(x,0.5*unidades_c + 1*unidades_c, -z);

        this.ruedaAD = new Rueda(unidades_c);
        this.ruedaAD.position.set(-x,0.5*unidades_c + 1*unidades_c, z);

        this.ruedaAI = new Rueda(unidades_c);
        this.ruedaAI.position.set(-x,0.5*unidades_c + 1*unidades_c, -z);
    }

    añadirRuedas(escena){

        escena.add(this.ruedaDD);
        escena.add(this.ruedaDI);
        escena.add(this.ruedaAD);
        escena.add(this.ruedaAI);
    }

    crearConstraint(rueda, chasis) {
        // Se construye la restricción de la rueda y se devuelve
        // Se recibe una rueda y el cuerpo del coche
        var constraint = new Physijs.DOFConstraint(
                rueda, chasis, rueda.position);
    
        return constraint;
    }

    crearRestricciones(escena){

        this.constraintDD = this.crearConstraint(this.ruedaDD,this.Chasis);
        this.constraintDI = this.crearConstraint(this.ruedaDI,this.Chasis);
        this.constraintAD = this.crearConstraint(this.ruedaAD,this.Chasis);
        this.constraintAI = this.crearConstraint(this.ruedaAI,this.Chasis);

        escena.addConstraint(this.constraintDD);
        escena.addConstraint(this.constraintDI);
        escena.addConstraint(this.constraintAD);
        escena.addConstraint(this.constraintAI);

        this.constraintAD.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
        this.constraintAD.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
        this.constraintAI.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
        this.constraintAI.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

        this.constraintDD.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
        this.constraintDD.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
        this.constraintDI.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
        this.constraintDI.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

    }

    ponerInicio(){
        this.mover(0, 5*this.unidades, -50*this.unidades);
    }

    direccion(){
        var x = this.parachoquesDelantero.getWorldPosition().x - this.parachoquesTrasero.getWorldPosition().x;
        var y = this.parachoquesDelantero.getWorldPosition().y - this.parachoquesTrasero.getWorldPosition().y;
        var z = this.parachoquesDelantero.getWorldPosition().z - this.parachoquesTrasero.getWorldPosition().z;
        return new THREE.Vector3(x,y,z);
    }


    mover(x,y,z){
        this.Chasis.position.x = x;
        this.Chasis.position.y = y;
        this.Chasis.position.z = z;
        this.Chasis.__dirtyPosition = true;

        this.ruedaDD.position.x += x;
        this.ruedaDD.position.y += y;
        this.ruedaDD.position.z += z;
        this.ruedaDD.__dirtyPosition = true;

        this.ruedaDI.position.x += x;
        this.ruedaDI.position.y += y;
        this.ruedaDI.position.z += z;
        this.ruedaDI.__dirtyPosition = true;

        this.ruedaAD.position.x += x;
        this.ruedaAD.position.y += y;
        this.ruedaAD.position.z += z;
        this.ruedaAD.__dirtyPosition = true;

        this.ruedaAI.position.x += x;
        this.ruedaAI.position.y += y;
        this.ruedaAI.position.z += z;
        this.ruedaAI.__dirtyPosition = true;

    }

    setLuces(momento){
        this.faroDer.luz.intensity = momento*3;
        this.faroIzq.luz.intensity = momento*3;
        this.luz.intensity = momento*0.7;
    }


    update() {

        

        if (this.forward) {
          // Se quiere ir hacia adelante. Se habilita un motor angular para las ruedas motrices
          // Y en el eje 2 (el eje Z), con un límite inferior más alto que el superior
          this.constraintAI.configureAngularMotor(2, 0.1, 0, -this.velocidad, this.potencia);
          this.constraintAD.configureAngularMotor(2, 0.1, 0, -this.velocidad, this.potencia);
          this.constraintAI.enableAngularMotor(2);
          this.constraintAD.enableAngularMotor(2);      
        } else if (this.backward) {
          // Se quiere ir hacia atrás. Se habilita un motor angular para las ruedas motrices
          // Y en el eje 2 (el eje Z), con un límite inferior más alto que el superior
          // Solo cambia el signo de la velocidad
          this.constraintAI.configureAngularMotor(2, 0.1, 0, this.velocidad, this.potencia);
          this.constraintAD.configureAngularMotor(2, 0.1, 0, this.velocidad, this.potencia);
          this.constraintAI.enableAngularMotor(2);
          this.constraintAD.enableAngularMotor(2);            
        }
        if (!(this.forward || this.backward)) {
          // Si no se está acelerando, ya sea hacia adelante o hacia atrás
          // Se apagan los motores de las 2 ruedas
          this.constraintAI.disableAngularMotor(2);
          this.constraintAD.disableAngularMotor(2); 
          if (this.freno) {
            // Si además está el freno habilidado
            // Frenamos deteniendo la velocidad angular de las 4 ruedas
            this.ruedaAD.setAngularVelocity (this.zeroSpeed);
            this.ruedaAI.setAngularVelocity (this.zeroSpeed);
            this.ruedaDD.setAngularVelocity (this.zeroSpeed);
            this.ruedaDI.setAngularVelocity (this.zeroSpeed);
          }
        }
        
        if ((this.right && this.left) || !(this.right || this.left)) {
          // Si se pulsan a la vez los cursores derecha e izquierda
          // O no se pulsa ninguno de los 2
          // Las ruedas directrices las dejamos rectas
          this.constraintDD.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
          this.constraintDD.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
          this.constraintDI.setAngularLowerLimit({ x: 0, y: 0, z: 0.1 });
          this.constraintDI.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
        } else if (this.right) {
          // Si no, se cambian los límites angulares en el Eje Y 
          // para que las ruedas estén giradas medio radián hacia uno u otro lado
          // segun corresponda
          this.constraintDD.setAngularLowerLimit({ x: 0, y: -0.5, z: 0.1 });
          this.constraintDD.setAngularUpperLimit({ x: 0, y: -0.5, z: 0 });
          this.constraintDI.setAngularLowerLimit({ x: 0, y: -0.5, z: 0.1 });
          this.constraintDI.setAngularUpperLimit({ x: 0, y: -0.5, z: 0 });
        } else if (this.left) {
          this.constraintDD.setAngularLowerLimit({ x: 0, y: 0.5, z: 0.1 });
          this.constraintDD.setAngularUpperLimit({ x: 0, y: 0.5, z: 0 });
          this.constraintDI.setAngularLowerLimit({ x: 0, y: 0.5, z: 0.1 });
          this.constraintDI.setAngularUpperLimit({ x: 0, y: 0.5, z: 0 });      
        }


        if((this.right && this.left) || !(this.right || this.left)){
            if(this.anguloVolante<-Math.PI/10){
                this.anguloVolante += Math.PI/15;
            }else if(this.anguloVolante>Math.PI/10){
                this.anguloVolante -= Math.PI/15;
            }else{
                this.anguloVolante = 0;
            }
        }else{
            if(this.right && this.anguloVolante < Math.PI*1.75){
                this.anguloVolante += Math.PI/15;
            }
            if(this.left && this.anguloVolante > -Math.PI*1.75){
                this.anguloVolante -= Math.PI/15;
            }
        }

        this.volante.rotation.z = this.anguloVolante;
        
          
      }

}

class Faro{

    constructor(mat, unidades){
        this.profundo = 3*unidades;
        this.ancho = 2*unidades;

        this.crearMesh(mat);

        this.crearLuz();


    }

    crearMesh(mat){

        var shape = new THREE.Shape();

        shape.moveTo(-this.profundo,0);
        shape.lineTo(-this.profundo,this.ancho);
        shape.quadraticCurveTo(0,this.ancho,0, 0);
        

        var perfilPuntos = shape.getPoints(50);

        perfilPuntos = this.vector2toVector3(perfilPuntos);

        var geo = new THREE.LatheGeometry(perfilPuntos);

        this.mesh = new THREE.Mesh(geo,mat);
        this.mesh.rotation.x = -Math.PI/2.5;
    }

    crearLuz(){
        this.luz = new THREE.SpotLight(0xfcfcfc, 3, this.profundo*50);
        this.mesh.add(this.luz);
        this.luz.position.set(-this.profundo,0,0);
        this.target = new THREE.Object3D();
        this.target.position.set(-this.profundo*8,-this.profundo*4,0);
        this.luz.target = this.target;
        this.luz.add(this.target);
    }

    vector2toVector3 (v2) {
        var v3 = [];
        
        v2.forEach ((v) => {
          v3.push (new THREE.Vector3 (v.y, v.x, 0));
        });
        
        return v3;
    }
}


class Rueda{

    constructor(unidades){

        this.alto = 3*unidades;
        this.radio = 5*unidades;

        var loader = new THREE.TextureLoader();
        var textura = loader.load("imagenes/marcaRuedas.png");

        var gRueda = new THREE.CylinderGeometry(this.radio,this.radio,this.alto,15);

        var material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({ color: 0x444444, opacity: 1, map : textura }),
            10, // alta fricción
            0 // rebote bajo
        );

        this.rueda = new Physijs.CylinderMesh(
            gRueda,
            material,
            20
        );

        this.rueda.rotation.x = Math.PI / 2;

        return this.rueda;

    }
}


class Parachoques{
    constructor(mat,unidades){

        this.alto = 10 * unidades;
        this.ancho = 25 * unidades;
        this.extrude = 2 * unidades;
 
        this.mesh = new THREE.Mesh(this.crearParachoques(),mat);
        return this.mesh;
    }

    crearParachoques(){
        var shape = new THREE.Shape();

        shape.moveTo(0,this.alto);
        shape.lineTo(0,0);
        shape.lineTo(this.alto,0);
        shape.lineTo(0,this.alto);

        var v = []; 
        v.push(new THREE.Vector3(-this.ancho/2-this.extrude,0,0));
        v.push(new THREE.Vector3(this.ancho/2+this.extrude,0,0));
        var path = new THREE.CatmullRomCurve3 (v);

        var option = {extrudePath : path};

        return new THREE.ExtrudeGeometry(shape,option);

    }
}

class Guardabarros{
    constructor(mat,unidades){

        this.profundo = 30 * unidades;
        this.alto = 2*unidades;
        this.ancho = 1*unidades;

        var meshder = new THREE.Mesh(this.crearGuardabarro(),mat);
        
        //mover MESH
        meshder.position.set (18*unidades/2,this.alto/2,0);

        var meshizq = new THREE.Mesh(this.crearGuardabarro(),mat);

        //mover MESH
        meshizq.position.set (-18*unidades/2,this.alto/2,0);

        this.mesh = new THREE.Object3D();

        this.mesh.add(meshder);
        this.mesh.add(meshizq);

        return this.mesh;

    }

    crearGuardabarro(){
        return new THREE.BoxGeometry(this.ancho,this.alto,this.profundo);

    }
}

class Suelo{
    constructor(mat,unidades){

        this.profundo = 30 * unidades;
        this.alto = 0.25 * unidades;
        this.ancho = 18 * unidades;

        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(this.ancho,this.alto,this.profundo),mat);

        //mover MESH
        this.mesh.position.set (0,this.alto/2,0);

        return this.mesh;

    }
}

class Asiento{
    constructor(mat_v,unidades){

        this.altoEspalda = 12.5 * unidades;
        this.anchoEspalda = 10 * unidades;
        this.profundoEspalda = 2 * unidades;
        this.altoCulo = this.profundoEspalda/2;
        this.anchoCulo = this.anchoEspalda;
        this.profundoCulo = 8 * unidades + this.profundoEspalda;

        var gEspalda = new THREE.BoxGeometry(this.anchoEspalda,this.altoEspalda,this.profundoEspalda);
        var meshEspalda = new THREE.Mesh(gEspalda,mat_v);
        //mover MESH
        meshEspalda.position.set (0,this.altoCulo + 0.25*unidades + this.altoEspalda/2,-30*unidades/2 + this.profundoEspalda/2);

        var gCulo = new THREE.BoxGeometry(this.anchoCulo,this.altoCulo,this.profundoCulo);
        var meshCulo = new THREE.Mesh(gCulo,mat_v);
        //mover MESH
        meshCulo.position.set (0,this.altoCulo/2 + 0.25*unidades,-30*unidades/2 + this.profundoCulo/2);

        this.mesh = new THREE.Object3D();

        this.mesh.add(meshCulo); 
        this.mesh.add(meshEspalda);

        return this.mesh;
    }
}

class Volante{

    constructor(matv,matt,unidades_c){

        this.radio = 3 * unidades_c;
        this.circunferencia = 0.5*unidades_c;

        var volante = new THREE.Mesh(new THREE.TorusGeometry(this.radio,this.circunferencia,16,100),matv);
        var travesaño = new THREE.Mesh(new THREE.BoxGeometry((this.radio*2)-this.circunferencia,this.circunferencia,this.circunferencia), matt);

        this.mesh = new THREE.Object3D()
        this.mesh.add(travesaño); this.mesh.add(volante);

        this.mesh.rotation.x = Math.PI/4;
        this.mesh.position.set(0,this.circunferencia+4.75*unidades_c-1*unidades_c,30*unidades_c/2 - 7*unidades_c);

        return this.mesh;

    }
}

class Salpicadero{

    constructor(mat,unidades_c){
        this.ancho = 10 * unidades_c;
        this.alto = 5 * unidades_c - 0.25 * unidades_c;
        this.profundo = 7 * unidades_c;
        this.bevel = 2*unidades_c;

        this.mesh = new THREE.Mesh(this.crearSalpicadero(),mat);

        this.mesh.position.set(0,this.alto/2+0.25*unidades_c,30*unidades_c/2 - this.profundo/2);

        return this.mesh;
    }

    crearSalpicadero(){
        var shape = new THREE.Shape();

        shape.moveTo(-this.profundo/2,-this.alto/2);
        shape.lineTo(-this.profundo/2,this.alto/2);
        shape.lineTo(this.profundo/2-this.bevel,this.alto/2);
        shape.lineTo(this.profundo/2,this.alto/2-this.bevel);
        shape.lineTo(this.profundo/2,-this.alto/2);
        shape.lineTo(-this.profundo/2,-this.alto/2);


        var v = []; 
        v.push(new THREE.Vector3(-this.ancho/2,0,0));
        v.push(new THREE.Vector3(this.ancho/2,0,0));
        var path = new THREE.CatmullRomCurve3 (v);

        var option = { bevelEnabled : false, extrudePath : path};


        return new THREE.ExtrudeGeometry(shape,option);
    }
}

class Eje{
    constructor(mat,unidades){
        this.alto = 8*unidades;
        this.radio = 0.5*unidades;

        this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(this.radio,this.radio,this.alto), mat);
        this.mesh.rotation.z = Math.PI/2;

        return this.mesh;
    }
}