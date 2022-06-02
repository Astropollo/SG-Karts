class Escenario{

    constructor(escena,unidades,indice, momento){
        this.unidades = unidades;
        this.momento = momento;
        this.luzAmbiental;

        this.gradas = new  Array();
        this.farolas = new Array();

        if(momento == 1){
            var intensidad = 0;
        }else{
            var intensidad = 1;
        }
        var luz = new THREE.DirectionalLight(0xccddee, intensidad*1.5);
        luz.position.set(1,10,1);
        escena.add (luz);

        this.luzAmbiental = new THREE.AmbientLight(0xccddee, intensidad*0.3);
        escena.add(this.luzAmbiental);

        if(indice == 1){
            this.crearEscenario1(escena,momento);    
        }else{
            this.crearEscenario2(escena,momento);    
        }
        
    }

    crearEscenario2(escena,momento){
        this.gradas[0] = new Grada(this.unidades);
        this.gradas[0].mesh.position.z = -100 * this.unidades;
        this.gradas[0].mesh.position.y = -1.5 * this.unidades;
        
        this.gradas[1] = new Grada(this.unidades);
        this.gradas[1].mesh.position.y = -1.5 * this.unidades;
        this.gradas[1].mesh.rotation.y = -Math.PI;

        this.gradas[2] = new Grada(this.unidades);
        this.gradas[2].mesh.position.z = +70 * this.unidades;
        this.gradas[2].mesh.position.y = -1.5 * this.unidades;

        this.farolas[0] = new Farola(this.unidades,momento,escena);
        this.farolas[0].position.set(+85*this.unidades,-1*this.unidades,+30*this.unidades);
        this.farolas[0].rotation.y = 0;

        this.farolas[1] = new Farola(this.unidades,momento,escena);
        this.farolas[1].position.set(-85*this.unidades,-1*this.unidades,+30*this.unidades);
        this.farolas[1].rotation.y = Math.PI;
 
        this.farolas[2] = new Farola(this.unidades,momento,escena);
        this.farolas[2].position.set(+250*this.unidades,-1*this.unidades,+30*this.unidades);
        this.farolas[2].rotation.y = -Math.PI/2;

        
        this.farolas[3] = new Farola(this.unidades,momento,escena);
        this.farolas[3].position.set(+285*this.unidades,-1*this.unidades,-125*this.unidades);
        this.farolas[3].rotation.y = 0;

        
        this.farolas[4] = new Farola(this.unidades,momento,escena);
        this.farolas[4].position.set(+220*this.unidades,-1*this.unidades,-235*this.unidades);
        this.farolas[4].rotation.y = Math.PI/2;

        
        this.farolas[5] = new Farola(this.unidades,momento,escena);
        this.farolas[5].position.set(+122*this.unidades,-1*this.unidades,-175*this.unidades);
        this.farolas[5].rotation.y = -Math.PI;

        escena.add(this.gradas[0].mesh);
        escena.add(this.gradas[1].mesh);
        escena.add(this.gradas[2].mesh);
    }

    crearEscenario1(escena,momento){
        this.gradas[0] = new Grada(this.unidades);
        this.gradas[0].mesh.position.z = -100 * this.unidades;
        this.gradas[0].mesh.position.y = -1.5 * this.unidades;
        
        this.gradas[1] = new Grada(this.unidades);
        this.gradas[1].mesh.position.z = +100 * this.unidades;
        this.gradas[1].mesh.position.y = -1.5 * this.unidades;
        this.gradas[1].mesh.rotation.y = -Math.PI;

        this.farolas[0] = new Farola(this.unidades,momento,escena);
        console.log(this.farolas[0].position);
        this.farolas[0].position.set(-50*this.unidades,-1*this.unidades,+35*this.unidades);
        this.farolas[0].rotation.y = -Math.PI/2;

        this.farolas[1] = new Farola(this.unidades,momento,escena);
        this.farolas[1].position.set(50*this.unidades,-1*this.unidades,+35*this.unidades);
        this.farolas[1].rotation.y = -Math.PI/2;

        this.farolas[2] = new Farola(this.unidades,momento,escena);
        this.farolas[2].position.set(-50*this.unidades,-1*this.unidades,-35*this.unidades);
        this.farolas[2].rotation.y = Math.PI/2;

        this.farolas[3] = new Farola(this.unidades,momento,escena);
        this.farolas[3].position.set(+50*this.unidades,-1*this.unidades,+-35*this.unidades);
        this.farolas[3].rotation.y = Math.PI/2;

        this.farolas[4] = new Farola(this.unidades,momento,escena);
        this.farolas[4].position.set(+85*this.unidades,-1*this.unidades,0);
        this.farolas[4].rotation.y = 0;

        this.farolas[5] = new Farola(this.unidades,momento,escena);
        this.farolas[5].position.set(-85*this.unidades,-1*this.unidades,0);
        this.farolas[5].rotation.y = Math.PI;

        escena.add(this.gradas[0].mesh);
        escena.add(this.gradas[1].mesh);
    }

    update(){
        for(let i = 0; i<this.gradas.length ; i++){
            this.gradas[i].update();
        }
    }
}

