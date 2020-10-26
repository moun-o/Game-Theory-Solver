//Manager HTML
function HTMLdisplayMatrix(matrice) {
    let chaine='';
    nbrl=matrice.length;nbrc=matrice[0].length;
   // alert(nbrl);
    chaine='<table class="tabc table table-bordered" border="1">\n' +
        '                <thead class="dynamic-head">\n' +
        '                <tr class="cl" id="first-line"><td><h6 style="float: right"><a href="#" class="badge badge-primary">Joueur B</a></h6><br><h6 style="float: left"><a href="#" class="badge badge-success">Joueur A</a></h6></td>'

    for (var i=0;i<nbrc;i++){
        chaine+='<th>B'+(matrice[0][i].b);
    }


    chaine+='</tr></thead> <tbody class="dynamic-stuff">';
    let s='';
    for (var j=0;j<nbrl;j++){
       // alert(j);
        s+='<tr><th>A'+(matrice[j][0].a)+'</th>';
        for (var k=0;k<nbrc;k++){;
            s+='<td>('+matrice[j][k].aval+','+matrice[j][k].bval+')</td>'
        }
        s+='</tr>';
    }
    chaine+=s;
    chaine+='</tbody></table>'

    $("#dominance").append(chaine);
}

//methods
function cleanArray(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}
function getCol(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
        column.push(matrix[i][col]);
    }
    return column;
}
function deleteRow(arr, row) {
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    if(arr.length>0) {
        HTMLdisplayMatrix(arr);
    }
    newCountL--;
    return arr;
}
function deleteCol(arr, col) {

    for (var i = 0; i < arr.length; i++) {
        var row = arr[i];
        row.splice(col, 1);
    }
    HTMLdisplayMatrix(arr);
    newCountC--;
    return arr;
}
//attribuer un nome aux inputs
function giveName() {
    var rows=$('.dynamic-stuff input');var pos=0;var s1="",s2="";
    for(var i=1;i<=counter2;i++){
        //var pos2=0;
        for(var j=1;j<=counter1;j++){
            // var inputs=$(cols[j]).find(' input');
            //  alert(inputs.length);

            s1='A'+i+'B'+j;
            s2='B'+j+'A'+i;
            // var s2='B'+j+'A'+i;
            //alert((inputs[0]));
            $(rows[pos]).attr('name',s1);
            $(rows[pos+1]).attr('name',s2);
            pos+=2;
        }

    }

}
//construire la matrice des données
function buildDataMatrix() {
    var matriceA = new Array();
    for(var i=0; i<counter2; i++) {
        matriceA[i] = new Array();
    }

    // on parcourt les lignes...
   // alert(counter2+" lignes "+counter1+" cols");
    for(var i=0; i<counter2; i++){
        // ... et dans chaque ligne, on parcourt les cellules
        for(var j=0; j<counter1; j++) {


            var acible='input[name=A'+(i+1)+'B'+(j+1)+']';
            var bcible='input[name=B'+(j+1)+'A'+(i+1)+']';
            var aval=$(acible).val();
            var bval=$(bcible).val();
        //    alert(aval+" "+bval);
            var val=new Reponse(aval,bval,i+1,j+1);
            matriceA[i][j] =val;
        }
    }
    return matriceA;
}
//trouver les meilleures reponses
function findBestAnswerA(matriceA) {
    var bestAnswA=[];
    var oneCol=[];
    for(var i=0;i<counter1;i++){
        oneCol=getCol(matriceA,i);
        //alert(oneCol.length);
        var oneColVal=[];
        for(var j=0;j<oneCol.length;j++){
            let n=parseFloat(oneCol[j].aval);
            // alert(n);
            oneColVal.push(n);
        }
        let maxi=Math.max.apply(null, oneColVal);
        //  alert(maxi);
        for(var j=0;j<oneCol.length;j++){
            if(oneCol[j].aval>=maxi){
                //    alert(oneCol[j].aval);
                bestAnswA.push(oneCol[j]);
            }
        }
    }
    return bestAnswA;

}
function findBestAnswerB(matriceA) {
    var bestAnswB=[];
    var oneRow=[];
    for(var i=0;i<counter2;i++){
        oneRow=matriceA[i];
        //alert(oneCol.length);
        var oneRowVal=[];
        for(var j=0;j<oneRow.length;j++){
            let n=parseFloat(oneRow[j].bval);
            //  alert(n);
            oneRowVal.push(n);
        }
        let maxi=Math.max.apply(null, oneRowVal);
        //alert(maxi);
        for(var j=0;j<oneRow.length;j++){
            if(oneRow[j].bval>=maxi){
                //    alert(oneRow[j].bval);
                bestAnswB.push(oneRow[j]);
            }
        }
    }
    for(var j=0;j<bestAnswB.length;j++){
        let xx=bestAnswB[j];
        // alert("B"+xx.b+" :"+xx.bval+" est la meilleure réponse pour A"+xx.a);
    }
    return bestAnswB;

}
//trouver l'equilibre de Nash
function commonAnswers(bestA,bestB){
    commonValues=[];
    for (var i = 0; i < bestA.length; i++) {
        var x=bestA[i];
        for (var j = 0; j < bestB.length; j++) {
            var y=bestB[j];
            //console.log("B"+y.b+"A"+y.a);
            if(x.a==y.a&&x.b==y.b){
                commonValues.push(x);
            }
        }


    }
    return commonValues;
}
//determiner les strategies strictement dominantes
function sDomA(matriceA,lg1,lg2) {
    let Do=new Domination("A"+(lg1+1),"A"+(lg2+1));
   // alert(Do.D);
   // alert(counter1);
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
    for (var k=0;k<nbr_c;k++) {
   //     alert(parseFloat(matriceA[lg1][k].aval)<=parseFloat(matriceA[lg2][k].aval));
       // console.log("iteration "+k);
      //  console.log("lgs: "+lg1+" "+lg2);
      //  console.log(matriceA);
        if (parseFloat(matriceA[lg1][k].aval)<=parseFloat(matriceA[lg2][k].aval)){
           // alert(5);
            return null;
        }
        else {
            Do.d +=" ("+(parseFloat(matriceA[lg2][k].aval).toString())+")";
            Do.D +=" ("+(parseFloat(matriceA[lg1][k].aval).toString())+")";
       //     alert(Do.D);
        }
    }
   // alert(Do.D);
    //console.log(Do.D);
    return Do;
}
function strictDominanteA(matriceA){
    var domStrict=[];
  //  console.log(matriceA);
    //Domination
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
  //  alert("before elimination of rows "+newCountL + " x " + newCountC);
    for (var i=0;i<nbr_l ;i++){
        for (var j=0;j<nbr_l;j++){
            if(i!=j) {//ne pas le comparer avec lui même
                let res=sDomA(matriceA,i,j);
              //  console.log(res);
                if (res!=null){

                    domStrict.push(res);
                }
            }
        }
    }
    domStrict.push(' strictement ');
    return domStrict;
}
function sDomB(matriceA,cl1,cl2) {
    let Do=new Domination("B"+(cl1+1),"B"+(cl2+1));
    //alert("comparer entre "+cl1+" "+cl2);
    // alert(Do.D);
    // alert(counter1);
   // alert("counter lg: "+newCountL);
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
    for (var k=0;k<nbr_l;k++) {
        //alert("k="+k);
      //  alert(parseFloat(matriceA[k][cl1].bval)+"?"+parseFloat(matriceA[k][cl2].bval));
        //alert(parseFloat(matriceA[k][cl1].bval)<=parseFloat(matriceA[k][cl2].bval));
        if (parseFloat(matriceA[k][cl1].bval)<=parseFloat(matriceA[k][cl2].bval)){
            // alert(5);
            return null;
        }
        else {
            Do.d +=" ("+(parseFloat(matriceA[k][cl2].bval).toString())+")";
            Do.D +=" ("+(parseFloat(matriceA[k][cl1].bval).toString())+")";
            //     alert(Do.D);
        }
    }
    // alert(Do.D);
 //   console.log("dominance "+Do.D);
    return Do;
}
function strictDominanteB(matriceA){
    var domStrict=[];
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
    //Domination
    for (var i=0;i<nbr_l;i++){
        for (var j=0;j<nbr_l;j++){
            if(i!=j) {//ne pas le comparer avec lui même
                let res=sDomB(matriceA,i,j);
                //console.log(res);
                if (res!=null){

                    domStrict.push(res);
                }
            }
        }
    }

    domStrict.push(' strictement ');
    return domStrict;
}
//eliminer des strategies strictement dominées
function dEliminationA(matriceA,blackList){
    var index=[];
    blackList=cleanArray(blackList);
    //alert("elements to be removed: "+blackList.length);
    for (var i=0;i<blackList.length-1;i++){
        index.push(parseInt(blackList[i].d.charAt(1)));
        res=blackList[i];
        let ch='<div class="alert alert-success" role="alert">'
        ch+=(res.d+" est"+blackList[blackList.length-1]+" dominée par " +res.D)+'</div><hr>';
        $('#dominance').append(ch);
    }
    index.sort();
    index.reverse();//effacer de la fin
    index=cleanArray(index);
    for (var i=0;i<index.length;i++) {
        //alert("i'm deleting the line "+(index[i]-1));

        matriceA=deleteRow(matriceA,(index[i]));
    }
    //if(index.length!=0){HTMLdisplayMatrix(matriceA);}
    return matriceA;
}
function dEliminationB(matriceA,blackList){
    var index=[];
    blackList=cleanArray(blackList);
  //  alert(blackList.length);
   // console.log("nombre d'elements à effacer: "+blackList.length);
    for (var i=0;i<blackList.length-1;i++){
        index.push(parseInt(blackList[i].d.charAt(1)));
        res=blackList[i];
        let ch='<div class="alert alert-warning" role="alert">'
        ch+=(res.d+" est"+blackList[blackList.length-1]+" dominée par " +res.D)+'</div><hr>';
        $('#dominance').append(ch);
    }
    index.sort()
    index.reverse();//effacer de la fin
    index=cleanArray(index);
    for (var i=0;i<index.length;i++) {
        //alert(index[i]);
      //  console.log("effacer la clonne: "+(index[i]-1));
        matriceA=deleteCol(matriceA,index[i]-1);
    }
    //console.log("res: "+res);
   // if(index.length!=0){HTMLdisplayMatrix(matriceA);}
    return matriceA;
}
//determiner les strategies faiblement dominantes
function fDomA(matriceA,lg1,lg2) {
    let Do=new Domination("A"+(lg1+1),"A"+(lg2+1));
    let existe_au_moins_une_val_sup=false;
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
    // alert(Do.D);
    // alert(counter1);
    for (var k=0;k<nbr_c;k++) {
        //     alert(parseFloat(matriceA[lg1][k].aval)<=parseFloat(matriceA[lg2][k].aval));
        // console.log("iteration "+k);
        //  console.log("lgs: "+lg1+" "+lg2);
        //  console.log(matriceA);
        if (parseFloat(matriceA[lg1][k].aval)<parseFloat(matriceA[lg2][k].aval)){
            // alert(5);
            return null;//non faiblement dominée
        }
        else {
            Do.d += " (" + (parseFloat(matriceA[lg2][k].aval).toString()) + ")";
            Do.D += " (" + (parseFloat(matriceA[lg1][k].aval).toString()) + ")";
            if((matriceA[lg1][k].aval)>parseFloat(matriceA[lg2][k].aval))
            {
                existe_au_moins_une_val_sup=true;
            }
            //     alert(Do.D);
        }
    }
    // alert(Do.D);
    //console.log(Do.D);
    if(existe_au_moins_une_val_sup){return Do;} //egaux et une case est sup
    return null;// sont tous egaux
}
function faibleDominanteA(matriceA) {

    var domFaible=[];
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
    for (var i=0;i<nbr_l ;i++){
        for (var j=0;j<nbr_l;j++){
            if(i!=j) {//ne pas le comparer avec lui même
                let res=fDomA(matriceA,i,j);
                //  console.log(res);
                if (res!=null){
                    domFaible.push(res);
                }
            }
        }
    }
    change++;
domFaible.push('');
return domFaible
}
function fDomB(matriceA,cl1,cl2) {
    let Do=new Domination("B"+(cl1+1),"B"+(cl2+1));
    let existe_au_moins_une_val_sup=false;
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
    //alert("comparer entre "+cl1+" "+cl2);
    // alert(Do.D);
    // alert(counter1);
    // alert("counter lg: "+newCountL);
    for (var k=0;k<nbr_l;k++) {
        //alert("k="+k);
        //  alert(parseFloat(matriceA[k][cl1].bval)+"?"+parseFloat(matriceA[k][cl2].bval));
        //alert(parseFloat(matriceA[k][cl1].bval)<=parseFloat(matriceA[k][cl2].bval));
        if (parseFloat(matriceA[k][cl1].bval)<parseFloat(matriceA[k][cl2].bval)){
            // alert(5);
            return null;
        }
        else {
            Do.d += " (" + (parseFloat(matriceA[k][cl2].bval).toString()) + ")";
            Do.D += " (" + (parseFloat(matriceA[k][cl1].bval).toString()) + ")";
            if(parseFloat(matriceA[k][cl1].bval)>parseFloat(matriceA[k][cl2].bval)) {
                existe_au_moins_une_val_sup=true;
            }

        }
    }
    // alert(Do.D);
  //  console.log("dominance "+Do.D);
    if(existe_au_moins_une_val_sup){return Do;}return null;
}
function faibleDominanteB(matriceA){
    var domFaible=[];
    let nbr_l=matriceA.length;
  //  alert("nbr ligne:::"+nbr_l);
    let nbr_c=matriceA[0].length;
    //Domination

    for (var i=0;i<nbr_c;i++){
        for (var j=0;j<nbr_c;j++){
            if(i!=j) {//ne pas le comparer avec lui même
                let res=fDomB(matriceA,i,j);
                //console.log(res);
                if (res!=null){
                    domFaible.push(res);
                 }
            }
        }
    }
    change++;
    domFaible.push('');
    return domFaible;
}
//determiner issue du jeu
function gameIssue(matriceA){
    bestAnswA=[];
    let nbr_l=matriceA.length;
    let nbr_c=matriceA[0].length;
    //alert("ok7");
   if (nbr_c ==1){
       oneCol=getCol(matriceA,0);
       var oneColVal=[];
       for(var j=0;j<oneCol.length;j++){
           let n=parseFloat(oneCol[j].aval);
            //alert(n);
           oneColVal.push(n);
       }

       let maxi=Math.max.apply(null, oneColVal);
       //alert(maxi);
       for(var j=0;j<oneCol.length;j++){
           if(oneCol[j].aval>=maxi){
               //    alert(oneCol[j].aval);
               bestAnswA.push(oneCol[j]);
           }
       }
      // console.log(bestAnswA.length);

       return bestAnswA;
   }
   if (nbr_l ==1){
       oneRow=matriceA[0];
       //alert(oneCol.length);
       var oneRowVal=[];
       for(var j=0;j<oneRow.length;j++){
           let n=parseFloat(oneRow[j].bval);
           //  alert(n);
           oneRowVal.push(n);
       }
       let maxi=Math.max.apply(null, oneRowVal);
       //alert(maxi);
       for(var j=0;j<oneRow.length;j++){
           if(oneRow[j].bval>=maxi){
               //    alert(oneRow[j].bval);
               bestAnswA.push(oneRow[j]);
           }
       }
      // console.log(bestAnswA.length);

       return bestAnswA;
    }
   //alert(bestAnswA.length);

   return bestAnswA;
}
//determiner le niveau de sécurité pour chaque joueur
function nivSecA(matriceA){
    var minimums=[];
    var oneRow=[];
    var oneRowVal=[];
    for(var i=0;i<counter2;i++){
        oneRow=matriceA[i];
        for(var j=0;j<oneRow.length;j++) {
            oneRowVal.push((oneRow[j].aval));
        }
        let mini=Math.min.apply(null, oneRowVal);
        //  alert(maxi);
        for(var j=0;j<oneRow.length;j++){
            if(oneRow[j].aval==mini){
                //    alert(oneCol[j].aval);
                minimums.push(oneRow[j]);
            }
        }
    }
    var maxis=[];
     for(var i=0;i<minimums.length;i++)
     {
         maxis.push(minimums[i].aval);

     }
    let maxi=Math.max.apply(null, maxis);

     var secured=[];
    for(var i=0;i<counter2;i++){
        let found=false;
        oneRow=matriceA[i];
       // alert(i);
        for(var j=0;j<oneRow.length;j++) {
          //  alert(j);

            if(oneRow[j].aval==maxi&&!found){
                let s=new securite(maxi,oneRow[j].a);
                secured.push(s);
               // console.log(s);
                found=true;

            }
        }
    }


    return secured;

}
function nivSecB(matriceA){
    var minimums=[];
    var oneRow=[];
    var oneRowVal=[];
    for(var i=0;i<counter1;i++){
      //  alert('i= '+i);
        oneRow=getCol(matriceA,i);
        for(var j=0;j<oneRow.length;j++) {
          //  alert(oneRow[j].bval);
            oneRowVal.push((oneRow[j].bval));

        }
        let mini=Math.min.apply(null, oneRowVal);
      //  alert(mini);
        //  alert(maxi);
        for(var j=0;j<oneRow.length;j++){
            if(oneRow[j].bval==mini){
                //    alert(oneCol[j].aval);
                minimums.push(oneRow[j]);
            }
        }
    }
    var maxis=[];
    for(var i=0;i<minimums.length;i++)
    {
        maxis.push(minimums[i].bval);

    }
    let maxi=Math.max.apply(null, maxis);

    var secured=[];
    for(var i=0;i<counter1;i++){
        oneRow=getCol(matriceA,i);
        let found=false;
        for(var j=0;j<counter2;j++) {
            if(oneRow[j].bval==maxi&&!found){
                let s=new securite(maxi,oneRow[j].b);
                secured.push(s);
               // console.log(s);
                found=true;
            }
        }
    }


    return secured;

}
function isDominate(a,b) {
    if((parseFloat(a.aval)>parseFloat(b.aval))&&(parseFloat(a.bval)>=parseFloat(b.bval))){
       // console.log((parseFloat(a.aval)>parseFloat(b.aval))&&(parseFloat(a.bval)>=parseFloat(b.bval)))
       // console.log(parseFloat(a.aval)+'>'+parseFloat(b.aval))+' && '+(parseFloat(a.bval)+'>='+parseFloat(b.bval));


        return true;
    }
    if((parseFloat(a.aval)>=parseFloat(b.aval))&&(parseFloat(a.bval)>parseFloat(b.bval))){
      //  console.log((parseFloat(a.aval)>=parseFloat(b.aval))&&(parseFloat(a.bval)>parseFloat(b.bval)))
       // console.log(parseFloat(a.aval)+'>='+parseFloat(b.aval))+' && '+(parseFloat(a.bval)+'>'+parseFloat(b.bval));

        return true;
    }
    return false;
}
function domPareto(matriceA){
     var res=[];
    for(var i=0; i<counter2; i++) {
        for(var j=0; j<counter1; j++) {
            let a=matriceA[i][j];
            for(var ii=0; ii<counter2; ii++) {
                for(var jj=0; jj<counter1; jj++) {
                    if(i!=ii||j!=jj){
                        let b=matriceA[ii][jj];
                        if (isDominate(a,b)) {
                            let p = new Pareto(a, b);
                            res.push(p);
                        }
                    }
                }
            }
        }
    }
    return res;

}
function isOptimum(profil,dominated) {
    for (var k = 0; k < dominated.length; k++) {
        if(profil.a==dominated[k].d.a&&profil.b==dominated[k].d.b){
            return false;
        }
    }
    return  true;
}
function optimumPareto(matrice,dominated){
    optimums=[];
    let tab=dominated;
    for(var i=0; i<counter2; i++) {
        for (var j = 0; j < counter1; j++) {
            if (isOptimum(matrice[i][j], dominated)) {
                optimums.push(matrice[i][j]);
            }
        }
    }
    return optimums;
}

