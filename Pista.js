class Pista {

    constructor(unidades, escena, indice){

        this.unidades = unidades;

        this.radioCurva = 50*this.unidades;
        this.alto = 1*this.unidades;
        this.ancho = 25*this.unidades;
        this.largo = 100*this.unidades;
        this.tamBordes = 2*this.unidades;
        this.radBordes = 1*this.unidades;

        

        this.crearTextura();

        if(indice == 1){
            this.anchoTotalPista = 100*this.unidades;
            this.crearPista1(escena,this.unidades);
        }else{
            this.crearPista2(escena,this.unidades);    
        }
        
    }

    crearPista2(escena,unidades){

        var Curvas; var Rectas;

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(0,0,-50*unidades);
        Rectas.rotar(1);

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(this.largo,0,-50*unidades);
        Rectas.rotar(1);

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(0);
        Curvas.mover(this.largo+this.radioCurva,0,0);

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(2);
        Curvas.mover(this.largo*2+this.radioCurva,0,0);
        
        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(3);
        Curvas.mover(this.largo*2+this.radioCurva,0,0);

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(this.largo*3,0,-this.radioCurva);

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(this.largo*3,0,-this.radioCurva - this.largo);

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(0);
        Curvas.mover(this.largo*2+this.radioCurva,0, - this.largo*2);

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.rotar(1);
        Rectas.mover(this.largo*2,0,- this.largo*2 - this.radioCurva); 

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(1);
        Curvas.mover(this.largo+this.radioCurva,0, - this.largo*2);

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(this.largo,0,- this.largo - this.radioCurva);

        var Rampas = new Rampa(this.textura,this.ancho,this.largo/2,this.alto,this.tamBordes,this.radBordes,escena);
        Rampas.mover(this.largo, 0, -this.radioCurva*2);

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(this.largo,0, + this.radioCurva/2);

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(3);
        Curvas.mover(this.radioCurva, 0 , this.radioCurva*2 - + this.radioCurva/2);

        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.rotar(1);
        Rectas.mover(0,0, this.radioCurva*2 +this.radioCurva/2);

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(2);
        Curvas.mover(-this.largo/2,0,this.largo/2 + this.radioCurva/2);

        Rectas = new Recta(this.textura,this.ancho,this.largo/4 * 3,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(-this.largo,0,this.radioCurva/2 + this.radioCurva/4);

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(1);
        Curvas.mover(-this.largo/2,0,0);

        var meta = new Meta(this.ancho-this.radBordes*4,this.alto*2,this.alto/100,escena);
        meta.mover(this.ancho/2,0,-50*unidades);
    }

    crearPista1(escena,unidades){

        var Curvas; var Rectas;
        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(0,0,this.anchoTotalPista/2);
        Rectas.rotar(1);
        
        Rectas = new Recta(this.textura,this.ancho,this.largo,this.alto,this.tamBordes,this.radBordes,escena);
        Rectas.mover(0,0,-this.anchoTotalPista/2);
        Rectas.rotar(1);
        
        
        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(0);
        Curvas.mover(this.largo/2,0,0);
        

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(1);
        Curvas.mover(-this.largo/2,0,0);
        
        
        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(2);
        Curvas.mover(-this.largo/2,0,0);
    

        Curvas = new Curva(this.textura,this.ancho,this.radioCurva,this.alto,this.tamBordes,this.radBordes,escena,unidades);
        Curvas.rotarY(3);
        Curvas.mover(this.largo/2,0,0);

        var meta = new Meta(this.ancho-this.radBordes*4,this.alto*2,this.alto/100,escena);
        meta.mover(this.ancho/2,0,-this.anchoTotalPista/2);
    }

    crearTextura(){
        var loader = new THREE.TextureLoader();
        this.textura = loader.load("imagenes/marcaRuedas.png");
    }


} 