class Grada {
    constructor(unidades){
        this.profundo = 20*unidades;
        this.alturaSuelo = 2*unidades;
        this.profundoPiezas = 0.5*unidades;
        this.ancho = 100*unidades;
        this.alturaAtras = 12.5*unidades;
        this.alturaDelante = 5*unidades;
        this.alturaEspectadores = 3.5*unidades;
        this.numEspectadores = 3;
        this.altura = 2;
        this.direccion = 1;
        this.reloj = new THREE.Clock();

        var matLados = new THREE.MeshPhongMaterial({color:0x123456});
        var matSuelo = new THREE.MeshPhongMaterial({color:0x654321});
        var mesh = new THREE.Object3D();

        var ladoDer = new THREE.Mesh(this.crearLado(),matLados);
        ladoDer.position.x = this.ancho/2;
        mesh.add(ladoDer);

        var ladoIzq = new THREE.Mesh(this.crearLado(),matLados);
        ladoIzq.position.x = -this.ancho/2;
        mesh.add(ladoIzq);

        var ladoAtras = new THREE.Mesh(new THREE.BoxGeometry(this.ancho - this.profundoPiezas, this.alturaAtras, this.profundoPiezas),matLados);
        ladoAtras.position.z = +this.profundoPiezas/2;
        ladoAtras.position.y = +this.alturaAtras/2;
        mesh.add(ladoAtras);

        var ladoDelante = new THREE.Mesh(new THREE.BoxGeometry(this.ancho - this.profundoPiezas, this.alturaDelante, this.profundoPiezas),matLados);
        ladoDelante.position.z = + this.profundo - this.profundoPiezas/2;
        ladoDelante.position.y = +this.alturaDelante/2;
        mesh.add(ladoDelante);

        var suelo = new THREE.Mesh(this.crearSuelo(unidades),matSuelo);
        mesh.add(suelo);

        this.espectadores = this.crearEspectadores(this.numEspectadores);
        for(let i = 0; i<this.numEspectadores ; i++){
            mesh.add(this.espectadores[i]);
        }

        this.mesh = mesh;
    }