// classes
let Reponse = class {
    constructor(aval, bval, a, b) {
        this.aval = aval;
        this.bval = bval;
        this.a = a;
        this.b = b;
    }

}
let Domination = class {
    constructor(D,d) {
        this.D=D;this.d=d;
    }

}
let Pareto = class {
    constructor(D,d) {
        this.D=D;this.d=d;
    }

}
let securite = class{
    constructor(val,indice) {
        this.val=val;this.indice=indice;
    }

}
//main program
var counter1=2;
var counter2=2; //nb ligne
var newCountL=0;
var newCountC=0;
var change=1;
$(document).ready(


    function () {
       // $('input').addClass("form-control");

        $('.add-one-line').click(
            function () {
                counter2++;
                $('.dynamic-element').find('.cl').first().clone().appendTo('.dynamic-stuff').fadeIn(100);
                //var tab=
                $('.dynamic-stuff tr').last().find('th').append(counter2)
            }
        );

        $('.add-one-col').click(
            function () {
                counter1++;
                var th= '<th>0</th>'
                var td= '<td>0</td>'

                $('.dynamic-stuff .cl').append('<td><input class="form-control j1" type="number" value="0"><input class="form-control j2" type="number" value="0"></td>');
                $('.dynamic-element .cl').append('<td><input class="form-control j1" type="number" value="0"><input class="form-control j2" type="number" value="0"></td>');
                $('.dynamic-head .cl').append('<th>B'+counter1+'</th>');
            }
        );
        $('.del-one-line').click(
            function(){
                if(counter2>2){
                    $('.dynamic-stuff tr').last().remove();
                    counter2--;
                }
            }
        );
        $('.del-one-col').click(
            function(){
                if(counter1>2){
                    $('.dynamic-stuff .cl td:last-child').remove();
                    $('.dynamic-element .cl td').last().remove();
                    $('.dynamic-head .cl').find('th').last().remove();

                    counter1--;
                }
            }
        );

        $('.btn_res').click(
            function () {
                $('.problem').hide();
                $('.solution').show();
                newCountC=counter1;
                newCountL=counter2;
                giveName();

                let matriceA = buildDataMatrix();
                let ch0='<div class="alert alert-info" role="alert">Meilleures réponses de A: ';
                let bestA=findBestAnswerA(matriceA);
                for (var i=0;i<bestA.length;i++){
                    ch0+=" (A"+bestA[i].a+",B"+bestA[i].b+") \n";
                }
                ch0+='<br>Meilleures réponses de B: ';
                let bestB=findBestAnswerB(matriceA);
                    for (var i=0;i<bestB.length;i++){
                    ch0+=" (A"+bestB[i].a+",B"+bestB[i].b+") \n";
                }
                ch0+='<hr>Les équilibres de Nash sont: ';

                let interAnswers=commonAnswers(bestA,bestB);
                for (var i=0;i<interAnswers.length;i++){
                    ch0+=" (A"+interAnswers[i].a+",B"+interAnswers[i].b+") \n";
                }
                ch0+='</div>';
                $('#nash').append(ch0);
                //$('nash')

// pareto et securite
                let secA=nivSecA(matriceA);
              //  console.log("endA");
                let secB=nivSecB(matriceA);
                let ch='<div class="alert alert-info" role="alert">Niveau de sécurité pour A: <br/>';
                for (var i = 0; i <secA.length;i++){
                    ch+='Strategie A'+secA[i].indice+' ('+secA[i].val+')<br>';
                }
                ch+='<hr>Niveau de sécurité pour B:<br>'
                for (var i = 0; i <secB.length;i++){
                    ch+='Strategie B'+secB[i].indice+' ('+secB[i].val+')<br>';
                }
                ch+='</div>'
                $('#pareto').append(ch);

                // pareto
                let dominated=domPareto(matriceA);
                let ch2='<div class="alert alert-info" role="alert">Domination au sens de Pareto: <br/>';
                for (var i = 0; i <dominated.length;i++){
                    ch2+='A'+dominated[i].D.a+'B'+dominated[i].D.b+' domine '+
                        'A'+dominated[i].d.a+'B'+dominated[i].d.b+' au sens de pareto<br/>';
                }
                ch2+='</div>'
                $('#pareto').append(ch2);
                ///A GERER §§§§!!!!!
                let optimums=optimumPareto(matriceA,dominated);

                 ch2='<div class="alert alert-info" role="alert">Optimum de Pareto: <br/>';
                for (var i = 0; i <optimums.length;i++){
                    ch2+= 'A'+optimums[i].a+'B'+optimums[i].b+'('+optimums[i].aval+','+optimums[i].bval+') est un optimum pareto<br>';
                }
                ch2+='</div>'
                $('#pareto').append(ch2);



// dominance
                var canSimplify=true;
                let simplified=matriceA;
                HTMLdisplayMatrix(matriceA);
                while(canSimplify){
                    var ex_cl=newCountC;
                    var ex_lg=newCountL;
                    if(ex_cl>1) {
                        let stDomB = strictDominanteB(simplified);
                        simplified = dEliminationB(simplified, stDomB);
                    }

                    if(ex_lg>1) {
                        let stDomA = strictDominanteA(simplified);
                       // alert('ok1');
                       // console.log(stDomA);
                       // console.log(simplified);
                        simplified = dEliminationA(simplified, stDomA);
                       // console.log(simplified);

                    }
                   // alert("nouveau"+newCountL+" x "+newCountC);



                    //console.log(simplified);


                    //console.log(simplified);
                    if((ex_cl==newCountC&&ex_lg==newCountL)||newCountL==1||newCountC==1){
                        canSimplify=false;
                        //alert("end while et exit");
                    }
                  //  alert("nouveau"+newCountL+" x "+newCountC);

                }
                if(newCountC>1&&newCountL>1){canSimplify=true;}
                let c=1;
                while(canSimplify){
                    //alert("iteration: "+c);c++;
                    var ex_cl=newCountC;
                    var ex_lg=newCountL;
                    //alert("ancien "+ex_lg+" x "+ex_cl);

                    //alert("nouveau"+newCountL+" x "+newCountC);

                    if(ex_lg>1) {
                       // alert("lignes restantes: "+ex_lg);
                        let fbDomA = faibleDominanteA(simplified);
                        for (var i=0;i<fbDomA.length;i++){
                          //  console.log(fbDomA[i]);
                        }
                        // alert('ok1');
                        // console.log(stDomA);
                        // console.log(simplified);
                        simplified = dEliminationA(simplified, fbDomA);
                        // console.log(simplified);

                    }
                     if(ex_cl>1) {
                         // alert('ok2');
                         let fbDomB = faibleDominanteB(simplified);
                         for (var i=0;i<fbDomB.length;i++){
                           //  console.log("B");
                           //  console.log(fbDomB[i]);
                         }
                         //  alert('ok3');
                         // console.log("delete"+ stDomB.length);
                         //console.log(simplified);
                         simplified = dEliminationB(simplified, fbDomB);
                         //console.log(simplified);
                     }
                    // alert("nouveau"+newCountL+" x "+newCountC);



                    //console.log(simplified);


                    //console.log(simplified);
                    if((ex_cl==newCountC&&ex_lg==newCountL)||newCountL==1||newCountC==1){
                        canSimplify=false;
                       // alert("end while faible et exit");
                    }
                    //  alert("nouveau"+newCountL+" x "+newCountC);

                }
/*/*/
                /*newCountL=simplified2.length;
                newCountC=simplified2[0].length;*/


                let issues=gameIssue(simplified);

                if (issues.length==0) {
                    let ch='<div class="alert alert-info" role="alert">Pas d\'issues du jeu</div>'
                    $('#dominance').append(ch);

                }
                else {
                    let ch='<div class="alert alert-info" role="alert">Issues du jeu: '

                    for (var i = 0; i <issues.length;i++)
                    {
                        ch+=" A"+issues[i].a+"B"+issues[i].b+": ("+issues[i].aval+","+issues[i].bval+") "
                    }
                    ch+='</div><hr>';
                    $('#dominance').append(ch);
                 }



            }

        );










    });