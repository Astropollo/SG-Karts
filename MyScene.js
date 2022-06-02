var Escena;

class MyScene extends Physijs.Scene {

    unidades = 1;
    camaraActiva = 0;
    camaras = new Array();
    veces = 0;

    constructor( myCanvas ){

        // El gestor de hebras
        Physijs.scripts.worker = './physijs/physijs_worker.js'
        // El motor de física de bajo nivel, en el cual se apoya Physijs
        Physijs.scripts.ammo   = './ammo.js'

        super();


        // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
        this.renderer = this.createRenderer(myCanvas);

        //Inicializamos los stats???? Parece ser para ver los fps y el ms?
        this.initStats();

        // Se establece el valor de la gravedad, negativo, los objetos caen hacia abajo
        this.setGravity (new THREE.Vector3 (0, -10, 0));

        this.createGround();

        var velocidad = 30;
        var potencia = 30;

        this.coche = new Coche(velocidad,potencia,this.unidades,this);
        this.coche.ponerInicio();

        this.clock = new THREE.Clock();

        this.createcamara();


    }

    iniciar(indice, momento){
        document.getElementsByTagName("main")[0].style.display = "none";
        document.getElementById("Stats-output").style.display = "block";
        this.pista = new Pista(this.unidades, this, indice);

        if(momento == "Noche"){
            momento = 1;
        }else{
            momento = 0;    
        }

        console.log(momento);
        this.escenario = new Escenario(this,this.unidades, indice, momento);
        this.cargarEntorno(momento);
        this.coche.setLuces(momento);

        this.update();
    }

    cruzar(){
        this.veces += 1;
    }


    cargarEntorno(momento){
        if(momento == 1){
            var urls = [
                "./imagenes/cieloNocturno.png",
                "./imagenes/cieloNocturno.png",
                "./imagenes/cieloNocturno.png",
                "./imagenes/cieloNocturno.png",
                "./imagenes/cieloNocturno.png",
                "./imagenes/cieloNocturno.png",
            ];
        }else{
            var urls = [
                "./imagenes/cielo.png",
                "./imagenes/cielo.png",
                "./imagenes/cielo.png",
                "./imagenes/cielo.png",
                "./imagenes/cielo.png",
                "./imagenes/cielo.png",
            ];
        }
        var loader = new THREE.CubeTextureLoader();
        var textureCube = loader.load(urls);
        this.background = textureCube;
    }

    createGround(){

        var loader = new THREE.TextureLoader();
        var textura = loader.load("imagenes/cesped.png");
        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set( 80, 80 );
        var material = new THREE.MeshPhongMaterial({map : textura});
        var materialPhy = new Physijs.createMaterial(
            material,
            0,
            0
        );
        var ground = new Physijs.BoxMesh( new THREE.BoxGeometry(1000*this.unidades,1*this.unidades,1000*this.unidades),materialPhy,0);
        ground.position.y = -1.5*this.unidades;
        this.add(ground);
    }

    onMouseDown(event){
        this.mover = true;
    }

    onMouseUp(event){
        this.mover = false;
        this.camaraControlFP.lookAt(this.coche.Chasis.position);
    }

    onKeyDown (event) {
        var key = event.which || event.keyCode;
        switch (key) {
            case KeyCode.KEY_A :
                window.alert("El coche avanza/retrocede con los cursores arriba/abajo\nGira a izquierda/derecha con los cursores izquierda/derecha\nPueden pulsarse varias teclas a la vez.");
                break;
            case KeyCode.KEY_LEFT : 
                this.coche.left = true;
                break;
            case KeyCode.KEY_UP :
                this.coche.forward = true;
                break;
            case KeyCode.KEY_RIGHT :
                this.coche.right = true;
                break;
            case KeyCode.KEY_DOWN :
                this.coche.backward = true;
                break;
            case KeyCode.KEY_SPACE : 
                this.coche.freno = true;
                break;
            case KeyCode.KEY_R : 
                this.coche.reiniciar();
                break;
            case KeyCode.KEY_E : 
                if(this.camaraActiva == 1){
                    this.camaraActiva = 0;
                }
                else{
                    this.camaraActiva = 1;
                }
                break;
            case KeyCode.KEY_V:
                if(this.camaraActiva == 2){
                    this.camaraActiva = 0;
                }
                else{
                    this.camaraActiva = 2;
                }
                break;
        }
    }
    
    onKeyUp (event) {
        var key = event.which || event.keyCode;
        switch (key) {
            case KeyCode.KEY_LEFT : 
                this.coche.left = false;
                break;
            case KeyCode.KEY_UP :
                this.coche.forward = false;
                break;
            case KeyCode.KEY_RIGHT :
                this.coche.right = false;
                break;
            case KeyCode.KEY_DOWN :
                this.coche.backward = false;
                break;
            case KeyCode.KEY_SPACE : 
                this.coche.freno = false;
                break;
        }
    }

    

    initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms


        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        $("#Stats-output").append( stats.domElement );

