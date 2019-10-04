
function calculate(A=5, B=3, O=4){

return new Promise((resolve, reject)=>{

    A = Number(document.getElementById('jugA').value);
    B = Number(document.getElementById('jugB').value);
    O = Number(document.getElementById('output').value);
    const pastStates =[];
    const checkPastState = (a,b)=>{
        const obj =JSON.stringify({a,b});
        const status = pastStates.some(e=>e==obj);
      return status;
    }

    const setPastState = (a,b)=>{
        pastStates.push(JSON.stringify({a,b}))
    }

    const cycles = Number(document.getElementById('cycles').value);
      console.log(A,B,O,cycles)
    const Q=[ 
        {a:0,b:0,dir:2},
        {a:0,b:0,dir:3},
    ];
    
    let result;
      
    const pour = ({a,b, dir=0,trace=[]})=>{
          
            //dir
            // 0 = A=>B
            // 1 = B=>A
            // 2 = A=FILL
            // 3 = B=FILL
            // 4 = A=EMPTY
            // 5 = B=EMPTY
          let traceElement='';
          switch(dir){
            case 0:
                if(b<B && a>0){
                b = b+a;
                if(b>B){
                const reminder =  b - B;
                b=B;
                a = reminder;  
                } else {
                    a=0;
                }
                } else return false;
                traceElement = 'Pour A to B';
                break;
            
            case 1:
                if(a<A && b>0){
                a = b+a;
                if(a>A){
                const reminder =  a - A;
                a=A;
                b = reminder;  
                } else{
                    b=0;
                }
                } else return false;
                traceElement = 'Pour B to A';
                break;
            case 2:
                if(a==A) return false;
                a=A;
                traceElement = 'Make A Full';
                break;
            case 3:
                if(b==B) return false;
                b=B;
                traceElement = 'Make B full';
                break;
            case 4:
                if(a==0) return false;
                a=0;
                traceElement = 'Empty A';
                break;
            case 5:
                if(b==0) return false;
                b=0;
                traceElement = 'Empty B';
                break;
        }
          
          trace.push(traceElement+(";"+a+";"+b));
      
          if(a==O || b==O){
             result = { jug:(a==O?'A':'B'), trace }; 
             return true;
        } else{
          return {a,b,dir,trace:[...trace]};
              
        }
          
    }
    
    
    
    do{
      const firstElement = JSON.parse(JSON.stringify(Q.splice(0,1)));
      let newState = pour(firstElement[0]);
    
      if(newState === true){
          break;
      }
    
      if(newState){
          if(checkPastState(newState.a,newState.b)){
            continue;
        } else{
            setPastState(newState.a,newState.b);
        }
        const trace = [...newState.trace];
      Q.push({...newState, trace, dir:0});
      Q.push({...newState, trace, dir:1});
      Q.push({...newState, trace, dir:2});
      Q.push({...newState, trace, dir:3});
      Q.push({...newState, trace, dir:4});
      Q.push({...newState, trace, dir:5});
      }
      
    } while(Q.length && Q.length<cycles);
    
    if(result){
        resolve(result);
    } else{
        alert("Taking Too much of Queue memory! Consider changing allowed queue size");
        reject(false);
    }
})
}

const submit = ()=>{
    const oldTime = new Date();
    document.getElementById('progress').style.visibility="visible";
    document.getElementById('result').style.display="none";
    setTimeout(()=>{
    calculate().then(value=>{
    if(value){
        const rows =  value.trace.map((e, i)=>{
            const items = e.split(';');
            return `<tr>
            <th scope="row">${i+1}</th>
            <td>${items[0]}</td>
            <td ${value.jug=='A' && i== value.trace.length-1 ? 'class="red"':''}>${items[1]}</td>
            <td ${value.jug=='B' && i== value.trace.length-1 ? 'class="red"':''}>${items[2]}</td>
          </tr>`
        });

        document.getElementById('result').style.display="block";
        document.getElementById('resultJug').innerHTML="Got result in "+value.jug+' after '+ value.trace.length+' steps';
        document.getElementById('trace').innerHTML=`<table class="table">
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Action</th>
            <th scope="col">Jug A (${document.getElementById('jugA').value})</th>
            <th scope="col">Jug B (${document.getElementById('jugB').value})</th>
          </tr>
        </thead>
        <tbody>
       ${rows.join('')}
        </tbody>
      </table>`
    }
    document.getElementById('progress').style.visibility="hidden";
    const currentTime = new Date();
    const diff = currentTime.getTime() - oldTime.getTime();
    console.log("Time: ",diff,"value:", value)
    })
    .catch(()=>{
    document.getElementById('progress').style.visibility="hidden";
    })      
},100)
}
