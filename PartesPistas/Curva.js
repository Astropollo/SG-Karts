
class Curva {

    constructor(textura, ancho,radioCurva,alto,tamBorde,radBorde,escena, unidades){
        this.ancho = ancho;
        this.radioCurva = radioCurva;
        this.alto = alto;
        this.tamBorde = tamBorde
        this.radBorde = radBorde;
        this.unidades = unidades;

        this.meshTotal = new THREE.Object3D();

        this.textura = textura;
        
        this.crearGeometria();

        this.crearMesh(escena);

    }


    crearGeometria(){
        this.crearCarretera();
        this.crearBordes();
    }

    crearCarretera(){
        var gCarretera = this.crearGeometriaCarretera();

        this.meshCarretera = new THREE.Mesh(gCarretera,new THREE.MeshPhongMaterial({color : 0x111111, shininess: 1}));
        
    }

    crearGeometriaCarretera(){

        var shape = this.crearShape();

        var v = []; 
        v.push(new THREE.Vector3(0,0,0));
        v.push(new THREE.Vector3(0,-this.alto,0));
        var path = new THREE.CatmullRomCurve3 (v);

        var option = { bevelEnabled : false, extrudePath : path};

        var gCarretera = new THREE.ExtrudeGeometry(shape,option);

        return gCarretera;
    }


    crearShape(){

        var shape = new THREE.Shape();

        var alturaext,alturaint;
        var izqint,izqext;
        var ajuste = 1.5;

        alturaext = this.radioCurva + this.ancho/2; // +
        alturaint = this.radioCurva - this.ancho/2; // -
        izqint = -this.radioCurva + this.ancho/2 ;  // -
        izqext = -this.radioCurva - this.ancho/2 ;  // +
        

        shape.moveTo(izqext,0);
        shape.bezierCurveTo(izqext-ajuste,(alturaext/2)+ajuste,(izqext/2)-ajuste,alturaext+ajuste,0,alturaext);

        shape.lineTo(0,alturaint);
        shape.bezierCurveTo((izqint/2)-ajuste,alturaint+ajuste,izqint-ajuste,(alturaint/2)+ajuste,izqint,0);
        shape.moveTo(izqext,0);

        return shape;
    }

    crearBordes(){
        this.BordeExterior = this.Borde(this.ancho/2,-this.radBorde);
        this.BordeInterior = this.Borde(-this.ancho/2,this.radBorde);
    }

    Borde(ancho,radio){
        var array = [];
        var pasito = (Math.PI/2)/((Math.PI/2*this.radioCurva+ancho)/(this.radBorde*2));
        for(var i = pasito/2; i<Math.PI/2; i += pasito ){
            var gCil = new THREE.CylinderGeometry(this.radBorde,this.radBorde,this.tamBorde,6,);

            var color =  Math.random() * 0xffffff;
            var materialBorde = new Physijs.createMaterial(
                new THREE.MeshPhongMaterial({color : color, opacity : 0.5, map: this.textura}),
                .1, // baja friccion
                .5 // alta rebote
            )

            var CilP = new Physijs.CylinderMesh(gCil,materialBorde,0);

            CilP.position.x = Math.sin(i) * (this.radioCurva+(ancho+radio));
            CilP.position.y = this.tamBorde/2;
            CilP.position.z = Math.cos(i) * (this.radioCurva+(ancho+radio));
            CilP.__dirtyPosition = true;

            array.push(CilP);
        }
        return array;

    }


    crearMesh(escena){

        var bounding = new THREE.BoxHelper(this.meshCarretera);
        bounding.geometry.computeBoundingBox();
        var bb = bounding.geometry.boundingBox;
        var cajaColisionCarretera = new THREE.BoxGeometry(bb.max.x-bb.min.x , bb.max.y-bb.min.y , bb.max.z-bb.min.z);
        
        var materialPista = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({transparent : true , opacity : 0}),
            10, // alta friccion
            0 // bajo rebote
        );