        this.stats = stats;
    }


    createRenderer (myCanvas) {
        // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
        
        // Se instancia un Renderer   WebGL
        var renderer = new THREE.WebGLRenderer();
        
        // Se establece un color de fondo en las imágenes que genera el render
        renderer.setClearColor(new THREE.Color(0xFFFEEE), 1.0);
        
        // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // La visualización se muestra en el lienzo recibido
        $(myCanvas).append(renderer.domElement);
        
        return renderer;  
    }

    onWindowResize () {
        // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
        // Hay que actualizar el ratio de aspecto de la cámara
        this.setcamaraAspect (window.innerWidth / window.innerHeight);

        // Y también el tamaño del renderizador
        this.renderer.setSize (window.innerWidth, window.innerHeight);
    }

    setcamaraAspect (ratio) {
        this.camaras[0].aspect = ratio;
        this.camaras[0].updateProjectionMatrix();

        this.camaras[1].aspect = ratio;
        this.camaras[1].updateProjectionMatrix();

        this.camaras[2].aspect = ratio;
        this.camaras[2].updateProjectionMatrix();
    }
    
    createcamara () {

        //-----------------------
        
        this.camaras[0] = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camaras[0].lookAt(this.coche.Chasis.position);
        this.camaraControlFP = new FirstPersonControls(this.camaras[0],this.renderer.domElement);
        this.camaraControlFP.lookSpeed = 0.5;
        this.camaraControlFP.constrainVertical = true;
        this.camaraControlFP.verticalMin = Math.PI/3;
        this.camaraControlFP.verticalMax = 2*Math.PI/3;
        //-----------------------

        this.camaras[1] = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camaras[1].up.set(-2,0,0.1);

        //-----------------------

        this.camaras[2] = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // También se indica dónde se coloca
        this.camaras[2].position.set (20, 10, 20);
        // Y hacia dónde mira
        var look = new THREE.Vector3 (0,0,0);
        this.camaras[2].lookAt(look);
        this.add (this.camaras[2]);
        
        // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
        this.camaraControl = new THREE.TrackballControls (this.camaras[2], this.renderer.domElement);
        // Se configuran las velocidades de los movimientos
        this.camaraControl.rotateSpeed = 5;
        this.camaraControl.zoomSpeed = -2;
        this.camaraControl.panSpeed = 0.5;
        // Debe orbitar con respecto al punto de mira de la cámara
        this.camaraControl.target = look;

    }

    getcamara () {
        this.coche.Chasis.updateMatrixWorld(); // Para que la cámara no tiemble
        if(this.camaraActiva == 0){
            var relativecamaraOffsetConductor = new THREE.Vector3(0, 0.3, -1);
            var camaraOffsetConductor = relativecamaraOffsetConductor.applyMatrix4(this.coche.Chasis.matrixWorld);
            
            this.camaras[0].position.z = camaraOffsetConductor.z;
            this.camaras[0].position.y = camaraOffsetConductor.y;
            this.camaras[0].position.x = camaraOffsetConductor.x;
        
            if(!this.mover){
                this.camaras[0].lookAt(this.coche.Chasis.position);
            }
                

        }else if(this.camaraActiva == 1){
            var relativecamaraOffsetEspacial = new THREE.Vector3(0, 30, 0);
            var camaraOffsetEspacial = relativecamaraOffsetEspacial.applyMatrix4(this.coche.Chasis.matrixWorld);

            this.camaras[1].position.z = camaraOffsetEspacial.z;
            this.camaras[1].position.y = camaraOffsetEspacial.y;
            this.camaras[1].position.x = camaraOffsetEspacial.x;
            
            var direccion = this.coche.direccion();
            direccion.normalize();
            this.camaras[1].up.set(direccion.x, 0,direccion.z);
    
        
            this.camaras[1].lookAt(this.coche.Chasis.position);
        }
        
        return this.camaras[this.camaraActiva];
    }

    update () {
        var tiempo = this.clock.getDelta();
        if (this.stats) this.stats.update();

        if(this.camaraActiva == 2){
            this.camaraControl.update();
        }
        if(this.camaraActiva == 0){
            this.camaraControlFP.update(tiempo);
        }
    
        this.coche.update();
            
        this.escenario.update();
            
            // Se le pide al motor de física que actualice las figuras según sus leyes
        this.simulate ();
        
            // Se le pide al renderer que renderice la escena que capta una determinada cámara, que nos la proporciona la propia escena.
        this.renderer.render(this, this.getcamara());
        
        
        // Por último, se solicita que la próxima vez que haya que refrescar la ventana se ejecute una determinada función, en este caso la funcion render.
        // La propia función render es la que indica que quiere ejecutarse la proxima vez
        // Por tanto, esta instrucción es la que hace posible que la función  render  se ejecute continuamente y por tanto podamos crear imágenes que tengan en cuenta los cambios que se la hayan hecho a la escena después de un render.
        
        if(this.veces < 2){
            requestAnimationFrame(() => this.update());
        }else{
            alert("HAS TEMINADO LA VUELTA");
        }
    }
}
    
    /// La función principal
$(function () {
      
    // Se crea la escena
    var scene = new MyScene ("#WebGL-output");
    Escena = scene;
      
    // listeners
    // Cada vez que el usuario cambie el tamaño de la ventana se llama a la función que actualiza la cámara y el renderer
    window.addEventListener ("resize", () => scene.onWindowResize());
      
    // Se añaden listeners para el teclado para el control del coche
    
    window.addEventListener ("keydown", () => scene.onKeyDown(event));
    window.addEventListener ("keyup",   () => scene.onKeyUp(event));
    window.addEventListener ("mousedown", () => scene.onMouseDown(event), true);
    window.addEventListener ("mouseup", () => scene.onMouseUp(event), true);


});

function iniciar(indice){
    var momento = document.getElementById("momento").innerText;
    Escena.iniciar(indice,momento);
}

function cambiar(){
    var momento = document.getElementById("momento").innerText;
    if(momento == "Noche"){
        document.getElementById("momento").innerText = "Dia";
    }else{
        document.getElementById("momento").innerText = "Noche";
    }
}

