function matrix_latex(matrix){
    let latex='\\[\\begin{bmatrix}';
    for(let i=0; i<matrix.length; i++){
        latex+=matrix[i].join(' & ');
        if(i!==matrix.length-1) latex+=' \\\\ ';
    }
    latex+='\\end{bmatrix}\\]';
    return latex;
}

function sum_subs(n){
    const back=document.getElementById('back');
    document.body.style.overflow='hidden';
    back.innerHTML='';

    const inputs=document.querySelectorAll('.box_1 textarea');
    const rows= n===1 ? parseInt(inputs[0].value) : parseInt(inputs[2].value);
    const cols= n===1 ? parseInt(inputs[1].value) : parseInt(inputs[3].value);

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

    function create_table(nclass){
        const table=document.createElement('div');
        table.className=nclass;
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

    let matrixA=[];
    const tableA=create_table('matrixA');
    const following_button=document.createElement('button');
    following_button.innerText='Siguiente';
    following_button.className='button';
    following_button.onclick=() => show_following();
    
    let matrixB=[];
    const tableB=create_table('matrixB');
    const calc_button=document.createElement('button');
    calc_button.innerText='Calcular';
    calc_button.className='button';
    calc_button.onclick=() => calculate_sumsub();

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
        container.appendChild(tableB);
        container.appendChild(calc_button);
    }

    function read_matrix(table){
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

    function calculate_sumsub(){
        matrixB=read_matrix(tableB);
        if(!matrixB){
            alert('Ningún espacio puede quedar vacio.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const matrixS=[];
        for(let i=0;  i<rows; i++){
            const values=[];
            for(let j=0; j<cols; j++){
                if(n==1){
                    values.push(matrixA[i][j]+matrixB[i][j]);
                }else{
                    values.push(matrixA[i][j]-matrixB[i][j]);
                }
                
            }
            matrixS.push(values);
        }

        const result= n===1 ? document.getElementById('sum') : document.getElementById('subs');
        const symbol= n===1 ? '+' : '-';
        result.innerHTML='';
        result.innerHTML=`<div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ B = ${matrix_latex(matrixB).slice(2, -2)} \\]
            \\[ A ${symbol} B = ${matrix_latex(matrixS).slice(2, -2)} \\]
        </div>`;
        MathJax.typeset();
    }
}

function product(){
    const back = document.getElementById('back');
    document.body.style.overflow = 'hidden';
    back.innerHTML = '';

    const inputs = document.querySelectorAll('#product .box_1 textarea');
    const rowsA = parseInt(inputs[0].value);
    const colsA = parseInt(inputs[1].value);
    const rowsB = parseInt(inputs[2].value);
    const colsB = parseInt(inputs[3].value);

    if (
        isNaN(rowsA) || isNaN(colsA) || isNaN(rowsB) || isNaN(colsB) ||
        rowsA <= 0 || colsA <= 0 || rowsB <= 0 || colsB <= 0
    ) {
        alert('Por favor, ingrese números válidos para filas y columnas.');
        return;
    }

    if (colsA !== rowsB) {
        alert('El número de columnas de A debe ser igual al número de filas de B.');
        return;
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '2rem';
    container.style.backgroundColor = 'white';
    container.style.margin = '5rem auto';
    container.style.width = 'fit-content';

    function create_table(rows, cols, className) {
        const table = document.createElement('div');
        table.className = className;
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'text_table';
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('textarea');
                cell.rows = 1;
                cell.cols = 3;
                cell.style.margin = '0.3rem';
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        return table;
    }

    const tableA = create_table(rowsA, colsA, 'matrixA');
    const tableB = create_table(rowsB, colsB, 'matrixB');

    const calcBtn = document.createElement('button');
    calcBtn.innerText = 'Calcular';
    calcBtn.className = 'button';
    calcBtn.onclick = () => calculate_product();

    container.appendChild(document.createElement('h3')).innerText = 'Matriz A';
    container.appendChild(tableA);
    container.appendChild(document.createElement('h3')).innerText = 'Matriz B';
    container.appendChild(tableB);
    container.appendChild(calcBtn);
    back.appendChild(container);
    back.style.display = 'flex';
    back.style.justifyContent = 'center';
    back.style.alignItems = 'center';

    function read_matrix(table) {
        const rows_divs = table.querySelectorAll('.text_table');
        const matrix = [];
        for (let row of rows_divs) {
            const values = [];
            const cols_divs = row.querySelectorAll('textarea');
            for (let col of cols_divs) {
                const val = parseFloat(col.value);
                if (isNaN(val)) return null;
                values.push(val);
            }
            matrix.push(values);
        }
        return matrix;
    }

    function calculate_product() {
        const matrixA = read_matrix(tableA);
        const matrixB = read_matrix(tableB);

        if (!matrixA || !matrixB) {
            alert('Ningún espacio puede quedar vacío.');
            return;
        }
        
        const resultado = [];

        for (let i = 0; i < rowsA; i++){
            const fila = [];
            for (let j = 0; j < colsB ; j++){
                let suma = 0;
                for (let k = 0; k < colsA ; k++){
                    suma = suma + (matrixA[i][k] * matrixB[k][j]);
                }
                fila.push(suma);
            }
            resultado.push(fila);
        }

        document.body.style.overflow = 'auto';
        back.style.display = 'none';

        document.getElementById('product').innerHTML = `
        <div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ B = ${matrix_latex(matrixB).slice(2, -2)} \\]
            \\[ AB = ${matrix_latex(resultado).slice(2, -2)} \\]
        </div>`;
        MathJax.typeset();
    }
}

function scal(){
    const back = document.getElementById('back');
    document.body.style.overflow = 'hidden';
    back.innerHTML = '';

    const inputs = document.querySelectorAll('#scal .box_1 textarea');
    const rows = parseInt(inputs[0].value);
    const cols = parseInt(inputs[1].value);
    const escalar = parseFloat(inputs[2].value); 

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0 || isNaN(escalar)) {
        alert('Por favor, ingrese números válidos para filas, columnas y escalar.');
        return;
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '2rem';
    container.style.backgroundColor = 'white';
    container.style.margin = '5rem auto';
    container.style.width = 'fit-content';

    function create_table(nclass) {
        const table = document.createElement('div');
        table.className = nclass;
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'text_table';
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('textarea');
                cell.rows = 1;
                cell.cols = 3;
                cell.style.margin = '0.3rem';
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        return table;
    }

    let matrixA = [];
    const tableA = create_table('matrixA');
    const calc_button = document.createElement('button');
    calc_button.innerText = 'Calcular';
    calc_button.className = 'button';
    calc_button.onclick = () => calculate_scal();

    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display = 'flex';
    back.style.justifyContent = 'center';
    back.style.alignItems = 'center';

    function read_matrix(table) {
        const rows_divs = table.querySelectorAll('.text_table');
        const matrix = [];
        for (let row of rows_divs) {
            const values = [];
            const cols_divs = row.querySelectorAll('textarea');
            for (let col of cols_divs) {
                const val = parseFloat(col.value);
                if (isNaN(val)) return null;
                values.push(val);
            }
            matrix.push(values);
        }
        return matrix;
    }

    function calculate_scal() {
        matrixA = read_matrix(tableA);
        if (!matrixA) {
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const resultado = [];

        for (let i = 0; i < rows; i++){
            const fila = [];
            for (let j = 0;j < cols; j++){
                fila.push(matrixA[i][j] * escalar);
            }
        resultado.push(fila);
        }

        document.getElementById('scal').innerHTML = `
        <div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ k = ${escalar} \\]
            \\[ kA = ${matrix_latex(resultado).slice(2, -2)} \\]
        </div>`;
        MathJax.typeset();
        
    }
}

function trans(){
    const back = document.getElementById('back');
    document.body.style.overflow = 'hidden';
    back.innerHTML = '';

    const inputs = document.querySelectorAll('#trans .box_1 textarea');
    const rows = parseInt(inputs[0].value);
    const cols = parseInt(inputs[1].value);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert('Por favor, ingrese números válidos para filas y columnas.');
        return;
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '2rem';
    container.style.backgroundColor = 'white';
    container.style.margin = '5rem auto';
    container.style.width = 'fit-content';

    function create_table(nclass) {
        const table = document.createElement('div');
        table.className = nclass;
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'text_table';
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('textarea');
                cell.rows = 1;
                cell.cols = 3;
                cell.style.margin = '0.3rem';
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        return table;
    }

    let matrixA = [];
    const tableA = create_table('matrixA');
    const calc_button = document.createElement('button');
    calc_button.innerText = 'Calcular';
    calc_button.className = 'button';
    calc_button.onclick = () => calculate_trans();

    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display = 'flex';
    back.style.justifyContent = 'center';
    back.style.alignItems = 'center';

    function read_matrix(table) {
        const rows_divs = table.querySelectorAll('.text_table');
        const matrix = [];
        for (let row of rows_divs) {
            const values = [];
            const cols_divs = row.querySelectorAll('textarea');
            for (let col of cols_divs) {
                const val = parseFloat(col.value);
                if (isNaN(val)) return null;
                values.push(val);
            }
            matrix.push(values);
        }
        return matrix;
    }

    function calculate_trans() {
        matrixA = read_matrix(tableA);
        if (!matrixA) {
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const resultado = Array.from({ length: cols }, () => []);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                resultado[j][i] = matrixA[i][j];
            }
        }

        document.getElementById('trans').innerHTML = `
        <div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ A^T = ${matrix_latex(resultado).slice(2, -2)} \\]
        </div>`;
        MathJax.typeset();
        
    }
}

function det(){

}

function inverse(){ // falta checar los casos donde el pivote sea 0
    const back = document.getElementById('back');
    document.body.style.overflow = 'hidden';
    back.innerHTML = '';

    const inputs = document.querySelectorAll('#inv .box_1 textarea');
    const rows = parseInt(inputs[0].value);
    const cols = parseInt(inputs[1].value);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert('Por favor, ingrese números válidos para filas y columnas.');
        return;
    }
    if (rows !== cols){
        alert('La matriz debe ser cuadrada.');
        return;
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '2rem';
    container.style.backgroundColor = 'white';
    container.style.margin = '5rem auto';
    container.style.width = 'fit-content';

    function create_table(nclass) {
        const table = document.createElement('div');
        table.className = nclass;
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'text_table';
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('textarea');
                cell.rows = 1;
                cell.cols = 3;
                cell.style.margin = '0.3rem';
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        return table;
    }

    let matrixA = [];
    const tableA = create_table('matrixA');
    const calc_button = document.createElement('button');
    calc_button.innerText = 'Calcular';
    calc_button.className = 'button';
    calc_button.onclick = () => calculate_inv();

    container.appendChild(tableA);
    container.appendChild(calc_button);

    back.appendChild(container);
    back.style.display = 'flex';
    back.style.justifyContent = 'center';
    back.style.alignItems = 'center';

    function read_matrix(table) {
        const rows_divs = table.querySelectorAll('.text_table');
        const matrix = [];
        for (let row of rows_divs) {
            const values = [];
            const cols_divs = row.querySelectorAll('textarea');
            for (let col of cols_divs) {
                const val = parseFloat(col.value);
                if (isNaN(val)) return null;
                values.push(val);
            }
            matrix.push(values);
        }
        return matrix;
    }

    function calculate_inv() {
        matrixA = read_matrix(tableA);
        const matrix_aux = read_matrix(tableA);
        if (!matrixA) {
            alert('Ningún espacio puede quedar vacío.');
            return;
        }

        document.body.style.overflow='auto';
        back.style.display='none';

        const identidad = [];

        for (let i = 0; i < rows; i++){
            const fila = [];
            for (let j = 0; j < cols; j++){
                if (i == j){
                    fila.push(1);
                } else { 
                    fila.push(0);
                }
            }
            identidad.push(fila);
        }

        let pivote;
        let aux;

        for (let i = 0; i < rows; i++){
            pivote = matrix_aux[i][i];

            for (let k = 0; k < cols; k++){
                matrix_aux[i][k] = matrix_aux[i][k] / pivote;
                identidad[i][k] = identidad[i][k] / pivote; 
            }

            for (let j = 0; j < cols; j++){
                if (i !== j){
                    aux = matrix_aux[j][i];
                    for (let k = 0; k < cols; k++){
                        matrix_aux[j][k] = matrix_aux[j][k] - aux * matrix_aux[i][k];
                        identidad[j][k] = identidad[j][k] - aux * identidad[i][k];
                    }
                }
            }
        }

        document.getElementById('inv').innerHTML = `
        <div style="font-size: 1.5rem; text-align: center;">
            \\[ A = ${matrix_latex(matrixA).slice(2, -2)} \\]
            \\[ A^{-1} = ${matrix_latex(identidad).slice(2, -2)} \\]
        </div>`;
        MathJax.typeset();
        
    }
}