// - - - - G L O B A L - F U N C T I O N S - - - - 

function matrix_latex(matrix){ // - - - MATRIX TO LATEX - - - 
    let latex='\\[\\begin{bmatrix}';
    for(let i=0; i<matrix.length; i++){
        const row_latex=matrix[i].map(val => {
            if(Number.isInteger(val)) return val;

            try{
                const frac=math.fraction(val);
                return `\\frac{${frac.n}}{${frac.d}}`;
            }catch(e){
                return val.toFixed(4);
            }
        }).join(' & ');

        latex+=row_latex;
        if(i!==matrix.length-1) latex+=' \\\\ ';
    }
    latex+='\\end{bmatrix}\\]';
    return latex;
}

function create_table(rows, cols, className){ // - - - CREATE TABLE - - - 
    const table=document.createElement('div');
    table.className=className;
    for(let i=0; i<rows; i++){
        const row=document.createElement('div');
        row.className='text_table';
        for(let j=0; j<cols; j++){
            const cell=document.createElement('textarea');
            cell.rows=1;
            cell.cols=3;
            cell.style.margin='0.3rem';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
}

function read_matrix(table){ // - - - TABLE TO MATRIX - - - 
    const rows_divs=table.querySelectorAll('.text_table');
    const matrix=[];
    for(let row of rows_divs){
        const values=[];
        const cols_divs=row.querySelectorAll('textarea');
        for(let col of cols_divs){
            let text=col.value.trim();
            try{
                const val=math.evaluate(text);
                if(typeof val!=='number' || !isFinite(val)) return null;
                values.push(val);
            }catch(e){
                return null;
            }
        }
        matrix.push(values);
    }
    return matrix;
}

function determinant(A){ // - - - DETERMINANT - - - 
    const n=A.length;
    let det=0;
     
    if(n==1){
        det=A[0][0];
    }else{
        for(let j=0; j<n; j++){
            det+=(A[0][j]*cofactor(A, 0, j));
        }
    }
    return det;
}
 
function cofactor(A, row, col){ // - - - COFACTOR MATRIX - - - 
    const n=A.length;
    const submatrix=[];
    for(let i=0; i<n; i++){
        if(i!==row){
            const aux_row=[];
            for(let j=0; j<n; j++){
                if(j!==col){
                    aux_row.push(A[i][j]);
                }
            }
            submatrix.push(aux_row);
        }
    }
    return Math.pow(-1, row+col)*determinant(submatrix);
}

// - - - - B U T T O N S - F U N C T I O N S - - - - 

function sum_subs(n){ // - - - SUM AND SUBSTRACTION - - - 
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs= n===1 ? document.querySelectorAll('#sum .box_1 textarea') : document.querySelectorAll('#subs .box_1 textarea');
    const rows=parseInt(inputs[0].value);
    const cols=parseInt(inputs[1].value);

    if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
        alert('Ingrese números válidos para las filas y columnas.');
        return;
    }

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    let matrixA=[];
    const tableA=create_table(rows, cols, 'matrixA');
    tableA.style.marginTop='1rem';
    const following_button=document.createElement('button');
    following_button.innerText='Siguiente';
    following_button.className='button';
    following_button.onclick=() => show_following();
    
    let matrixB=[];
    const tableB=create_table(rows, cols, 'matrixB');
    tableB.style.marginTop='1rem';
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_sumsub();

    container.appendChild(document.createElement('h2')).innerText='Matriz A';
    container.appendChild(tableA);
    container.appendChild(following_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';

    function show_following(){
        matrixA=read_matrix(tableA);

        if(!matrixA){
            alert('Ningun espacio puede quedar vacio.');
            return;
        }

        container.innerHTML='';
        container.appendChild(document.createElement('h2')).innerText='Matriz B';
        container.appendChild(tableB);
        container.appendChild(calc_button);
    }

    function calculate_sumsub(){
        matrixB=read_matrix(tableB);

        if(!matrixB){
            alert('Ningún espacio puede quedar vacio.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const matrixR=[];
        for(let i=0;  i<rows; i++){
            const values=[];
            for(let j=0; j<cols; j++){
                if(n==1){
                    values.push(matrixA[i][j]+matrixB[i][j]);
                }else{
                    values.push(matrixA[i][j]-matrixB[i][j]);
                }
                
            }
            matrixR.push(values);
        }

        const result= n===1 ? document.getElementById('sum') : document.getElementById('subs');
        const symbol= n===1 ? '+' : '-';
        const original_res=result.innerHTML;
        result.innerHTML='';
        
        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ B = ${matrix_latex(matrixB).slice(2, -2)} \\]
            \\[ A ${symbol} B = ${matrix_latex(matrixR).slice(2, -2)} \\]
        </div>`;

        const restart_button=document.createElement('button');
        restart_button.innerText='Nuevo cálculo';
        restart_button.className='button';
        restart_button.onclick=() => {
            result.classList.remove('active');
            setTimeout(() => {
                result.innerHTML=original_res;
                result.classList.add('active');
            }, 400);
        }

        result.appendChild(restart_button);
        MathJax.typeset();
    }
}

function product(){ // - - - PRODUCT - - - 
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('#product .box_1 textarea');
    const rowsA=parseInt(inputs[0].value);
    const colsA=parseInt(inputs[1].value);
    const rowsB=parseInt(inputs[2].value);
    const colsB=parseInt(inputs[3].value);

    if(isNaN(rowsA) || isNaN(colsA) || isNaN(rowsB) || isNaN(colsB) || rowsA<=0 || colsA<=0 || rowsB<=0 || colsB<=0){
        alert('Ingrese números válidos para las filas y columnas.');
        return;
    }

    if(colsA!==rowsB){
        alert('El número de columnas de A debe ser igual al número de filas de B.');
        return;
    }

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    let matrixA=[];
    const tableA=create_table(rowsA, colsA, 'matrixA');
    tableA.style.marginTop='1rem';
    const following_button=document.createElement('button');
    following_button.innerText='Siguiente';
    following_button.className='button';
    following_button.onclick=() => show_following();

    let matrixB=[];
    const tableB=create_table(rowsB, colsB, 'matrixB');
    tableB.style.marginTop='1rem';
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_product();

    container.appendChild(document.createElement('h2')).innerText='Matriz A';
    container.appendChild(tableA);
    container.appendChild(following_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';

    function show_following(){
        matrixA=read_matrix(tableA);

        if(!matrixA){
            alert('Ningun espacio puede quedar vacio.');
            return;
        }

        container.innerHTML='';
        container.appendChild(document.createElement('h2')).innerText='Matriz B';
        container.appendChild(tableB);
        container.appendChild(calc_button);
    }

    function calculate_product(){
        matrixA=read_matrix(tableA);
        matrixB=read_matrix(tableB);

        if(!matrixA || !matrixB){
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';
        
        const matrixR=[];
        for(let i=0; i<rowsA; i++){
            const row=[];
            for(let j=0; j<colsB; j++){
                let sum=0;
                for(let k=0; k<colsA ; k++){
                    sum=sum+(matrixA[i][k]*matrixB[k][j]);
                }
                row.push(sum);
            }
            matrixR.push(row);
        }

        const result=document.getElementById('product');
        const original_res=result.innerHTML;
        result.innerHTML='';

        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ B = ${matrix_latex(matrixB).slice(2, -2)} \\]
            \\[ AB = ${matrix_latex(matrixR).slice(2, -2)} \\]
        </div>`;

        const restart_button=document.createElement('button');
        restart_button.innerText='Nuevo cálculo';
        restart_button.className='button';
        restart_button.onclick=() => {
            result.classList.remove('active');
            setTimeout(() => {
                result.innerHTML=original_res;
                result.classList.add('active');
            }, 400);
        }

        result.appendChild(restart_button);
        MathJax.typeset();
    }
}

function scal(){ // - - - SCALAR - - - 
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('#scal .box_1 textarea');
    const rows=parseInt(inputs[0].value);
    const cols=parseInt(inputs[1].value);
    let scalar;
    try{
        scalar=math.fraction(inputs[2].value);
    }catch(e){
        alert('Ingrese un escalar válido (número o fracción).');
        return;
    }

    if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0 || isNaN(scalar)){
        alert('Ingrese números válidos para las filas, las columnas y el escalar.');
        return;
    }

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    let matrixA=[];
    const tableA=create_table(rows, cols, 'matrixA');
    tableA.style.marginTop='1rem';
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_scal();

    container.appendChild(document.createElement('h2')).innerText='Matriz A';
    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';

    function calculate_scal(){
        matrixA=read_matrix(tableA);

        if(!matrixA){
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const matrixR=[];
        for(let i=0; i<rows; i++){
            const values=[];
            for(let j=0; j<cols; j++){
                values.push(math.number(math.multiply(matrixA[i][j], scalar)));
            }
        matrixR.push(values);
        }

        const result=document.getElementById('scal');
        const original_res=result.innerHTML;
        result.innerHTML='';

        let scalar_latex=Number.isInteger(scalar) ? scalar : `\\frac{${scalar.n}}{${scalar.d}}`;

        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ k = ${scalar_latex} \\]
            \\[ kA = ${matrix_latex(matrixR).slice(2, -2)} \\]
        </div>`;

        const restart_button=document.createElement('button');
        restart_button.innerText='Nuevo cálculo';
        restart_button.className='button';
        restart_button.onclick=() => {
            result.classList.remove('active');
            setTimeout(() => {
                result.innerHTML=original_res;
                result.classList.add('active');
            }, 400);
        }

        result.appendChild(restart_button);
        MathJax.typeset();
    }
}

function trans(){ // - - - TRANSPOSED - - - 
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('#trans .box_1 textarea');
    const rows=parseInt(inputs[0].value);
    const cols=parseInt(inputs[1].value);

    if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
        alert('Ingrese números válidos para las filas y columnas.');
        return;
    }

    if(rows!==cols){
        alert('La matriz debe ser cuadrada.');
        return;
    }

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    let matrixA=[];
    const tableA=create_table(rows, cols, 'matrixA');
    tableA.style.marginTop='1rem';
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_trans();

    container.appendChild(document.createElement('h2')).innerText='Matriz A';
    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';

    function calculate_trans(){
        matrixA=read_matrix(tableA);

        if(!matrixA){
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const matrixR=[];
        for(let i=0; i<rows; i++){
            matrixR[i]=[];
            for(let j=0; j<cols; j++){
                matrixR[i][j]=matrixA[j][i];
            }
        }

        const result=document.getElementById('trans');
        const original_res=result.innerHTML;
        result.innerHTML='';
        
        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ A^T = ${matrix_latex(matrixR).slice(2, -2)} \\]
        </div>`;

        const restart_button=document.createElement('button');
        restart_button.innerText='Nuevo cálculo';
        restart_button.className='button';
        restart_button.onclick=() => {
            result.classList.remove('active');
            setTimeout(() => {
                result.innerHTML=original_res;
                result.classList.add('active');
            }, 400);
        }

        result.appendChild(restart_button);
        MathJax.typeset();
    }
}

function det(){ // - - - DETERMINANT - - - 
     const back=document.getElementById('back');
     document.body.style.overflow='hidden';
     back.innerHTML='';
 
     const inputs=document.querySelectorAll('#det .box_1 textarea');
     const rows=parseInt(inputs[0].value);
     const cols=parseInt(inputs[1].value);
 
     if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
         alert('Por favor, ingrese números válidos para filas y columnas.');
         return;
     }
 
     if(rows!==cols){
         alert('La matriz debe ser cuadrada.');
         return;
     }
 
     const container=document.createElement('div');
     container.style.display='flex';
     container.style.flexDirection='column';
     container.style.alignItems='center';
     container.style.padding='2rem';
     container.style.backgroundColor='white';
     container.style.margin='5rem auto';
     container.style.width='fit-content';
 
     let matrixA=[];
     const tableA=create_table(rows, cols, 'matrixA');
     tableA.style.marginTop='1rem';
     const calc_button=document.createElement('button');
     calc_button.innerText='Calcular';
     calc_button.className='button';
     calc_button.onclick=() => calculate_det();
 
     container.appendChild(document.createElement('h2')).innerText='Matriz A';
     container.appendChild(tableA);
     container.appendChild(calc_button);
 
     back.appendChild(container);
     back.style.display='flex';
     back.style.justifyContent='center';
     back.style.alignItems='center';
 
     function calculate_det(){
         matrixA=read_matrix(tableA);
         const matrix_aux=read_matrix(tableA);
 
         if(!matrixA){
             alert('Ningún espacio puede quedar vacío.');
             return;
         }
 
         document.body.style.overflow='auto';
         back.style.display='none';
 
         let det=determinant(matrixA); // Falta hacer que si el determinante sale en fracción se muestre como fracción en latex.
 
         const result=document.getElementById('det');
         const original_res=result.innerHTML;
         result.innerHTML='';
 
         result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
             \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
             \\[ \\det(A) = ${det} \\]
         </div>`;
 
         const restart_button=document.createElement('button');
         restart_button.innerText='Nuevo cálculo';
         restart_button.className='button';
         restart_button.onclick=() => {
             result.classList.remove('active');
             setTimeout(() => {
                 result.innerHTML=original_res;
                 result.classList.add('active');
             }, 400);
         }
 
         result.appendChild(restart_button);
         MathJax.typeset();
     }
 }

function inverse(){ // - - - INVERSE - - - 
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('#inv .box_1 textarea');
    const rows=parseInt(inputs[0].value);
    const cols=parseInt(inputs[1].value);

    if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
        alert('Ingrese números válidos para las filas y columnas.');
        return;
    }

    if(rows!==cols){
        alert('La matriz debe ser cuadrada.');
        return;
    }

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    let matrixA=[];
    const tableA=create_table(rows, cols, 'matrixA');
    tableA.style.marginTop='1rem';
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_inv();

    container.appendChild(document.createElement('h2')).innerText='Matriz A';
    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';

    function calculate_inv(){
        matrixA=read_matrix(tableA);
        const matrix_aux=read_matrix(tableA);

        if(!matrixA){
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const identity=[];
        for(let i=0; i<rows; i++){
            const row=[];
            for(let j=0; j<cols; j++){
                if(i==j){
                    row.push(1);
                }else{ 
                    row.push(0);
                }
            }
            identity.push(row);
        }

        let aux;
        let pivot;
        for(let i=0; i<rows; i++){
            if(matrix_aux[i][i]!=0){
                pivot=matrix_aux[i][i];
            }else{
                let found=false;
                for(let j=i+1; j<rows; j++){
                    if(matrix_aux[j][i]!=0){
                        let temp=matrix_aux[i];
                        matrix_aux[i]=matrix_aux[j];
                        matrix_aux[j]=temp;
                        found=true;
                        pivot=matrix_aux[i][i];
                        break;
                    }
                }
                if(!found){
                alert('La matriz no es invertible.');
                return;
                }
            }

            for(let k=0; k<cols; k++){
                matrix_aux[i][k]=matrix_aux[i][k]/pivot;
                identity[i][k]=identity[i][k]/pivot; 
            }

            for(let j=0; j<cols; j++){
                if(i!==j){
                    aux=matrix_aux[j][i];
                    for(let k=0; k<cols; k++){
                        matrix_aux[j][k]=matrix_aux[j][k]-aux*matrix_aux[i][k];
                        identity[j][k]=identity[j][k]-aux*identity[i][k];
                    }
                }
            }
        }

        const result=document.getElementById('inv');
        const original_res=result.innerHTML;
        result.innerHTML='';

        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ A^{-1} = ${matrix_latex(identity).slice(2, -2)} \\]
        </div>`;

        const restart_button=document.createElement('button');
        restart_button.innerText='Nuevo cálculo';
        restart_button.className='button';
        restart_button.onclick=() => {
            result.classList.remove('active');
            setTimeout(() => {
                result.innerHTML=original_res;
                result.classList.add('active');
            }, 400);
        }

        result.appendChild(restart_button);
        MathJax.typeset();
    }
}

function gauss(){ // - - - GAUSS - - - 
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('#gauss .box_1 textarea');
    const rows=parseInt(inputs[0].value);
    let cols=parseInt(inputs[1].value);

    if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
        alert('Ingrese números válidos para las filas y columnas.');
        return;
    }

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    let matrixA=[];
    const tableA=create_table(rows, cols+1, 'matrixA');
    tableA.style.marginTop='1rem';
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_gauss();

    container.appendChild(document.createElement('h2')).innerText='Matriz A';
    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';

    function calculate_gauss(){
        matrixA=read_matrix(tableA);
        const matrix_aux=read_matrix(tableA);

        if(!matrixA){
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const result=document.getElementById('gauss');
        const original_res=result.innerHTML;
        result.innerHTML='';

        let aux=0;
        let pivot=0;
        const variables=new Array(cols).fill(0);

        if(rows>cols){

            let adjustment=rows-cols;
            cols++;

            for(let i=0; i<rows-adjustment; i++){
                if(matrix_aux[i][i]!=0){
                    pivot=matrix_aux[i][i];
                }else{
                    i++;
                    break;
                }

                for(let k=0; k<cols; k++){
                    matrix_aux[i][k]=matrix_aux[i][k]/pivot;
                }

                for(let j=0; j<rows-adjustment; j++){
                    if(i<j){
                        aux=matrix_aux[j][i];
                        for(let k=0; k<cols; k++){
                            matrix_aux[j][k]=matrix_aux[j][k]-aux*matrix_aux[i][k];
                        }
                    }
                }
            }

            for(let i=rows-adjustment-1; i>=0; i--){
                let sum=0;
                for(let j=i; j<cols-1; j++){
                    sum+=matrix_aux[i][j]*variables[j];
                }
                variables[i]=matrix_aux[i][cols-1]-sum;
            }

            for(let i=rows-adjustment; i<rows; i++){
                let sum=0;
                for(let j=0; j<cols-1; j++){
                    sum+=matrix_aux[i][j]*variables[j];
                }

                console.log(`sum: ${sum}`);
                console.log(`matrix_aux: ${matrix_aux[i][cols-1]}`);

                if(sum!=matrix_aux[i][cols-1]){
                    alert('El sistema no tiene solución.');
                    result.innerHTML=original_res;
                    return;
                }else{ // Falta que si los valores son fracciones, se muestren en formato latex
                    latex_variables='\\[';
                    for(let i=0; i<variables.length; i++){
                        latex_variables+=`x_{${i + 1}}=${variables[i]}`;
                        if(i<variables.length-1) latex_variables+=',\\quad ';
                    }

                    latex_variables+='\\]';
                    result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
                        \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
                        \\[ B = ${matrix_latex(matrix_aux).slice(2, -2)} \\]
                        ${latex_variables}
                    </div>`;
                }
            }

        }else if(rows=cols){
            //Ecuaciones = variables
        }else{
            //Más variables que ecuaciones (Familia)
        }

        const restart_button=document.createElement('button');
        restart_button.innerText='Nuevo cálculo';
        restart_button.className='button';
        restart_button.onclick=() => {
            result.classList.remove('active');
            setTimeout(() => {
                result.innerHTML=original_res;
                result.classList.add('active');
            }, 400);
        }

        result.appendChild(restart_button);
        MathJax.typeset();
    }
}

function cramer(){ // - - - CRAMER - - - // Falta los casos en los que el sistema no tiene solución
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('#cramer .box_1 textarea');
    const rows=parseInt(inputs[0].value);
    let cols=parseInt(inputs[1].value);

    if(isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
        alert('Ingrese números válidos para las filas y columnas.');
        return;
    }
    
    if (rows !== cols){
        alert('El numero de variables debe ser igual al numero de ecuaciones.');
        return;
    } 

    const container=document.createElement('div');
    container.style.display='flex';
    container.style.flexDirection='column';
    container.style.alignItems='center';
    container.style.padding='2rem';
    container.style.backgroundColor='white';
    container.style.margin='5rem auto';
    container.style.width='fit-content';

    let matrixA=[];
    const tableA=create_table(rows, cols+1, 'matrixA');
    tableA.style.marginTop='1rem';
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_cramer();

    container.appendChild(document.createElement('h2')).innerText='Matriz A';
    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';
    
    function calculate_cramer(){
        matrixA=read_matrix(tableA);

        if(!matrixA){
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const result=document.getElementById('cramer');
        const original_res=result.innerHTML;
        result.innerHTML='';

        cols++;
        const B = new Array(rows);
        const variables = new Array(cols - 1);
        const matrix_coef = [];

        for (let i=0; i<rows; i++){
            const fila = [];
            for (let j=0; j<cols-1; j++){
                fila.push(matrixA[i][j]);
            }
            matrix_coef.push(fila);
        }
        
        for (let i=0; i<rows; i++){
            B[i] = matrixA[i][cols-1];
        }

        const det_A = determinant(matrix_coef);

        for (let i=0; i<cols-1; i++){
            const matrix_aux = matrix_det(matrix_coef, B, i, rows);
            variables[i] = (determinant(matrix_aux)/det_A);
        }
        console.log(variables);

        function matrix_det(A, B, col, tam){
            const matrix_aux = [];
            
            for (let i=0; i<tam; i++){
                const fila = [];
                for (let j=0; j<tam; j++){
                    fila.push(j == col ? B[i] : A[i][j]);
                }
                matrix_aux.push(fila);
            }
            return matrix_aux;
        }

        function gcd(a, b) {
            // Máximo común divisor
            return b === 0 ? a : gcd(b, a % b);
        }
        
        function simplificarFraccion(numerador, denominador) {
            const signo = (numerador * denominador < 0) ? '-' : '';
            numerador = Math.abs(numerador);
            denominador = Math.abs(denominador);
        
            const divisor = gcd(numerador, denominador);
            const num = numerador / divisor;
            const den = denominador / divisor;
        
            return { numerador: signo + num, denominador: den };
        }
        
        function soluciones_latex(A, B, variables) {
            const detA = determinant(A);
            let latex = '\\begin{aligned}';
        
            for (let i = 0; i < variables.length; i++) {
                const Ai = matrix_det(A, B, i, A.length);
                const detAi = determinant(Ai);
        
                const decimal = detAi / detA;
                const redondeado = Number(decimal.toFixed(3));
        
                if (Number.isInteger(decimal)) {
                    latex += `x_{${i + 1}} &= ${decimal} \\\\ `;
                } else {
                    const { numerador, denominador } = simplificarFraccion(detAi, detA);
                    latex += `x_{${i + 1}} &= \\frac{${numerador}}{${denominador}} = ${redondeado} \\\\ `;
                }
            }
        
            latex += '\\end{aligned}';
            return latex;
        }

        result.innerHTML = `
        <div style="font-size: 1.5rem; text-align: center;">
        \\[ A = ${matrix_latex(matrix_coef).slice(2, -2)} \\]
        \\[ B = ${matrix_latex(B.map(e => [e])).slice(2, -2)} \\]
        \\[ \\ ${soluciones_latex(matrix_coef, B, variables)} \\]
        </div>
        `;

        const restart_button=document.createElement('button');
        restart_button.innerText='Nuevo cálculo';
        restart_button.className='button';
        restart_button.onclick=() => {
            result.classList.remove('active');
            setTimeout(() => {
                result.innerHTML=original_res;
                result.classList.add('active');
            }, 400);
        }

        result.appendChild(restart_button);
        MathJax.typeset();
    }
}