    crearEspectadores(n){

        var espectadores = new Array();

        var textura = new THREE.TextureLoader().load("imagenes/espectadores.png");
        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set( 2, 1 );
        
        var material = new THREE.MeshPhongMaterial({transparent: true,map : textura});
        var pasoz = this.profundo/(n);

        for( let i = 0, z = pasoz/2; i< n; i++){

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(this.ancho-this.profundoPiezas,this.alturaEspectadores,this.profundoPiezas/4),material);

            mesh.position.z = z;
            mesh.position.y = - z*0.41 + (this.alturaAtras-this.alturaSuelo/2 + 2);
            z+=pasoz;

            espectadores.push(mesh);
        }
        return espectadores;

    }

    crearLado(){

        var shape = new THREE.Shape();

        shape.moveTo(0,0);
        shape.lineTo(0,-this.alturaAtras);
        shape.lineTo(-this.profundoPiezas, -this.alturaAtras);
        shape.lineTo(-this.profundo+this.profundoPiezas,-this.alturaDelante);
        shape.lineTo(-this.profundo,-this.alturaDelante);
        shape.lineTo(-this.profundo,0);
        shape.lineTo(0,0);

        var v = [new THREE.Vector3(this.profundoPiezas/2,0,0), new THREE.Vector3(-this.profundoPiezas/2,0,0)];
        var path = new THREE.CatmullRomCurve3 (v);

        var option = { extrudePath : path};
        
        var geo = new THREE.ExtrudeGeometry(shape,option);

        return geo;

    }

    crearSuelo(){

        var shape = new THREE.Shape();

        shape.moveTo(-this.profundoPiezas,-this.alturaAtras+this.alturaSuelo);
        shape.lineTo(-this.profundo+this.profundoPiezas, -this.alturaDelante+this.alturaSuelo);
        shape.lineTo(-this.profundo+this.profundoPiezas, -this.alturaDelante+this.alturaSuelo+this.profundoPiezas);
        shape.lineTo(-this.profundoPiezas,-this.alturaAtras+this.alturaSuelo+this.profundoPiezas);
        shape.lineTo(-this.profundoPiezas,-this.alturaAtras+this.alturaSuelo);

        var v = [new THREE.Vector3(this.ancho/2,0,0), new THREE.Vector3(-this.ancho/2,0,0)];
        var path = new THREE.CatmullRomCurve3 (v);

        var option = { extrudePath : path};
        
        var geo = new THREE.ExtrudeGeometry(shape,option);

        return geo;

    }

    update(){
        var delta = this.reloj.getDelta();
        var variacion; 
        var variar = true;
        for(let i = 0; i< this.numEspectadores; i++){
            if(this.direccion == 1){
                variacion = delta/2;
                this.altura += variacion;
                if(this.altura > 2){
                    this.direccion = 0;
                    variar = false;
                }
            }else{
                variacion = -delta/2;
                this.altura += variacion;
                if(this.altura < 0){
                    this.direccion = 1;
                    variar = false;
                }
            }
            if(variar)
            this.espectadores[i].position.y += variacion;
        }
    }
}

class Farola{

    constructor(unidades,momento,escena){
        this.alto = 40*unidades;
        this.radio = 1* unidades;
        this.profundo = 10*unidades;
        this.radioLuz = 2*unidades;
        this.mesh = new THREE.Object3D();

        var material = new THREE.MeshPhongMaterial({color:0xf1d111});

        this.crearMesh(material);

        this.crearLuz(momento);

        escena.add(this.mesh);

        return this.mesh;

    }

    crearMesh(material){

        var paloVertical = new THREE.Mesh(new THREE.CylinderGeometry(this.radio,this.radio,this.alto),material);
        paloVertical.position.y = this.alto/2;
        var paloHorizontal = new THREE.Mesh(new THREE.CylinderGeometry(this.radio,this.radio,this.profundo),material);
        paloHorizontal.position.set(this.profundo/2,this.alto,0);
        paloHorizontal.rotation.z = Math.PI/2;
        var esferaEsquina = new THREE.Mesh(new THREE.SphereGeometry(this.radio),material);
        esferaEsquina.position.y=(this.alto);
        var foco = new THREE.Mesh(new THREE.CylinderGeometry(this.radioLuz, this.radioLuz*1.5, this.radioLuz*2),material);
        foco.position.set(this.profundo+this.radioLuz,this.alto,0);

        this.mesh.add(paloVertical);
        this.mesh.add(paloHorizontal);
        this.mesh.add(esferaEsquina);
        this.mesh.add(foco);

        return this.mesh;
    }

    crearLuz(momento){
        this.luz = new THREE.SpotLight(0xfcfcfc, momento * 2, this.alto*3, Math.PI/2,1);
        this.mesh.add(this.luz);
        this.luz.position.set(this.profundo,this.alto/2,+this.radio);
        this.target = new THREE.Object3D();
        this.target.position.set(this.profundo,-this.alto,0);
        this.luz.target = this.target;
        this.luz.add(this.target);
    }
}

