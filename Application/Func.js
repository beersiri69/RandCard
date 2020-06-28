const card = ['JC','JD','JH','JS','QC','QD','QH','QS','KC','KD','KH','KS','AC','AD','AH','AS',
'C2','C3','C4','C5','C6','C7','C8','C9','C10',
'D2','D3','D4','D5','D6','D7','D8','D9','D10',
'H2','H3','H4','H5','H6','H7','H8','H9','H10',
'S2','S3','S4','S5','S6','S7','S8','S9','S10']

const imgElem = document.querySelector('img');
var Cardleft;
var firebaseRef;
var ref;
var DBitem;
var keyarr = [];

window.onload=function(){
    firebaseRef=firebase.database().ref("Card01");
    ref = firebase.database().ref().child("Card01").orderByChild('Card01');
    GetleftUpdate();
    //console.log("Loaded");    
}
function RandomValue(){
    if(Cardleft == 0){
        alert("Not Enough Card !!");
        return;
    }    
    Getkeyarr();
    Randnum = Math.floor(Math.random() * card.length);
    for(i=0;i<=keyarr.length;i++){
        if(keyarr[i] == card[Randnum]){
            Randnum = Math.floor(Math.random() * card.length);
            i=0;   
        }
    }    
    UpdateCard(card[Randnum]);
    Setleft();    
}


function Setleft(){
    Cardleft--;
    firebaseRef.child('Joke').set(Cardleft);
}
function Resetall(){   
    Getkeyarr();    
    //console.log(keyarr); 
    if(keyarr.length != 0){
        keyarr.forEach( (val) => {
            firebaseRef.child(val).remove();
        });
    }    
    firebaseRef.child('Joke').set(parseInt("52"));
    imgElem.src = "PNG/red_back.png"    
    location.reload();
    alert("Reset!!");
}
function Getkeyarr(){
    Object.entries(DBitem).forEach(entry => {
        if(entry[0] !== "Joke"){
            keyarr.push(entry[0]);
        }
    });
}
function UpdateCard(CardName){
    Keyupdate = getKeyByValue(DBitem, "Last");    
    if(typeof Keyupdate !== 'undefined'){
        firebaseRef.child(Keyupdate).set("Used");
    }    
    firebaseRef.child(CardName).set("Last");
}
function getKeyByValue(object, value) { 
    return Object.keys(object).find(key =>  
            object[key] === value); 
}
function UpdatePrintDB(){
    ref.once('value',function(snap) {
        DBitem = snap.val();
        //console.log(DBitem);
        Updateimg(DBitem);  
    });    
}
function Updateimg(DBsearch){
    imgshow  = getKeyByValue(DBsearch, "Last")
    //console.log("Showimg : " + imgshow);
    if(typeof imgshow !== 'undefined'){        
        imgPath = "PNG/" + imgshow + ".png";
        imgElem.src = imgPath;
    }    
}
function GetleftUpdate(){    
    var firebaseRef=firebase.database().ref("Card01");
    firebaseRef.child("Joke").on('value',function(snapshot) {
    Cardleft = snapshot.val(); 
    //console.log('Joke:', Cardleft);
    document.getElementById("Cardleft").innerHTML = Cardleft;
    UpdatePrintDB();    
  });   
}

document.getElementById("RandBtn").addEventListener("click", RandomValue);
document.getElementById("ResetBtn").addEventListener("click", Resetall);