        this.carretera = new Physijs.BoxMesh(cajaColisionCarretera,materialPista,0);
        this.carretera.position.x = bb.max.x/2;
        this.carretera.position.y = -this.alto/2;
        this.carretera.position.z = bb.max.z/2;
        this.carretera.__dirtyPosition = true;
        this.meshTotal.add(this.carretera);
        this.meshTotal.add(this.meshCarretera);
        escena.add(this.carretera);
        escena.add(this.meshCarretera);

        this.BordeExterior.forEach ((cil) => {
            this.meshTotal.add(cil);
            escena.add(cil);
        });

        this.BordeInterior.forEach ((cil) => {
            this.meshTotal.add(cil)
            escena.add(cil);
        });

    }

    mover(x,y,z){
        this.carretera.position.x += x;
        this.carretera.position.y += y;
        this.carretera.position.z += z;
        this.carretera.__dirtyPosition = true;

        this.meshCarretera.position.set(x,y,z);

        this.BordeExterior.forEach(cil => {
            cil.position.x += x;
            cil.position.y += y;
            cil.position.z += z;
            cil.__dirtyPosition = true;
        });

        this.BordeInterior.forEach(cil => {
            cil.position.x += x;
            cil.position.y += y;
            cil.position.z += z;
            cil.__dirtyPosition = true;
        });
    }

    rotarY(indice){
        
        var angulo;
        var pasitoint = (Math.PI/2)/((Math.PI/2*this.radioCurva-this.ancho/2)/(this.radBorde*2));
        var pasitoext = (Math.PI/2)/((Math.PI/2*this.radioCurva+this.ancho/2)/(this.radBorde*2));
        var limiteinfint, limiteinfext;

        switch(indice){
            case 1:
                this.carretera.position.x += -60*this.unidades;
                this.carretera.position.z += -60*this.unidades;
                limiteinfint = Math.PI + pasitoint/2;
                limiteinfext = Math.PI + pasitoext/2;
                angulo = Math.PI;
                break;
            case 2:
                this.carretera.position.x += -60*this.unidades;
                this.carretera.position.z += 0;
                limiteinfint = Math.PI*3/2 + pasitoint/2;
                limiteinfext = Math.PI*3/2 + pasitoext/2;
                angulo = Math.PI*3/2;
                break;
            case 3:
                this.carretera.position.x += 0;
                this.carretera.position.z += 0;
                limiteinfint = 0 + pasitoint/2;
                limiteinfext = 0 + pasitoext/2;
                angulo = 0;
                break;
            case 0:
                this.carretera.position.x += 0;
                this.carretera.position.z += -60*this.unidades;
                limiteinfint = Math.PI/2 + pasitoint/2;
                limiteinfext = Math.PI/2 + pasitoext/2;
                angulo = Math.PI/2;
                break;
        }
        this.carretera.__dirtyPosition = true;

        this.meshCarretera.rotateY(angulo);

        var acumuladorint = limiteinfint;
        var aculumadorext = limiteinfext;
        this.BordeExterior.forEach(cil => {
            cil.position.x = Math.sin(aculumadorext) * (this.radioCurva+(this.ancho/2-this.radBorde));
            cil.position.z = Math.cos(aculumadorext) * (this.radioCurva+(this.ancho/2-this.radBorde));
            cil.__dirtyPosition = true;
            aculumadorext += pasitoext;
        });
        var acumuladorint = limiteinfint;
        var aculumadorext = limiteinfext;
        this.BordeInterior.forEach(cil => {
            cil.position.x = Math.sin(acumuladorint) * (this.radioCurva+(-this.ancho/2+this.radBorde));
            cil.position.z = Math.cos(acumuladorint) * (this.radioCurva+(-this.ancho/2+this.radBorde));
            cil.__dirtyPosition = true;
            acumuladorint += pasitoint;
        });
    }
}