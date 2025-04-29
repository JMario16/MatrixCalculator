function matrix_latex(matrix){ // - - - MATRIX TO LATEX - - - 
    let latex='\\[\\begin{bmatrix}';
    for(let i=0; i<matrix.length; i++){
        latex+=matrix[i].join(' & ');
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
                const val=parseFloat(col.value);
                if(isNaN(val)) return null;
                values.push(val);
            }
            matrix.push(values);
        }
        return matrix;
    }

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
    const scalar=parseFloat(inputs[2].value); 

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
                values.push(matrixA[i][j]*scalar);
            }
        matrixR.push(values);
        }

        const result=document.getElementById('scal');
        const original_res=result.innerHTML;
        result.innerHTML='';

        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ k = ${scalar} \\]
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

function trans(){
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

function det(){ // Hay un problema a la hora de hacer un nuevo cálculo
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

        det = determinante(matrixA);

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

        function determinante(A){
            const tam =  A.length;
            let det = 0;
            
            if (tam == 1){
                det = A[0][0];
            } else {
                for (let j = 0; j < tam; j++){
                    det = det + (A[0][j] * cofactor(A, 0, j));
                }
            }
        
            return det;
        }

        function cofactor(A, fila, columna){
            const tam = A.length;
            const submatriz = [];
            for (let i = 0; i < tam; i++){
                if (i !== fila){
                    const fila_aux = [];
                    for (let j = 0; j < tam; j++){
                        if (j !== columna){
                            fila_aux.push(A[i][j]);
                        }
                    }
                    submatriz.push(fila_aux);
                }
            }
        
            return Math.pow(-1, fila + columna) * determinante(submatriz);
        }
    }
}

function inverse(){
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('#inv .box_1 textarea');
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

        const identidad=[];
        for(let i=0; i<rows; i++){
            const fila=[];
            for(let j=0; j<cols; j++){
                if(i==j){
                    fila.push(1);
                }else{ 
                    fila.push(0);
                }
            }
            identidad.push(fila);
        }

        let pivote;
        let aux;

        for(let i=0; i<rows; i++){
            if(matrix_aux[i][i]!=0){
                pivote=matrix_aux[i][i];
            }else{
                let found=false;
                for(let j=i+1; j<rows; j++){
                    if(matrix_aux[j][i]!=0){
                        let temp=matrix_aux[i];
                        matrix_aux[i]=matrix_aux[j];
                        matrix_aux[j]=temp;
                        found=true;
                        pivote=matrix_aux[i][i];
                        break;
                    }
                }
                if(!found){
                alert('La matriz no es invertible.');
                return;
                }
            }

            for(let k=0; k<cols; k++){
                matrix_aux[i][k]=matrix_aux[i][k]/pivote;
                identidad[i][k]=identidad[i][k]/pivote; 
            }

            for(let j=0; j<cols; j++){
                if(i!==j){
                    aux=matrix_aux[j][i];
                    for(let k=0; k<cols; k++){
                        matrix_aux[j][k]=matrix_aux[j][k]-aux*matrix_aux[i][k];
                        identidad[j][k]=identidad[j][k]-aux*identidad[i][k];
                    }
                }
            }
        }

        const result=document.getElementById('inv');
        const original_res=result.innerHTML;
        result.innerHTML='';

        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ A^{-1} = ${matrix_latex(identidad).slice(2, -2)} \\]
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
